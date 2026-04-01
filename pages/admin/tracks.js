import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';

export default function AdminTracks() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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
    fetchTracks();
  }, [authenticated]);

  const fetchTracks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/tracks', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch tracks');
      const data = await res.json();
      setTracks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const startEdit = (track) => {
    setEditingId(track.id);
    setEditData({ title: track.title, private: track.private });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditData({});
  };

  const saveEdit = async (trackId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/tracks', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: trackId, data: editData }),
      });

      if (!res.ok) throw new Error('Failed to update track');
      await fetchTracks();
      setEditingId(null);
      setEditData({});
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteTrack = async (trackId) => {
    if (!confirm('Are you sure you want to delete this track?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/tracks', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: trackId }),
      });

      if (!res.ok) throw new Error('Failed to delete track');
      await fetchTracks();
    } catch (err) {
      setError(err.message);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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

  return (
    <AdminLayout>
      <div>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Tracks</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Title</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Artist</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Size</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Private</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Created</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{track.id}</td>
                  <td className="px-6 py-3 text-sm">
                    {editingId === track.id ? (
                      <input
                        type="text"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        className="border px-2 py-1 rounded w-full"
                      />
                    ) : (
                      track.title
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm">{track.user?.artistName}</td>
                  <td className="px-6 py-3 text-sm">{formatBytes(track.size)}</td>
                  <td className="px-6 py-3 text-sm">
                    {editingId === track.id ? (
                      <input
                        type="checkbox"
                        checked={editData.private}
                        onChange={(e) => setEditData({ ...editData, private: e.target.checked })}
                      />
                    ) : (
                      <span className={track.private ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>
                        {track.private ? 'Yes' : 'No'}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm">{new Date(track.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-3 text-sm">
                    {editingId === track.id ? (
                      <>
                        <button
                          onClick={() => saveEdit(track.id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(track)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteTrack(track.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
