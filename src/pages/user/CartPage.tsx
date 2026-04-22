import { Link } from 'react-router-dom';
import { HiOutlineTrash, HiPlus, HiMinus, HiOutlineShoppingCart } from 'react-icons/hi';
import { useCartStore } from '../../store/cartStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center animate-fade-in">
        <HiOutlineShoppingCart className="w-20 h-20 mx-auto text-gray-300 dark:text-gray-600 mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">Your Cart is Empty</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-6">Looks like you haven't added any books yet.</p>
        <Link to="/books" className="btn-primary">Browse Books</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(item => (
            <div key={item.book.id}
              className="glass-card flex gap-4 p-4 animate-fade-in">
              <Link to={`/books/${item.book.id}`} className="shrink-0">
                <img src={item.book.image} alt={item.book.title}
                  className="w-20 h-28 object-cover rounded-xl" />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/books/${item.book.id}`}
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:text-primary-600
                    dark:hover:text-primary-400 transition-colors line-clamp-1">
                  {item.book.title}
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.book.author.name}</p>
                <p className="text-lg font-bold text-primary-600 dark:text-primary-400 mt-1">
                  {formatPrice(item.book.price)}
                </p>

                <div className="flex items-center justify-between mt-3">
                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.book.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-surface-700
                        flex items-center justify-center hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
                    >
                      <HiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-semibold text-gray-900 dark:text-gray-100">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.book.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg border border-gray-200 dark:border-surface-700
                        flex items-center justify-center hover:bg-gray-100 dark:hover:bg-surface-800 transition-colors"
                    >
                      <HiPlus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Subtotal + Remove */}
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {formatPrice(item.book.price * item.quantity)}
                    </span>
                    <button onClick={() => removeItem(item.book.id)}
                      className="p-2 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30
                        hover:text-red-600 transition-all">
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Items ({items.reduce((s, i) => s + i.quantity, 0)})
                </span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{formatPrice(getTotalPrice())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Shipping</span>
                <span className="font-medium text-emerald-600">Free</span>
              </div>
              <hr className="border-gray-200 dark:border-surface-700" />
              <div className="flex justify-between">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">Total</span>
                <span className="text-lg font-bold text-gradient">{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn-primary w-full py-3.5 text-center block">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
