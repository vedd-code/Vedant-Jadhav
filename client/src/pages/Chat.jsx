import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ChatWindow from '../components/ChatWindow';
import ChatHistory from '../components/ChatHistory';
import api from '../api';
import { SUBJECT_MAP } from '../constants';

export default function Chat() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const tempId = useRef(-1);

  const currentSession = sessions.find((s) => String(s.id) === String(sessionId));

  const loadSessions = async () => {
    try {
      const { data } = await api.get('/chat/sessions');
      setSessions(data);
    } catch {
      /* ignore */
    }
  };

  const loadMessages = async () => {
    try {
      const { data } = await api.get(`/chat/session/${sessionId}/messages`);
      setMessages(data);
    } catch {
      /* ignore */
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    setMessages([]);
    loadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isThinking) return;

    // Optimistically show the user's message
    setMessages((prev) => [
      ...prev,
      { id: tempId.current--, role: 'user', content: text },
    ]);
    setInput('');
    setIsThinking(true);

    try {
      const { data } = await api.post(`/chat/session/${sessionId}/message`, {
        message: text,
        isQuizMode: quizMode,
      });
      setMessages((prev) => [
        ...prev,
        { id: tempId.current--, role: 'assistant', content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: tempId.current--,
          role: 'assistant',
          content: '⚠️ Something went wrong. Please try again.',
        },
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  const deleteSession = async (id) => {
    try {
      await api.delete(`/chat/session/${id}`);
      const remaining = sessions.filter((s) => s.id !== id);
      setSessions(remaining);
      if (String(id) === String(sessionId)) {
        navigate('/dashboard');
      }
    } catch {
      /* ignore */
    }
  };

  const subjectLabel = currentSession
    ? SUBJECT_MAP[currentSession.subject] || currentSession.subject
    : '';

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-gray-800 p-4 overflow-y-auto hidden md:block">
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full mb-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium py-2 rounded-lg transition"
          >
            + New Chat
          </button>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
            History
          </h2>
          <ChatHistory
            sessions={sessions}
            activeId={sessionId}
            onSelect={(id) => navigate(`/chat/${id}`)}
            onDelete={deleteSession}
          />
        </aside>

        {/* Main chat area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-800 px-6 py-3">
            <div>
              <h1 className="text-lg font-semibold">{subjectLabel || 'Chat'}</h1>
              {quizMode && (
                <span className="inline-block mt-1 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full">
                  ⚡ Quiz Mode Active
                </span>
              )}
            </div>
            <button
              onClick={() => setQuizMode((q) => !q)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition ${
                quizMode
                  ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              ⚡ Quiz Me
            </button>
          </div>

          <ChatWindow messages={messages} isThinking={isThinking} />

          {/* Input */}
          <form
            onSubmit={sendMessage}
            className="border-t border-gray-800 p-4 flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                quizMode
                  ? 'Enter a topic to get quizzed on...'
                  : 'Ask your question...'
              }
              className="flex-1 bg-gray-800 text-white border border-gray-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={isThinking || !input.trim()}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition"
            >
              Send
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
