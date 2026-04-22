import { HiOutlineBookOpen } from 'react-icons/hi';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-surface-900 border-t border-gray-200 dark:border-surface-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center">
                <HiOutlineBookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">BookHaven</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
              Your premium online bookstore. Discover thousands of titles from bestselling authors around the world.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><a href="/" className="hover:text-primary-600 transition-colors">Home</a></li>
              <li><a href="/books" className="hover:text-primary-600 transition-colors">Browse Books</a></li>
              <li><a href="/cart" className="hover:text-primary-600 transition-colors">Shopping Cart</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><span className="hover:text-primary-600 transition-colors cursor-pointer">Contact Us</span></li>
              <li><span className="hover:text-primary-600 transition-colors cursor-pointer">FAQ</span></li>
              <li><span className="hover:text-primary-600 transition-colors cursor-pointer">Shipping Info</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-surface-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-400 dark:text-gray-500">
            © {new Date().getFullYear()} BookHaven. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
