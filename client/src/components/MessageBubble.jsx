export default function MessageBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 shadow-md whitespace-pre-wrap leading-relaxed text-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm'
            : 'bg-gray-700 text-white rounded-2xl rounded-bl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  );
}
