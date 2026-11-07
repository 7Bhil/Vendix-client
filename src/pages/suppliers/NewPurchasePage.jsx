import { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Truck,
  Plus,
  Trash2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Package,
} from 'lucide-react';
import {
  loadSuppliers,
  saveSuppliers,
  formatCurrency,
} from '../../utils/supplierUtils.js';

export default function NewPurchasePage() {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState(loadSuppliers);

  // Formulaire Achat
  const [supplierId, setSupplierId] = useState(suppliers[0]?.id || '');
  const [isNewSupplier, setIsNewSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState('');
  const [newSupplierPhone, setNewSupplierPhone] = useState('');

  // Articles achetés
  const [items, setItems] = useState([
    { id: 1, productName: '', quantity: 1, unitCost: '' },
  ]);

  // Données de paiement
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('ESPECE');
  const [reference, setReference] = useState(`CMD-${Date.now().toString().slice(-4)}`);
  const [error, setError] = useState('');

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
      { id: Date.now(), productName: '', quantity: 1, unitCost: '' },
    ]);
  };

  const handleRemoveItem = (id) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleItemChange = (id, field, value) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)),
    );
  };

  const handleSubmit = (e) => {
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

    let targetSupplierId = supplierId;
    let currentSuppliers = [...suppliers];

    // Création d'un nouveau fournisseur à la volée si demandé
    if (isNewSupplier) {
      if (!newSupplierName.trim() || !newSupplierPhone.trim()) {
        setError('Veuillez renseigner le nom et le téléphone du nouveau fournisseur.');
        return;
      }

      const newSup = {
        id: `sup-${Date.now()}`,
        fullName: newSupplierName.trim(),
        companyName: '',
        phone: newSupplierPhone.trim(),
        address: '',
        currentDebt: 0,
        totalPurchases: 0,
        totalPaid: 0,
        notes: 'Fournisseur créé lors d’une commande de stock.',
        statement: [],
      };

      currentSuppliers.unshift(newSup);
      targetSupplierId = newSup.id;
    }

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
        productName: it.productName.trim(),
        quantity: Number(it.quantity),
        unitCost: Number(it.unitCost),
      })),
    };

    const updated = currentSuppliers.map((s) => {
      if (s.id !== targetSupplierId) return s;

      const newDebt = (s.currentDebt || 0) + debtAmount;
      const newTotalPurchases = (s.totalPurchases || 0) + totalCost;
      const newTotalPaid = (s.totalPaid || 0) + parsedAmountPaid;

      return {
        ...s,
        currentDebt: newDebt,
        totalPurchases: newTotalPurchases,
        totalPaid: newTotalPaid,
        statement: [newPurchaseEntry, ...(s.statement || [])],
      };
    });

    saveSuppliers(updated);
    navigate(`/app/suppliers/${targetSupplierId}`);
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
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.fullName} {s.phone ? `(${s.phone})` : ''} - Dette actuelle : {formatCurrency(s.currentDebt)} FCFA
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

        {/* Lignes d'articles achetés */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900">Marchandises reçues</h2>
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
            {items.map((item, index) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-end bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <div className="flex-1 w-full">
                  <label className="block text-[11px] font-bold text-slate-600">Désignation du produit *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Sac de Riz 25kg"
                    value={item.productName}
                    onChange={(e) => handleItemChange(item.id, 'productName', e.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 outline-none focus:border-vendix-brand"
                  />
                </div>

                <div className="w-full sm:w-28">
                  <label className="block text-[11px] font-bold text-slate-600">Quantité *</label>
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
                  <label className="block text-[11px] font-bold text-slate-600">Prix unitaire (FCFA) *</label>
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
                <option value="ESPECE">Espèces</option>
                <option value="MOBILE_MONEY">Mobile Money</option>
                <option value="VIREMENT">Virement bancaire</option>
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
            className="rounded-xl bg-vendix-brand px-6 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-vendix-brand-dark transition"
          >
            Valider et enregistrer l’achat
          </button>
        </div>
      </form>
    </div>
  );
}
