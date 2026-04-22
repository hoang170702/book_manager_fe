import type { Category } from '../types';

interface FilterSidebarProps {
  categories: Category[];
  selectedCategory: number | null;
  onSelectCategory: (id: number | null) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export default function FilterSidebar({
  categories, selectedCategory, onSelectCategory, sortBy, onSortChange,
}: FilterSidebarProps) {
  return (
    <aside className="space-y-6">
      {/* Categories */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Categories</h3>
        <div className="space-y-1">
          <button
            onClick={() => onSelectCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
              ${selectedCategory === null
                ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-medium'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800'
              }`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200
                ${selectedCategory === cat.id
                  ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400 font-medium'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-surface-800'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Sort By</h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="input-field text-sm"
        >
          <option value="default">Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="rating-desc">Rating: High to Low</option>
          <option value="name-asc">Name: A to Z</option>
        </select>
      </div>
    </aside>
  );
}
