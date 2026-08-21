import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Users, Package, Palette, Shield, Search, Trash2, ChevronDown, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import type { ApiResponse } from '../types';

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'artisan' | 'admin';
  avatar: string;
  isEmailVerified: boolean;
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalCustomers: number;
  totalArtisanUsers: number;
  totalAdmins: number;
  totalArtisans: number;
  totalProducts: number;
  verifiedUsers: number;
  categories: string[];
}

const ROLES = ['customer', 'artisan', 'admin'] as const;

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'overview'>('overview');

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get<ApiResponse<Stats>>('/admin/stats');
      setStats(res.data.data);
    } catch {
      toast.error('Failed to load stats');
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ page: String(page), limit: '15' });
      if (search) params.set('search', search);
      if (roleFilter) params.set('role', roleFilter);
      const res = await api.get<ApiResponse<{ users: AdminUser[]; pagination: { pages: number } }>>(`/admin/users?${params}`);
      setUsers(res.data.data.users);
      setTotalPages(res.data.data.pagination.pages);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.patch(`/admin/users/${userId}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete "${userName}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted');
      fetchUsers();
      fetchStats();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-700' },
    { label: 'Customers', value: stats.totalCustomers, icon: Users, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Artisan Users', value: stats.totalArtisanUsers, icon: Palette, color: 'from-amber-500 to-amber-700' },
    { label: 'Admins', value: stats.totalAdmins, icon: Shield, color: 'from-purple-500 to-purple-700' },
    { label: 'Products', value: stats.totalProducts, icon: Package, color: 'from-rose-500 to-rose-700' },
    { label: 'Verified', value: stats.verifiedUsers, icon: CheckCircle, color: 'from-teal-500 to-teal-700' },
  ] : [];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-earth-900 mb-2">Admin Dashboard</h1>
          <p className="text-earth-600">Manage users, monitor platform activity, and configure settings.</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['overview', 'users'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all capitalize ${
                activeTab === tab
                  ? 'bg-earth-900 text-white shadow-lg'
                  : 'bg-white text-earth-600 hover:bg-earth-100 border border-earth-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((card, i) => (
                <motion.div
                  key={card.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-earth-100 hover:shadow-md transition-shadow"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-bold text-earth-900">{card.value}</p>
                  <p className="text-xs text-earth-500 mt-1">{card.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Categories */}
            {stats?.categories && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-earth-100">
                <h3 className="text-lg font-semibold text-earth-900 mb-4">Active Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {stats.categories.map((cat) => (
                    <span key={cat} className="px-4 py-2 bg-earth-50 text-earth-700 rounded-full text-sm font-medium border border-earth-200">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-earth-200 bg-white text-earth-900 placeholder:text-earth-400 focus:outline-none focus:ring-2 focus:ring-gold-300 text-sm"
                />
              </div>
              <div className="relative">
                <select
                  value={roleFilter}
                  onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
                  className="appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-earth-200 bg-white text-earth-900 focus:outline-none focus:ring-2 focus:ring-gold-300 text-sm min-w-[140px]"
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="artisan">Artisan</option>
                  <option value="admin">Admin</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-earth-400 pointer-events-none" />
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-earth-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-earth-50 border-b border-earth-100">
                      <th className="text-left px-5 py-3 font-semibold text-earth-600">User</th>
                      <th className="text-left px-5 py-3 font-semibold text-earth-600">Email</th>
                      <th className="text-left px-5 py-3 font-semibold text-earth-600">Verified</th>
                      <th className="text-left px-5 py-3 font-semibold text-earth-600">Role</th>
                      <th className="text-left px-5 py-3 font-semibold text-earth-600">Joined</th>
                      <th className="text-right px-5 py-3 font-semibold text-earth-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="px-5 py-12 text-center text-earth-400">Loading...</td></tr>
                    ) : users.length === 0 ? (
                      <tr><td colSpan={6} className="px-5 py-12 text-center text-earth-400">No users found</td></tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id} className="border-b border-earth-50 hover:bg-earth-50/50 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-bold text-xs">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-earth-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-earth-600">{user.email}</td>
                          <td className="px-5 py-3">
                            {user.isEmailVerified ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-500" />
                            )}
                          </td>
                          <td className="px-5 py-3">
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold-300 ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                                user.role === 'artisan' ? 'bg-amber-100 text-amber-700' :
                                'bg-blue-100 text-blue-700'
                              }`}
                            >
                              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                            </select>
                          </td>
                          <td className="px-5 py-3 text-earth-500 text-xs">
                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-3 text-right">
                            <button
                              onClick={() => handleDeleteUser(user.id, user.name)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 px-5 py-4 border-t border-earth-100">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === p ? 'bg-earth-900 text-white' : 'text-earth-600 hover:bg-earth-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
