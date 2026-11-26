import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getPendingSales,
  openDB,
  removePendingSale,
  savePendingSale,
} from './offlineQueue';

function createMockIndexedDB({
  failOpen = false,
  failTransaction = false,
  abortTransaction = false,
  abortWithError = true,
  failGetAll = false,
} = {}) {
  const storeData = new Map();
  let storeExists = false;
  const closeSpy = vi.fn();
  const createObjectStoreSpy = vi.fn((name) => {
    if (name === 'pending-sales') {
      storeExists = true;
    }
    return {};
  });

  const db = {
    objectStoreNames: {
      contains: (name) => name === 'pending-sales' && storeExists,
    },
    createObjectStore: createObjectStoreSpy,
    close: closeSpy,
    transaction: vi.fn((storeName, mode) => {
      if (storeName !== 'pending-sales') {
        throw new Error(`Unexpected store: ${storeName}`);
      }

      const tx = {
        mode,
        error: null,
        oncomplete: null,
        onerror: null,
        onabort: null,
        objectStore: () => ({
          add: (sale) => {
            queueMicrotask(() => {
              if (failTransaction) {
                tx.error = new Error('QuotaExceededError');
                tx.onerror?.();
                return;
              }
              if (abortTransaction) {
                tx.error = abortWithError ? new Error('Transaction aborted') : null;
                tx.onabort?.();
                return;
              }
              if (storeData.has(sale.client_op_uuid)) {
                tx.error = new Error('ConstraintError: duplicate key');
                tx.onerror?.();
                return;
              }
              storeData.set(sale.client_op_uuid, sale);
              tx.oncomplete?.();
            });
          },
          getAll: () => {
            const req = { result: null, error: null, onsuccess: null, onerror: null };
            queueMicrotask(() => {
              if (failGetAll) {
                req.error = new Error('ReadError');
                req.onerror?.();
                return;
              }
              req.result = Array.from(storeData.values());
              req.onsuccess?.();
            });
            return req;
          },
          delete: (key) => {
            queueMicrotask(() => {
              if (failTransaction) {
                tx.error = new Error('DeleteError');
                tx.onerror?.();
                return;
              }
              if (abortTransaction) {
                tx.error = abortWithError ? new Error('Delete aborted') : null;
                tx.onabort?.();
                return;
              }
              storeData.delete(key);
              tx.oncomplete?.();
            });
          },
        }),
      };
      return tx;
    }),
  };

  const indexedDBMock = {
    open: vi.fn(() => {
      const req = { result: db, error: null, onsuccess: null, onupgradeneeded: null, onerror: null };
      queueMicrotask(() => {
        if (failOpen) {
          req.error = new Error('IndexedDB indisponible');
          req.onerror?.();
          return;
        }
        if (!storeExists) {
          req.onupgradeneeded?.({ target: { result: db } });
        }
        req.onsuccess?.({ target: { result: db } });
      });
      return req;
    }),
  };

  return { indexedDBMock, closeSpy, createObjectStoreSpy, storeData };
}

describe('offlineQueue — Résilience IndexedDB et gestion des pannes', () => {
  const originalIndexedDB = globalThis.indexedDB;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    if (originalIndexedDB === undefined) {
      delete globalThis.indexedDB;
    } else {
      globalThis.indexedDB = originalIndexedDB;
    }
  });

  it('crée le store pending-sales à la première ouverture sans le recréer ensuite', async () => {
    const { indexedDBMock, createObjectStoreSpy } = createMockIndexedDB();
    globalThis.indexedDB = indexedDBMock;

    await openDB();
    await openDB();

    expect(indexedDBMock.open).toHaveBeenCalledWith('vendix-offline', 1);
    expect(createObjectStoreSpy).toHaveBeenCalledTimes(1);
    expect(createObjectStoreSpy).toHaveBeenCalledWith('pending-sales', {
      keyPath: 'client_op_uuid',
    });
  });

  it('exécute le cycle complet hors-ligne (ajout, lecture, suppression ciblée) et ferme la DB à chaque opération', async () => {
    const { indexedDBMock, closeSpy } = createMockIndexedDB();
    globalThis.indexedDB = indexedDBMock;

    const sale1 = { client_op_uuid: 'op-1', total_amount: 2500, lines: [] };
    const sale2 = { client_op_uuid: 'op-2', total_amount: 8000, lines: [] };

    await savePendingSale(sale1);
    await savePendingSale(sale2);

    const pendingBefore = await getPendingSales();
    expect(pendingBefore).toEqual([sale1, sale2]);

    await removePendingSale('op-1');

    const pendingAfter = await getPendingSales();
    expect(pendingAfter).toEqual([sale2]);
    expect(closeSpy).toHaveBeenCalledTimes(5);
  });

  it('rejette les doublons de client_op_uuid et ferme proprement la connexion DB', async () => {
    const { indexedDBMock, closeSpy } = createMockIndexedDB();
    globalThis.indexedDB = indexedDBMock;

    const sale = { client_op_uuid: 'op-dup', total_amount: 1500 };
    await savePendingSale(sale);

    await expect(savePendingSale(sale)).rejects.toThrow('ConstraintError');
    expect(closeSpy).toHaveBeenCalledTimes(2);
  });

  it('propage l erreur si indexedDB.open échoue', async () => {
    const { indexedDBMock } = createMockIndexedDB({ failOpen: true });
    globalThis.indexedDB = indexedDBMock;

    await expect(getPendingSales()).rejects.toThrow('IndexedDB indisponible');
  });

  it('ferme la DB et rejette proprement lors d un abort de transaction (avec ou sans erreur native)', async () => {
    const withErr = createMockIndexedDB({ abortTransaction: true, abortWithError: true });
    globalThis.indexedDB = withErr.indexedDBMock;
    await expect(savePendingSale({ client_op_uuid: 'op-a' })).rejects.toThrow('Transaction aborted');
    expect(withErr.closeSpy).toHaveBeenCalledTimes(1);

    const withoutErr = createMockIndexedDB({ abortTransaction: true, abortWithError: false });
    globalThis.indexedDB = withoutErr.indexedDBMock;
    await expect(removePendingSale('op-a')).rejects.toThrow('Transaction annulée');
    expect(withoutErr.closeSpy).toHaveBeenCalledTimes(1);
  });

  it('ferme la DB et propage l erreur si getAll échoue', async () => {
    const { indexedDBMock, closeSpy } = createMockIndexedDB({ failGetAll: true });
    globalThis.indexedDB = indexedDBMock;

    await expect(getPendingSales()).rejects.toThrow('ReadError');
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
