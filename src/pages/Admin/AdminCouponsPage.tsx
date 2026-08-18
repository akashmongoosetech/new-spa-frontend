import React, { useEffect, useState } from 'react';
import { Ticket, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { showToast } from '../../utils/toastEvents';

interface CouponItem {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingAmount: number;
  validUntil: string;
  active: boolean;
  usageCount: number;
}

export const AdminCouponsPage: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [code, setCode] = useState('');
  const [discountValue, setDiscountValue] = useState(10);
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [minBookingAmount, setMinBookingAmount] = useState(0);
  const [validUntil, setValidUntil] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const load = async () => {
    try {
      const c = await api.getCoupons();
      if (Array.isArray(c)) setCoupons(c as any);
    } catch (err) {
      // keep empty state
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setSaving(true);
    try {
      await api.createCoupon({
        code: code.trim(),
        discountType,
        discountValue,
        minBookingAmount,
        validUntil,
      });
      await load();
      setCode('');
      setDiscountValue(10);
      setDiscountType('percentage');
      setMinBookingAmount(0);
      setValidUntil('');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      showToast({ type: 'error', title: 'Create Failed', message: err?.message || 'Failed to create coupon.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon permanently?')) return;
    try {
      await api.deleteCoupon(id);
      setCoupons((prev) => prev.filter((c) => c.id !== id));
    } catch (err: any) {
      showToast({ type: 'error', title: 'Delete Failed', message: err?.message || 'Failed to delete coupon.' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Coupon & Promotions Manager</h1>
        <p className="text-xs text-gray-500 mt-1">Create and manage discount codes redeemable at the booking checkout</p>
      </div>

      {saved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Coupon created successfully.</span>
        </div>
      )}

      <form onSubmit={handleAdd} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="CODE e.g. AURA10"
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs uppercase outline-none focus:border-[#2CB5A0]"
        />
        <select
          value={discountType}
          onChange={(e) => setDiscountType(e.target.value as any)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none bg-white"
        >
          <option value="percentage">% Off</option>
          <option value="fixed">₹ Off</option>
        </select>
        <input
          type="number"
          required
          min={1}
          value={discountValue}
          onChange={(e) => setDiscountValue(Number(e.target.value))}
          placeholder={discountType === 'percentage' ? 'Discount %' : 'Discount ₹'}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2CB5A0]"
        />
        <input
          type="number"
          min={0}
          value={minBookingAmount}
          onChange={(e) => setMinBookingAmount(Number(e.target.value))}
          placeholder="Min booking ₹"
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2CB5A0]"
        />
        <input
          type="date"
          value={validUntil}
          onChange={(e) => setValidUntil(e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2.5 text-xs outline-none focus:border-[#2CB5A0]"
        />
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2.5 bg-[#2CB5A0] hover:bg-[#259b89] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          {saving ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>

      {coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-sm text-gray-400 flex flex-col items-center gap-2">
          <Ticket className="w-8 h-8 text-gray-300" />
          <span>No coupons yet. Create your first promotional code above.</span>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 font-semibold uppercase tracking-wider border-b">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Discount</th>
                  <th className="p-4">Min Booking</th>
                  <th className="p-4">Valid Until</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Usage</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {coupons.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 font-bold text-gray-900">{c.code}</td>
                    <td className="p-4 text-gray-600">
                      {c.discountType === 'percentage' ? `${c.discountValue}% off` : `₹${c.discountValue} off`}
                    </td>
                    <td className="p-4 text-gray-600">₹{c.minBookingAmount}</td>
                    <td className="p-4 text-gray-600">{c.validUntil ? new Date(c.validUntil).toLocaleDateString() : 'Never expires'}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${c.active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{c.usageCount} uses</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1.5 text-gray-500 hover:text-rose-600 inline-block cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCouponsPage;