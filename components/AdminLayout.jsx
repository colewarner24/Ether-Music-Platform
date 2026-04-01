import Link from 'next/link';
import { useRouter } from 'next/router';

export default function AdminLayout({ children }) {
  const router = useRouter();

  const isActive = (path) => router.pathname === path;

  return (
    <div className="flex h-screen bg-gray-100">
      <nav className="w-64 bg-gray-900 text-white p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <ul className="space-y-4">
          <li>
            <Link href="/admin/dashboard" className={`block px-4 py-2 rounded ${isActive('/admin/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>
              Overview
            </Link>
          </li>
          <li>
            <Link href="/admin/users" className={`block px-4 py-2 rounded ${isActive('/admin/users') ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>
              Users
            </Link>
          </li>
          <li>
            <Link href="/admin/tracks" className={`block px-4 py-2 rounded ${isActive('/admin/tracks') ? 'bg-gray-700' : 'hover:bg-gray-800'}`}>
              Tracks
            </Link>
          </li>
        </ul>
      </nav>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
