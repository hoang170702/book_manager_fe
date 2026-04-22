import { useState, useEffect } from 'react';
import { HiOutlineBookOpen, HiOutlineUserGroup, HiOutlineTag, HiOutlineTrendingUp } from 'react-icons/hi';
import { useBooks } from '../../hooks/useBooks';
import { useAuthors } from '../../hooks/useAuthors';
import { useCategories } from '../../hooks/useCategories';
import { useHealth } from '../../hooks/useHealth';

export default function DashboardPage() {
  const { data: books = [] } = useBooks();
  const { data: authors = [] } = useAuthors();
  const { data: categories = [] } = useCategories();
  const { data: health } = useHealth();
  const [animatedValues, setAnimatedValues] = useState({ books: 0, authors: 0, categories: 0 });

  useEffect(() => {
    const targets = { books: books.length, authors: authors.length, categories: categories.length };
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      setAnimatedValues({
        books: Math.round(targets.books * progress),
        authors: Math.round(targets.authors * progress),
        categories: Math.round(targets.categories * progress),
      });
      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, [books.length, authors.length, categories.length]);

  const recentBooks = books.slice(0, 5);
  const stats = [
    { label: 'Total Books', value: animatedValues.books, icon: HiOutlineBookOpen, color: 'from-indigo-500 to-purple-600', bg: 'bg-indigo-50 dark:bg-indigo-950/30' },
    { label: 'Total Authors', value: animatedValues.authors, icon: HiOutlineUserGroup, color: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
    { label: 'Total Categories', value: animatedValues.categories, icon: HiOutlineTag, color: 'from-amber-500 to-orange-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
    { label: 'Total Revenue', value: '₫45.2M', icon: HiOutlineTrendingUp, color: 'from-pink-500 to-rose-600', bg: 'bg-pink-50 dark:bg-pink-950/30' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
        <div className="flex items-center gap-3 mt-1">
          <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back! Here's your store overview.</p>
          {health && (
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium
              ${health.status === 'healthy'
                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                : 'bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${health.status === 'healthy' ? 'bg-emerald-500' : 'bg-red-500'}`} />
              Server {health.status} · DB {health.database}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(stat => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card p-5 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {typeof stat.value === 'number' ? stat.value : stat.value}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Books */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Books</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Book</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Author</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-gray-400">Rating</th>
              </tr>
            </thead>
            <tbody>
              {recentBooks.map(book => (
                <tr key={book.id} className="border-b border-gray-100 dark:border-surface-800 hover:bg-gray-50 dark:hover:bg-surface-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={book.image} alt={book.title} className="w-10 h-14 object-cover rounded-lg" />
                      <span className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{book.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{book.author.name}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900 dark:text-gray-100">
                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(book.price)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${book.stock > 20 ? 'bg-emerald-100 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' :
                        book.stock > 0 ? 'bg-amber-100 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' :
                        'bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-400'}`}>
                      {book.stock}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">⭐ {book.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
