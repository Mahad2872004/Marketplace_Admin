import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX } from 'react-icons/fi';

interface Worker {
  _id: string;
  userId: {
    name: string;
    email: string;
    phone: string;
  };
  category: {
    name: string;
  };
  verificationStatus: string;
  isApproved: boolean;
  createdAt: string;
}

export default function Workers() {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchWorkers();
  }, [filter]);

  const fetchWorkers = async () => {
    try {
      const status = filter === 'all' ? '' : filter;
      const response = await api.get(`/admin/workers${status ? `?status=${status}` : ''}`);
      setWorkers(response.data.workers || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (workerId: string) => {
    try {
      await api.put(`/admin/workers/${workerId}/approve`);
      toast.success('Worker approved successfully');
      fetchWorkers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve worker');
    }
  };

  const handleReject = async (workerId: string) => {
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    try {
      await api.put(`/admin/workers/${workerId}/reject`, { reason });
      toast.success('Worker rejected');
      fetchWorkers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject worker');
    }
  };

  return (
    <Layout>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Workers</h1>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Phone
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workers.map((worker) => (
                  <tr key={worker._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {worker.userId.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.userId.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.userId.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {worker.category?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          worker.verificationStatus === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : worker.verificationStatus === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {worker.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {worker.verificationStatus === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleApprove(worker._id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            <FiCheck size={20} />
                          </button>
                          <button
                            onClick={() => handleReject(worker._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <FiX size={20} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

