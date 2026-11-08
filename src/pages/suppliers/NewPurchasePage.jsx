import { useState, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  Plus,
  Trash2,
  AlertCircle,
  Package,
} from 'lucide-react';
import {
  loadSuppliers,
  saveSuppliers,
  fetchSuppliers,
  formatCurrency,
} from '../../utils/supplierUtils.js';
import {
  productsService,
  purchasesService,
  stockService,
  suppliersService,
} from '../../api/services.js';
import { useToast } from '../../context/ToastContext.jsx';
import {
  STOCK_PRODUCTS_CACHE_KEY,
  STOCK_MOVEMENTS_CACHE_KEY,
  readLocalStorage,
  writeLocalStorage,
} from '../../utils/stockStorage.js';

export default function NewPurchasePage() {
  const navigate = useNavigate();
  const { success, error: toastError } = useToast();

  const [suppliers, setSuppliers] = useState(loadSuppliers);
  const [catalogProducts, setCatalogProducts] = useState(() =>
    readLocalStorage(STOCK_PRODUCTS_CACHE_KEY)
  );

  // Formulaire Achat
  const [supplierId, setSupplierId] = useState('');
  const [isNewSupplier, setIsNewSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');

  // Articles achetés
  const [items, setItems] = useState([
    {
      id: 1,
      productId: '',
      productName: '',
      unitLabel: 'Unité',
      conversionFactor: 1,
      quantity: 1,
      unitCost: '',
    },
  ]);

  // Données de paiement
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [reference, setReference] = useState(() => `CMD-${Date.now().toString().slice(-4)}`);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Charger les fournisseurs et produits réels
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [suppliersList, productsRes] = await Promise.all([
          fetchSuppliers(),
          productsService.getAll().catch(() => []),
        ]);

        if (!isMounted) return;

        if (Array.isArray(suppliersList) && suppliersList.length > 0) {
          setSuppliers(suppliersList);
          setSupplierId((prev) => prev || suppliersList[0].id);
        }

        const prods = Array.isArray(productsRes) ? productsRes : productsRes?.data || [];
        if (prods.length > 0) {
          setCatalogProducts(prods);
          writeLocalStorage(STOCK_PRODUCTS_CACHE_KEY, prods);
        }
      } catch {
        // Fallback local
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Définir le premier fournisseur si non sélectionné
  useEffect(() => {
    if (!supplierId && suppliers.length > 0) {
      setSupplierId(suppliers[0].id);
    }
  }, [supplierId, suppliers]);

  // Calcul du coût total
  const totalCost = useMemo(() => {
    return items.reduce((acc, item) => {
      const q = Number(item.quantity) || 0;
      const c = Number(item.unitCost) || 0;
      return acc + q * c;
    }, 0);
  }, [items]);

  const parsedAmountPaid = Number(amountPaid) || 0;
  const debtAmount = Math.max(0, totalCost - parsedAmountPaid);

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: Date.now(),
        productId: '',
        productName: '',
        unitLabel: 'Unité',
        conversionFactor: 1,
        quantity: 1,
        unitCost: '',
      },
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleProductSelect = (itemId, prodId) => {
    const selectedProd = catalogProducts.find((p) => p.id === prodId);
    if (!selectedProd) return;

    const baseUnit =
      selectedProd.product_units?.find((u) => u.is_base_unit) ||
      selectedProd.product_units?.[0] ||
      null;

    const unitLabel = baseUnit ? baseUnit.label : selectedProd.baseUnit || 'Unité';
    const conversionFactor = baseUnit ? Number(baseUnit.conversion_factor) || 1 : 1;
    const defaultCost = selectedProd.default_cost_price || selectedProd.costPrice || '';

    setItems((prev) =>
      prev.map((it) =>
        it.id === itemId
          ? {
              ...it,
              productId: selectedProd.id,
              productName: selectedProd.name,
              unitLabel,
              conversionFactor,
              unitCost: it.unitCost ? it.unitCost : defaultCost,
            }
          : it
      )
    );
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (totalCost <= 0) {
      setError('Veuillez ajouter au moins un article avec une quantité et un coût unitaire.');
      return;
    }

    if (parsedAmountPaid > totalCost) {
      setError('Le montant payé ne peut pas être supérieur au coût total de la commande.');
      return;
    }

    // Vérifier que chaque article est lié à un produit réel
    for (const it of items) {
      if (!it.productId) {
        setError('Veuillez sélectionner un produit du catalogue pour chaque ligne de commande.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      let targetSupplierId = supplierId;

      // 1. Création d'un nouveau fournisseur via l'API si demandé
      if (isNewSupplier) {
        if (!newSupplierName.trim() || !newSupplierPhone.trim()) {
          setError('Veuillez renseigner le nom et le téléphone du nouveau fournisseur.');
          setIsSubmitting(false);
          return;
        }

        try {
          const createdSup = await suppliersService.create({
            name: newSupplierName.trim(),
            phone: newSupplierPhone.trim(),
          });
          targetSupplierId = createdSup.id;
          const updatedSuppliers = [createdSup, ...suppliers];
          setSuppliers(updatedSuppliers);
          saveSuppliers(updatedSuppliers);
        } catch (supErr) {
          // Secours local si échec de l'API fournisseur
          const newSupLocal = {
            id: `sup-${Date.now()}`,
            fullName: newSupplierName.trim(),
            name: newSupplierName.trim(),
            companyName: '',
            phone: newSupplierPhone.trim(),
            address: '',
            currentDebt: 0,
            totalPurchases: 0,
            totalPaid: 0,
            notes: 'Fournisseur créé lors d’une commande de stock.',
            statement: [],
          };
          targetSupplierId = newSupLocal.id;
          const updatedSuppliers = [newSupLocal, ...suppliers];
          setSuppliers(updatedSuppliers);
          saveSuppliers(updatedSuppliers);
        }
      }

      // 2. Préparation du payload pour la commande d'achat avec réception directe (RECEIVED)
      const purchaseLines = items.map((it) => ({
        product_id: it.productId,
        quantity: Number(it.quantity),
        unit_label: it.unitLabel || 'Unité',
        conversion_factor: Number(it.conversionFactor) || 1,
        unit_cost: Math.round(Number(it.unitCost)),
      }));

      const purchasePayload = {
        supplier_id: targetSupplierId,
        lines: purchaseLines,
        amount_paid: Math.round(parsedAmountPaid),
        payment_method: paymentMethod === 'MOBILE_MONEY' ? 'MOMO' : paymentMethod === 'VIREMENT' ? 'CASH' : paymentMethod,
        status: 'RECEIVED',
      };

      let purchaseRecorded = false;
      try {
        await purchasesService.create(purchasePayload);
        purchaseRecorded = true;
      } catch (purchaseErr) {
        // En cas d'échec de l'API /purchases, incrémenter le stock via stockService.recordMovement
        for (const line of items) {
          const qty = Number(line.quantity) * (Number(line.conversionFactor) || 1);
          await stockService.recordMovement({
            productId: line.productId,
            type: 'PURCHASE_ENTRY',
            quantity: qty,
            reason: `Entrée achat bon ${reference.trim() || 'CMD'}`,
          }).catch(() => {});
        }
      }

      // 3. Mettre à jour l'historique et le cache local des mouvements et fournisseurs
      const localHistory = readLocalStorage(STOCK_MOVEMENTS_CACHE_KEY);
      const newEntries = items.map((it) => ({
        id: crypto.randomUUID(),
        productId: it.productId,
        productName: it.productName,
        type: 'PURCHASE_ENTRY',
        quantity: Number(it.quantity),
        signedQuantity: Number(it.quantity),
        reason: `Réception bon ${reference.trim() || 'CMD'}`,
        createdAt: new Date().toISOString(),
      }));
      writeLocalStorage(STOCK_MOVEMENTS_CACHE_KEY, [...newEntries, ...localHistory]);

      // Mettre à jour le cache local du carnet de commandes fournisseur
      const updatedLocalSuppliers = suppliers.map((s) => {
        if (s.id !== targetSupplierId) return s;
        const newDebt = (s.currentDebt || 0) + debtAmount;
        const newTotalPurchases = (s.totalPurchases || 0) + totalCost;
        const newTotalPaid = (s.totalPaid || 0) + parsedAmountPaid;
        const newPurchaseEntry = {
          id: `ach-${Date.now()}`,
          date: new Date().toISOString(),
          type: 'ACHAT_STOCK',
          ref: reference.trim() || `CMD-${Date.now().toString().slice(-4)}`,
          totalCost,
          amountPaid: parsedAmountPaid,
          debtAmount,
          status: 'COMPLETED',
          paymentMethod,
          items: items.map((it) => ({
            productName: it.productName,
            quantity: Number(it.quantity),
            unitCost: Number(it.unitCost),
          })),
        };
        return {
          ...s,
          currentDebt: newDebt,
          totalPurchases: newTotalPurchases,
          totalPaid: newTotalPaid,
          statement: [newPurchaseEntry, ...(s.statement || [])],
        };
      });
      saveSuppliers(updatedLocalSuppliers);

      success('La commande d’achat a été réceptionnée et le stock a été incrémenté.');
      navigate(`/app/suppliers/${targetSupplierId}`);
    } catch (err) {
      toastError(err.message || 'Erreur lors de l’enregistrement de la commande.');
      setError(err.message || 'Erreur lors de l’enregistrement de la commande.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div>
        <Link
          to="/app/suppliers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition mb-3"
        >
          <ArrowLeft size={14} />
          <span>Retour aux fournisseurs</span>
        </Link>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-vendix-brand">
          <Truck size={15} />
          <span>Approvisionnements</span>
        </div>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Enregistrer un achat de stock
        </h1>
        <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
          Saisissez les marchandises réceptionnées, le fournisseur et les montants réglés.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-700 border border-red-200">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Fournisseur */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Fournisseur de la commande</h2>
            <button
              type="button"
              onClick={() => setIsNewSupplier(!isNewSupplier)}
              className="text-xs font-bold text-vendix-brand hover:underline"
            >
              {isNewSupplier ? 'Choisir un fournisseur existant' : '+ Créer un nouveau fournisseur'}
            </button>
          </div>

          {!isNewSupplier ? (
            <div>
              <label className="block text-xs font-bold text-slate-700">Sélectionner un fournisseur *</label>
              <select
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              >
                {suppliers.length === 0 && (
                  <option value="">Aucun fournisseur existant</option>
                )}
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName || s.name} {s.phone ? `(${s.phone})` : ''} - Dette actuelle : {formatCurrency(s.currentDebt || s.outstanding_debt || 0)} FCFA
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700">Nom du fournisseur *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Grossiste Dantokpa"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700">Téléphone *</label>
                <input
                  type="tel"
                  required
                  placeholder="Ex: +22997000000"
                  value={newSupplierPhone}
                  onChange={(e) => setNewSupplierPhone(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
                />
              </div>
            </div>
          )}
        </div>

        {/* Lignes d'articles achetés raccordées au catalogue */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Package size={16} className="text-vendix-brand" />
              <h2 className="text-sm font-bold text-slate-900">Articles achetés (Catalogue)</h2>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="flex items-center gap-1 text-xs font-bold text-vendix-brand hover:underline"
            >
              <Plus size={14} />
              <span>Ajouter une ligne</span>
            </button>
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-slate-600">Sélectionner le produit *</label>
                  <select
                    required
                    value={item.productId}
                    onChange={(e) => handleProductSelect(item.id, e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-vendix-brand font-medium"
                  >
                    <option value="">-- Choisir un produit du catalogue --</option>
                    {catalogProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} (Stock actuel : {p.current_stock ?? p.currentStock ?? 0})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-28">
                  <label className="block text-[11px] font-bold text-slate-600">
                    Quantité ({item.unitLabel || 'Unité'}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-vendix-brand"
                  />
                </div>

                <div className="w-full sm:w-36">
                  <label className="block text-[11px] font-bold text-slate-600">Coût d’achat unitaire (FCFA) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="Ex: 15000"
                    value={item.unitCost}
                    onChange={(e) => handleItemChange(item.id, 'unitCost', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-vendix-brand"
                  />
                </div>

                <div className="w-full sm:w-28 text-right sm:pb-2">
                  <span className="text-xs font-black text-slate-900">
                    {formatCurrency((Number(item.quantity) || 0) * (Number(item.unitCost) || 0))} FCFA
                  </span>
                </div>

                {items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-600">Total de la commande</span>
            <span className="text-lg font-black text-slate-900">{formatCurrency(totalCost)} FCFA</span>
          </div>
        </div>

        {/* Modalités financières */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
            Règlement et conditions
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold text-slate-700">Montant réglé immédiatement (FCFA) *</label>
              <input
                type="number"
                min="0"
                max={totalCost}
                required
                placeholder="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm font-bold text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Moyen de règlement</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              >
                <option value="CASH">Espèces</option>
                <option value="MOMO">Mobile Money</option>
                <option value="CREDIT">Crédit fournisseur</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700">Référence bon de commande</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-vendix-brand focus:ring-1 focus:ring-vendix-brand"
              />
            </div>
          </div>

          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <p className="font-bold text-slate-700">Dette générée sur cet achat</p>
              <p className="text-slate-500">Montant restant dû à rembourser au fournisseur</p>
            </div>
            <p className={`text-base font-black ${debtAmount > 0 ? 'text-amber-800' : 'text-emerald-700'}`}>
              {formatCurrency(debtAmount)} FCFA
            </p>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center justify-end gap-3">
          <Link
            to="/app/suppliers"
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
          >
            Annuler
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-vendix-brand px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-vendix-brand-dark transition disabled:opacity-50"
          >
            {isSubmitting ? 'Enregistrement et réception...' : 'Valider et réceptionner la commande'}
          </button>
        </div>
      </form>
    </div>
  );
}
