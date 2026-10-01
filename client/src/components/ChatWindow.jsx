import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatWindow({ messages, isThinking }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {messages.length === 0 && !isThinking && (
        <div className="text-center text-gray-500 mt-10">
          Ask anything to get started 👋
        </div>
      )}

      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} content={m.content} />
      ))}

      {isThinking && (
        <div className="flex justify-start">
          <div className="bg-gray-700 text-gray-300 rounded-2xl rounded-bl-sm px-4 py-3 text-sm italic shadow-md">
            Thinking...
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
