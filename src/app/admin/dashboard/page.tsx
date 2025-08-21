import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../app/api/auth/[...nextauth]/route";
import Link from "next/link";
import { LogOut, Box, Plus, Edit, Trash } from "lucide-react";

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 flex flex-col items-center border-b border-gray-200">
          <h1 className="text-2xl font-bold text-[#B39452] mb-1">Luxeloom Admin</h1>
          <p className="text-gray-500 text-sm text-center">Welcome, {session.user?.email}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-4 text-gray-800">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#B39452]/10 transition font-medium">
            <Box size={20} /> Dashboard
          </Link>
          <Link href="/admin/add-product" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#B39452]/10 transition font-medium">
            <Plus size={20} /> Add Product
          </Link>
          <Link href="/admin/manage-products" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#B39452]/10 transition font-medium">
            <Edit size={20} /> Manage Products
          </Link>
          <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#B39452]/10 transition font-medium">
            <Edit size={20} /> Manage Orders
          </Link>
        </nav>

        <div className="px-4 py-6 border-t border-gray-200">
          <Link href="/admin/logout" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-100 transition text-red-600 font-medium">
            <LogOut size={20} /> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Admin Dashboard</h2>
        <p className="text-gray-600 mb-6">
          This is your protected admin panel. Only authorized users can access this area.
        </p>

        {/* Example Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Products</h3>
            <p className="text-2xl font-bold text-[#B39452]">124</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Orders Today</h3>
            <p className="text-2xl font-bold text-[#B39452]">18</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Pending Reviews</h3>
            <p className="text-2xl font-bold text-[#B39452]">5</p>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="mt-10">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 ">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-800">
            <Link href="/admin/products" className="bg-[#B39452]/10 p-6 rounded-xl flex items-center justify-center font-semibold hover:bg-[#B39452]/20 transition">
              Add New Product
            </Link>
            <Link href="/admin/manage-products" className="bg-[#B39452]/10 p-6 rounded-xl flex items-center justify-center font-semibold hover:bg-[#B39452]/20 transition">
              Edit Products
            </Link>
            <Link href="/admin/delete-products" className="bg-red-100 p-6 rounded-xl flex items-center justify-center font-semibold hover:bg-red-200 transition text-red-600">
              Delete Products
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
