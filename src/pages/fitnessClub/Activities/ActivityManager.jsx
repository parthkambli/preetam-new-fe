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
  <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-200">
    
    <table className="w-full text-sm">
      
      {/* HEADER */}
      <thead>
        <tr className="bg-[#000359] text-white">
          <th className="px-6 py-3 text-left font-medium">Activity</th>
          <th className="px-6 py-3 text-left font-medium">Slots</th>
          <th className="px-6 py-3 text-left font-medium">Capacity</th>
          <th className="px-6 py-3 text-left font-medium">Action</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody className="divide-y">
        {loading ? (
          <tr>
            <td colSpan={4} className="text-center py-10 text-gray-400">
              Loading...
            </td>
          </tr>
        ) : activities.length === 0 ? (
          <tr>
            <td colSpan={4} className="text-center py-10 text-gray-400">
              No activities found
            </td>
          </tr>
        ) : (
          activities.map((a) => (
            <tr
              key={a._id}
              className="hover:bg-gray-50 transition"
            >
              {/* Activity */}
              <td className="px-6 py-4 font-medium text-gray-800">
                {a.name}
              </td>

              {/* Slots */}
              <td className="px-6 py-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                  {a.slots?.length || 0}
                </span>
              </td>

              {/* Capacity */}
              <td className="px-6 py-4">
                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs">
                  {a.capacity || 0}
                </span>
              </td>

              {/* Actions */}
              <td className="px-6 py-4">
                <div className="flex gap-2">
                  
                  <button
                    onClick={() => onEdit(a)}
                    className="px-3 py-1.5 text-xs rounded-md bg-[#000359] text-white hover:opacity-90"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(a._id)}
                    className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-600 hover:bg-red-200"
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