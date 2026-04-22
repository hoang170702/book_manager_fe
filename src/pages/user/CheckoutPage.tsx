import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../store/cartStore';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', address: '' });

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">No Items to Checkout</h1>
        <Link to="/books" className="btn-primary">Browse Books</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.phone || !form.address) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    // Simulate order placement
    await new Promise(resolve => setTimeout(resolve, 1500));
    clearCart();
    toast.success('Order placed successfully! 🎉');
    navigate('/');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Shipping Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
              <input name="fullName" value={form.fullName} onChange={handleChange}
                className="input-field" placeholder="Nguyen Van A" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange}
                  className="input-field" placeholder="email@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  className="input-field" placeholder="0901234567" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Address</label>
              <textarea name="address" value={form.address} onChange={handleChange}
                rows={3} className="input-field resize-none" placeholder="123 Street, District, City" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 text-lg">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Processing...
                </span>
              ) : 'Place Order'}
            </button>
          </form>
        </div>

        {/* Summary */}
        <div>
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Order Summary</h2>
            <div className="space-y-3 max-h-[40vh] overflow-y-auto mb-4">
              {items.map(item => (
                <div key={item.book.id} className="flex gap-3">
                  <img src={item.book.image} alt={item.book.title}
                    className="w-12 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                      {item.book.title}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">x{item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 shrink-0">
                    {formatPrice(item.book.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <hr className="border-gray-200 dark:border-surface-700 my-4" />
            <div className="flex justify-between">
              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
              <span className="text-lg font-bold text-gradient">{formatPrice(getTotalPrice())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
