import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

export default function AdminDashboard() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTracks: 0,
    totalStorage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          const user = data.user || data;
          if (user.isAdmin) {
            setAuthenticated(true);
          } else {
            router.push('/');
          }
        } else {
          router.push('/login');
        }
      } catch (err) {
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authenticated) return;

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const usersRes = await fetch('/api/admin/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tracksRes = await fetch('/api/admin/tracks', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!usersRes.ok || !tracksRes.ok) {
          throw new Error('Failed to fetch stats');
        }

        const users = await usersRes.json();
        const tracks = await tracksRes.json();

        const totalStorage = tracks.reduce((sum, track) => sum + (track.size || 0), 0);

        setStats({
          totalUsers: users.length,
          totalTracks: tracks.length,
          totalStorage: totalStorage,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-full">
          <p className="text-xl text-gray-600">Loading...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </AdminLayout>
    );
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Users</h3>
            <p className="text-4xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Tracks</h3>
            <p className="text-4xl font-bold text-green-600">{stats.totalTracks}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Storage Used</h3>
            <p className="text-4xl font-bold text-purple-600">{formatBytes(stats.totalStorage)}</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
