import { SUBJECT_MAP } from '../constants';

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function ChatHistory({ sessions, activeId, onSelect, onDelete }) {
  if (!sessions.length) {
    return (
      <p className="text-gray-500 text-sm px-3 py-4">
        No chats yet. Start a new one!
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {sessions.map((s) => {
        const isActive = String(s.id) === String(activeId);
        return (
          <li
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`group flex items-start justify-between gap-2 rounded-lg px-3 py-2 cursor-pointer transition ${
              isActive ? 'bg-purple-600' : 'bg-gray-800 hover:bg-gray-700'
            }`}
          >
            <div className="min-w-0">
              <div className="text-sm text-white truncate">
                {SUBJECT_MAP[s.subject]?.split(' ')[0] || '📚'}{' '}
                {s.title || `${s.subject} session`}
              </div>
              <div className="text-xs text-gray-300/70">{formatDate(s.created_at)}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(s.id);
              }}
              className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
              title="Delete session"
            >
              🗑️
            </button>
          </li>
        );
      })}
    </ul>
  );
}
