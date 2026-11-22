
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("vendix-offline", 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      if (!db.objectStoreNames.contains("pending-sales")) {
        db.createObjectStore("pending-sales", {
          keyPath: "client_op_uuid",
        });
      }
    };

    request.onerror = () => {
      reject(request.error);
    };
  });
}

async function savePendingSale(sale) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("pending-sales", "readwrite");

    const store = transaction.objectStore("pending-sales");

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error || new Error("Transaction annulée"));
    };

    store.add(sale);
  });
}



async function getPendingSales() {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("pending-sales", "readonly");

    const store = transaction.objectStore("pending-sales");

    const request = store.getAll();

    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };

    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}



async function removePendingSale(clientOpUuid) {
  const db = await openDB();

  return new Promise((resolve, reject) => {
    const transaction = db.transaction("pending-sales", "readwrite");
    const store = transaction.objectStore("pending-sales");

    transaction.oncomplete = () => {
      db.close();
      resolve();
    };

    transaction.onerror = () => {
      db.close();
      reject(transaction.error);
    };

    transaction.onabort = () => {
      db.close();
      reject(transaction.error || new Error("Transaction annulée"));
    };

    store.delete(clientOpUuid);
  });
}

export {
  openDB,
  savePendingSale,
  getPendingSales,
  removePendingSale,
};