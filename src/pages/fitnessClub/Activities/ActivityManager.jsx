import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../../services/apiClient';

export default function ActivityManager({ onEdit }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    try {
      const res = await api.fitnessActivities.getAll();
      setActivities(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Delete this activity? This will remove all slots.'
    );

    if (!confirmDelete) return;

    try {
      await api.fitnessActivities.delete(id);
      toast.success('Activity deleted');
      fetchActivities();
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Delete failed'
      );
    }
  };

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#000359] text-white text-left">
            <th className="px-5 py-3">Activity</th>
            <th className="px-5 py-3">Slots</th>
            <th className="px-5 py-3">Capacity</th>
            <th className="px-5 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-400">
                Loading...
              </td>
            </tr>
          ) : activities.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-8 text-gray-400">
                No activities found
              </td>
            </tr>
          ) : (
            activities.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="px-5 py-3">{a.name}</td>

                <td className="px-5 py-3">
                  {a.slots?.length || 0}
                </td>

                <td className="px-5 py-3">
                  {a.capacity || 0}
                </td>

                <td className="px-5 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(a)}
                      className="bg-[#000359] text-white px-3 py-1 rounded text-xs"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(a._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-xs"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}