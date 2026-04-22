import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../../components/BookCard';
import SearchBar from '../../components/SearchBar';
import FilterSidebar from '../../components/FilterSidebar';
import LoadingSkeleton from '../../components/LoadingSkeleton';
import Pagination from '../../components/Pagination';
import { useBooks } from '../../hooks/useBooks';
import { useCategories } from '../../hooks/useCategories';

const PAGE_SIZE = 8;

export default function BookListPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [page, setPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const { data: books = [], isLoading } = useBooks();
  const { data: categories = [] } = useCategories();

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(Number(cat));
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = [...books];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.name.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(b =>
        b.categories.some(c => c.id === selectedCategory)
      );
    }

    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'rating-desc': result.sort((a, b) => b.rating - a.rating); break;
      case 'name-asc': result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }

    return result;
  }, [books, search, selectedCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Browse Books</h1>
        <p className="text-gray-500 dark:text-gray-400">
          {filtered.length} {filtered.length === 1 ? 'book' : 'books'} found
        </p>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} />
        </div>
        <button
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="lg:hidden btn-secondary py-3 px-4"
        >
          Filters
        </button>
      </div>

      <div className="flex gap-8">
        <div className="hidden lg:block w-64 shrink-0">
          <FilterSidebar
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={(id) => { setSelectedCategory(id); setPage(1); }}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        {mobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileFilterOpen(false)}>
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute right-0 top-0 bottom-0 w-80 bg-white dark:bg-surface-900 p-6 overflow-y-auto"
              onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Filters</h3>
              <FilterSidebar
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={(id) => { setSelectedCategory(id); setPage(1); setMobileFilterOpen(false); }}
                sortBy={sortBy}
                onSortChange={(s) => { setSortBy(s); setMobileFilterOpen(false); }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <LoadingSkeleton count={8} />
          ) : paged.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-400 dark:text-gray-500">No books found</p>
              <p className="text-sm text-gray-400 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {paged.map(book => <BookCard key={book.id} book={book} />)}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
