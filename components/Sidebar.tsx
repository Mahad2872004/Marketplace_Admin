import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiHome, FiUsers, FiBriefcase, FiCalendar, FiDollarSign, FiSettings, FiLogOut } from 'react-icons/fi';

export default function Sidebar() {
  const router = useRouter();

  const menuItems = [
    { href: '/', label: 'Dashboard', icon: FiHome },
    { href: '/workers', label: 'Workers', icon: FiBriefcase },
    { href: '/users', label: 'Users', icon: FiUsers },
    { href: '/bookings', label: 'Bookings', icon: FiCalendar },
    { href: '/payments', label: 'Payments', icon: FiDollarSign },
    { href: '/settings', label: 'Settings', icon: FiSettings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen">
      <div className="p-6">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = router.pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 ${
                isActive ? 'bg-gray-700 border-l-4 border-primary-500' : 'hover:bg-gray-700'
              }`}
            >
              <Icon className="mr-3" size={20} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-6 py-3 hover:bg-gray-700 text-left"
        >
          <FiLogOut className="mr-3" size={20} />
          Logout
        </button>
      </nav>
    </div>
  );
}

