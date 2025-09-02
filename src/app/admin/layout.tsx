import Link from "next/link";
import { LogOut, Box, Plus, Edit } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 fixed h-full bg-white shadow-lg flex flex-col">
        <div className="p-6 flex flex-col items-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#B39452] mb-1">Luxeloom Admin</h1>
          <p className="text-gray-600 text-sm text-center">Welcome, Admin</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-3 text-gray-800 overflow-y-auto">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#B39452]/10 transition font-medium"
          >
            <Box size={20} /> Dashboard
          </Link>
          <Link
            href="/admin/add-product"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#B39452]/10 transition font-medium"
          >
            <Plus size={20} /> Add Product
          </Link>
          <Link
            href="/admin/manage-product"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#B39452]/10 transition font-medium"
          >
            <Edit size={20} /> Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-[#B39452]/10 transition font-medium"
          >
            <Edit size={20} /> Orders
          </Link>
        </nav>

        <div className="px-4 py-6 border-t border-gray-200">
          <Link
            href="/admin/logout"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-100 transition text-red-600 font-medium"
          >
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 ml-72">{children}</main>
    </div>
  );
}
