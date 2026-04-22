import { Link } from 'react-router-dom';
import { HiOutlineArrowRight, HiOutlineStar } from 'react-icons/hi';
import BookCard from '../../components/BookCard';
import { mockBooks, mockCategories } from '../../data/mockData';

export default function HomePage() {
  const featured = mockBooks.slice(0, 4);
  const bestsellers = [...mockBooks].sort((a, b) => b.rating - a.rating).slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* HERO */}
      <section className="gradient-hero text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold
              bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              ✨ Over 10,000+ books available
            </span>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Discover Your Next
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300">
                Favorite Book
              </span>
            </h1>
            <p className="text-lg text-purple-200 mb-8 max-w-lg">
              Explore our curated collection of books from bestselling authors worldwide.
              From fiction to science, find your perfect read.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/books" className="btn-primary px-8 py-3.5 text-base">
                Browse Books <HiOutlineArrowRight className="w-5 h-5 ml-2" />
              </Link>
              <Link to="/books" className="inline-flex items-center px-8 py-3.5 rounded-xl font-semibold
                border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300">
                Explore Categories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Browse by Category</h2>
          <p className="text-gray-500 dark:text-gray-400">Find books in your favorite genres</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {mockCategories.map((cat, idx) => {
            const colors = [
              'from-indigo-500 to-purple-600', 'from-pink-500 to-rose-600',
              'from-emerald-500 to-teal-600', 'from-amber-500 to-orange-600',
              'from-blue-500 to-cyan-600', 'from-violet-500 to-fuchsia-600',
              'from-lime-500 to-green-600', 'from-red-500 to-pink-600',
            ];
            return (
              <Link
                key={cat.id}
                to={`/books?category=${cat.id}`}
                className="group relative overflow-hidden rounded-2xl p-6 text-white
                  bg-gradient-to-br transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                style={{
                  backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${colors[idx % colors.length]} opacity-90`} />
                <div className="relative z-10">
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-sm text-white/70 mt-1">
                    {mockBooks.filter(b => b.categories.some(c => c.id === cat.id)).length} books
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-gray-50 dark:bg-surface-900/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Featured Books</h2>
              <p className="text-gray-500 dark:text-gray-400">Handpicked for you</p>
            </div>
            <Link to="/books" className="btn-secondary text-sm">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featured.map(book => <BookCard key={book.id} book={book} />)}
          </div>
        </div>
      </section>

      {/* BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              <HiOutlineStar className="w-8 h-8 inline text-accent-500 mr-2" />
              Bestsellers
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Top rated books by our readers</p>
          </div>
          <Link to="/books" className="btn-secondary text-sm">View All</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {bestsellers.map(book => <BookCard key={book.id} book={book} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="gradient-primary py-16">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Reading?</h2>
          <p className="text-lg text-purple-200 mb-8">
            Join thousands of book lovers and discover your next great read today.
          </p>
          <Link to="/books" className="inline-flex items-center px-8 py-4 rounded-xl font-bold text-primary-600
            bg-white hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02] shadow-xl">
            Get Started <HiOutlineArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}
