import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-6 py-3">
      <div className="text-xl font-bold text-white">📚 made by zayd</div>
      <div className="flex items-center gap-4">
        {user?.name && (
          <span className="text-gray-300 text-sm hidden sm:inline">
            Hi, <span className="font-semibold text-white">{user.name}</span>
          </span>
        )}
        <button
          onClick={logout}
          className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
