import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

export default function TimeTable() {
  const [periods, setPeriods] = useState([
    {
      id: 1,
      name: "Period 1",
      startTime: "08:00 AM",
      endTime: "08:30 AM",
      capacity: 30,
    },
    {
      id: 2,
      name: "Period 2",
      startTime: "08:30 AM",
      endTime: "09:00 AM",
      capacity: 30,
    },
    {
      id: 3,
      name: "Period 3",
      startTime: "09:00 AM",
      endTime: "09:30 AM",
      capacity: 30,
    },
    {
      id: 4,
      name: "Break",
      startTime: "09:30 AM",
      endTime: "10:30 AM",
      capacity: 30,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    startTime: "",
    endTime: "",
    capacity: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleSubmit = () => {
    if (
      !formData.name ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.capacity
    ) {
      return;
    }

    if (editingId) {
      setPeriods((prev) =>
        prev.map((period) =>
          period.id === editingId
            ? { ...period, ...formData }
            : period
        )
      );

      setEditingId(null);
    } else {
      setPeriods((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...formData,
        },
      ]);
    }

    setFormData({
      name: "",
      startTime: "",
      endTime: "",
      capacity: "",
    });
  };

  const handleEdit = (period) => {
    setEditingId(period.id);

    setFormData({
      name: period.name,
      startTime: period.startTime,
      endTime: period.endTime,
      capacity: period.capacity,
    });
  };

  const handleDelete = (id) => {
    setPeriods((prev) =>
      prev.filter((period) => period.id !== id)
    );
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-semibold text-gray-900">
          Timetable Management
        </h1>

        <div className="border-b mt-4 mb-10" />

        {/* Create Periods */}

        <h2 className="text-2xl font-medium mb-6">
          Create Periods
        </h2>

        <div className="grid grid-cols-4 gap-6">
          <div>
            <label className="block text-lg mb-2">
              Period Name
            </label>

            <input
              type="text"
              placeholder="e.g. Period 1"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-4"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">
              Start Time
            </label>

            <input
              type="time"
              value={formData.startTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  startTime: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-4"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">
              End Time
            </label>

            <input
              type="time"
              value={formData.endTime}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  endTime: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-4"
            />
          </div>

          <div>
            <label className="block text-lg mb-2">
              Capacity
            </label>

            <input
              type="number"
              placeholder="e.g. 30"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: e.target.value,
                })
              }
              className="w-full border rounded-lg px-4 py-4"
            />
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={handleSubmit}
            className="bg-[#000359] text-white px-12 py-3 rounded-lg font-medium hover:opacity-90"
          >
            {editingId
              ? "Update Period"
              : "Add Period"}
          </button>
        </div>

        {/* Existing Periods */}

        <h2 className="text-2xl font-medium mt-12 mb-6">
          Existing Periods
        </h2>

        <div className="overflow-hidden rounded-xl border">
          <table className="w-full">
            <thead>
              <tr className="bg-[#000359] text-white">
                <th className="px-6 py-4 text-left">
                  Period Name
                </th>
                <th className="px-6 py-4 text-left">
                  Start Time
                </th>
                <th className="px-6 py-4 text-left">
                  End Time
                </th>
                <th className="px-6 py-4 text-center">
                  Capacity
                </th>
                <th className="px-6 py-4 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {periods.map((period) => (
                <tr
                  key={period.id}
                  className="border-b"
                >
                  <td className="px-6 py-5">
                    {period.name}
                  </td>

                  <td className="px-6 py-5">
                    {period.startTime}
                  </td>

                  <td className="px-6 py-5">
                    {period.endTime}
                  </td>

                  <td className="px-6 py-5 text-center">
                    {period.capacity}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() =>
                          handleEdit(period)
                        }
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(period.id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {periods.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No periods found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}