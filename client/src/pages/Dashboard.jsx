import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatHistory from '../components/ChatHistory';
import SubjectSelector from '../components/SubjectSelector';
import api from '../api';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState('python');
  const [title, setTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const loadSessions = async () => {
    try {
      const { data } = await api.get('/chat/sessions');
      setSessions(data);
    } catch {
      // handled by interceptor on 401
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const createSession = async () => {
    setCreating(true);
    try {
      const { data } = await api.post('/chat/session', { subject, title: title.trim() || undefined });
      navigate(`/chat/${data.sessionId}`);
    } catch {
      setCreating(false);
    }
  };

  const deleteSession = async (id) => {
    try {
      await api.delete(`/chat/session/${id}`);
      setSessions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* History panel */}
        <aside className="w-72 border-r border-gray-800 p-4 overflow-y-auto hidden md:block">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            Chat History
          </h2>
          <ChatHistory
            sessions={sessions}
            onSelect={(id) => navigate(`/chat/${id}`)}
            onDelete={deleteSession}
          />
        </aside>

        {/* Main */}
        <main className="flex-1 p-8 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {user?.name || 'Student'} 👋
          </h1>
          <p className="text-gray-400 mb-8">
            Pick a subject and start learning with your AI tutor.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg transition"
          >
            + Start New Chat
          </button>

          {/* Mobile history */}
          <div className="mt-10 md:hidden">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
              Chat History
            </h2>
            <ChatHistory
              sessions={sessions}
              onSelect={(id) => navigate(`/chat/${id}`)}
              onDelete={deleteSession}
            />
          </div>
        </main>
      </div>

      {/* New chat modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center px-4 z-50">
          <div className="w-full max-w-md bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Start a New Chat</h3>

            <label className="block text-sm text-gray-400 mb-1">Subject</label>
            <SubjectSelector value={subject} onChange={setSubject} />

            <label className="block text-sm text-gray-400 mt-4 mb-1">Title (optional)</label>
            <input
              type="text"
              placeholder="e.g. Loops and recursion"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={createSession}
                disabled={creating}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 text-white font-medium px-4 py-2 rounded-lg transition"
              >
                {creating ? 'Creating...' : 'Start Chat'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
