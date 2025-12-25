import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminLogin() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  // Check backend connection on mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await api.get('/health');
        if (response.data && response.data.status === 'OK') {
          setBackendStatus('online');
        } else {
          setBackendStatus('offline');
        }
      } catch (error: any) {
        console.error('Backend health check failed:', error);
        setBackendStatus('offline');
        if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
          toast.error('Cannot connect to backend server. Is it running?', { duration: 5000 });
        }
      }
    };
    checkBackend();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate form
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting login with:', { email: formData.email });
      const response = await api.post('/auth/login', formData);
      console.log('Login response:', response.data);

      const { token, user } = response.data;

      if (!user) {
        setError('Invalid response from server');
        toast.error('Invalid response from server');
        setLoading(false);
        return;
      }

      if (user.role !== 'admin') {
        setError('Access denied. Admin only.');
        toast.error('Access denied. Admin only.');
        setLoading(false);
        // Don't clear form on role error
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful!');
      router.push('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        // Server responded with error
        errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
        console.error('Server error:', error.response.data);
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Cannot connect to server. Please check if backend is running on http://localhost:5000';
        console.error('No response from server:', error.request);
      } else {
        // Something else happened
        errorMessage = error.message || 'An unexpected error occurred';
        console.error('Error:', error.message);
      }

      setError(errorMessage);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-bold text-center mb-8">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              autoComplete="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500"
              placeholder="mahadmateenbutt@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-primary-500"
              placeholder="Password"
            />
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <div className="mt-4 text-sm text-center">
          <div className="mb-2">
            <span className="font-semibold">Backend Status: </span>
            <span
              className={`font-semibold ${
                backendStatus === 'online'
                  ? 'text-green-600'
                  : backendStatus === 'offline'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            >
              {backendStatus === 'online'
                ? '✓ Online'
                : backendStatus === 'offline'
                ? '✗ Offline'
                : 'Checking...'}
            </span>
          </div>
          <p className="text-gray-600 text-xs">
            API URL: {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
          </p>
          {backendStatus === 'offline' && (
            <p className="text-red-600 text-xs mt-2">
              ⚠️ Backend server is not reachable. Please start the backend server.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

