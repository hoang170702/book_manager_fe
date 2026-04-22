import { useState, useMemo } from 'react';
import { HiOutlineSearch, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi';
import Pagination from './Pagination';

interface Column<T> {
  key: string;
  label: string;
  render?: (item: T) => React.ReactNode;
}

interface AdminTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchField?: keyof T | string;
  pageSize?: number;
}

export default function AdminTable<T extends { id: number }>({
  data, columns, onEdit, onDelete, searchField, pageSize = 10,
}: AdminTableProps<T>) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    if (!search || !searchField) return data;
    return data.filter(item => {
      const val = (item as Record<string, unknown>)[searchField as string];
      return String(val ?? '').toLowerCase().includes(search.toLowerCase());
    });
  }, [data, search, searchField]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div>
      {/* Search */}
      {searchField && (
        <div className="relative mb-4 max-w-sm">
          <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search..."
            className="w-full px-4 py-2.5 pl-10 text-sm rounded-xl border-2 border-gray-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-gray-900 dark:text-gray-100 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-surface-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-surface-800 border-b border-gray-200 dark:border-surface-700">
              {columns.map(col => (
                <th key={col.key} className="text-left px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                  {col.label}
                </th>
              ))}
              {(onEdit || onDelete) && (
                <th className="text-right px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 w-28">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)}
                  className="text-center py-8 text-gray-400 dark:text-gray-500">
                  No data found
                </td>
              </tr>
            ) : (
              paged.map((item, idx) => (
                <tr key={item.id}
                  className={`border-b border-gray-100 dark:border-surface-800 transition-colors
                    hover:bg-gray-50 dark:hover:bg-surface-800/50
                    ${idx % 2 === 0 ? 'bg-white dark:bg-surface-900' : 'bg-gray-50/50 dark:bg-surface-900/50'}`}>
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')}
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onEdit && (
                          <button onClick={() => onEdit(item)}
                            className="p-2 rounded-lg text-primary-600 dark:text-primary-400
                              hover:bg-primary-50 dark:hover:bg-primary-950/30 transition-all"
                            title="Edit">
                            <HiOutlinePencil className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button onClick={() => onDelete(item)}
                            className="p-2 rounded-lg text-red-500
                              hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                            title="Delete">
                            <HiOutlineTrash className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
