import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { FiUsers, FiBriefcase, FiCalendar, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';

interface DashboardStats {
  totalUsers: number;
  totalWorkers: number;
  totalBookings: number;
  totalRevenue: number;
  pendingWorkers: number;
  activeBookings: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/admin/dashboard');
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <p>Loading...</p>
      </Layout>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Workers',
      value: stats?.totalWorkers || 0,
      icon: FiBriefcase,
      color: 'bg-green-500',
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      icon: FiCalendar,
      color: 'bg-purple-500',
    },
    {
      title: 'Total Revenue',
      value: `Rs. ${stats?.totalRevenue?.toLocaleString() || 0}`,
      icon: FiDollarSign,
      color: 'bg-yellow-500',
    },
    {
      title: 'Pending Workers',
      value: stats?.pendingWorkers || 0,
      icon: FiClock,
      color: 'bg-orange-500',
    },
    {
      title: 'Active Bookings',
      value: stats?.activeBookings || 0,
      icon: FiCheckCircle,
      color: 'bg-indigo-500',
    },
  ];

  return (
    <Layout>
      <div>
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`${card.color} p-4 rounded-full`}>
                    <Icon size={24} className="text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
}

