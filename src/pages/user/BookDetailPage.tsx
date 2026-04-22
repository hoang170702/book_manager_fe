import { useParams, Link } from 'react-router-dom';
import { HiOutlineStar, HiOutlineShoppingCart, HiOutlineArrowLeft } from 'react-icons/hi';
import { useBook, useBooks } from '../../hooks/useBooks';
import { useCartStore } from '../../store/cartStore';
import BookCard from '../../components/BookCard';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import toast from 'react-hot-toast';

export default function BookDetailPage() {
  const { id } = useParams();
  const addItem = useCartStore(s => s.addItem);

  const { data: book, isLoading, isError } = useBook(Number(id));
  const { data: allBooks = [] } = useBooks();

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSkeleton count={1} />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Book Not Found</h1>
        <Link to="/books" className="btn-primary">Back to Books</Link>
      </div>
    );
  }

  const related = allBooks
    .filter(b => b.id !== book.id && b.categories.some(c => book.categories.some(bc => bc.id === c.id)))
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(book);
    toast.success(`"${book.title}" added to cart!`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <Link to="/books" className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400
        hover:text-primary-600 dark:hover:text-primary-400 mb-6 transition-colors">
        <HiOutlineArrowLeft className="w-4 h-4" /> Back to Books
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="relative">
          <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-gray-300/30 dark:shadow-surface-950/50">
            <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex flex-wrap gap-2 mb-4">
            {book.categories.map(cat => (
              <span key={cat.id} className="px-3 py-1 text-xs font-semibold rounded-full
                bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400">
                {cat.name}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">
            {book.title}
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
            by <span className="font-medium text-gray-700 dark:text-gray-300">{book.author.name}</span>
          </p>

          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <HiOutlineStar key={star}
                  className={`w-5 h-5 ${star <= Math.round(book.rating)
                    ? 'text-accent-500 fill-accent-500'
                    : 'text-gray-300 dark:text-gray-600'}`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{book.rating}</span>
            <span className="text-sm text-gray-400">• {book.year}</span>
          </div>

          <div className="mb-6">
            <span className="text-4xl font-black text-gradient">{formatPrice(book.price)}</span>
          </div>

          <p className={`text-sm font-medium mb-6
            ${book.stock > 10 ? 'text-emerald-600' : book.stock > 0 ? 'text-amber-600' : 'text-red-600'}`}>
            {book.stock > 10 ? `✓ In Stock (${book.stock} available)` :
              book.stock > 0 ? `⚠ Only ${book.stock} left` : '✗ Out of Stock'}
          </p>

          <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8">{book.description}</p>

          <button
            onClick={handleAddToCart}
            disabled={book.stock === 0}
            className="btn-primary py-4 text-lg w-full md:w-auto"
          >
            <HiOutlineShoppingCart className="w-6 h-6 mr-2" />
            Add to Cart
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Related Books</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map(b => <BookCard key={b.id} book={b} />)}
          </div>
        </section>
      )}
    </div>
  );
}
