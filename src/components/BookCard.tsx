import { Link } from 'react-router-dom';
import { HiOutlineStar, HiOutlineShoppingCart } from 'react-icons/hi';
import type { Book } from '../types';
import { useCartStore } from '../store/cartStore';
import toast from 'react-hot-toast';

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const addItem = useCartStore(s => s.addItem);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(book);
    toast.success(`"${book.title}" added to cart!`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  return (
    <Link to={`/books/${book.id}`} className="group block">
      <div className="glass-card card-hover overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src={book.image}
            alt={book.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
            opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Quick add to cart */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 p-2.5 bg-white/90 dark:bg-surface-800/90
              rounded-xl shadow-lg opacity-0 group-hover:opacity-100
              transition-all duration-300 transform translate-y-2 group-hover:translate-y-0
              hover:bg-primary-500 hover:text-white text-gray-700 dark:text-gray-200"
            title="Add to cart"
          >
            <HiOutlineShoppingCart className="w-5 h-5" />
          </button>

          {/* Category badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {book.categories.slice(0, 2).map(cat => (
              <span key={cat.id} className="px-2 py-0.5 text-xs font-medium bg-white/90 dark:bg-surface-800/90
                text-primary-600 dark:text-primary-400 rounded-full backdrop-blur-sm">
                {cat.name}
              </span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm line-clamp-2 mb-1
            group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{book.author.name}</p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            <HiOutlineStar className="w-4 h-4 text-accent-500 fill-accent-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{book.rating}</span>
          </div>

          {/* Price */}
          <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
            {formatPrice(book.price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
