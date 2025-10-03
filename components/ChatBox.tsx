"use client";

type ChatBoxProps = {
  messages: string[];
};

export default function ChatBox({ messages }: ChatBoxProps) {
  return (
    <div className="border rounded-lg p-4 max-h-80 overflow-y-auto bg-gray-50">
      {messages.map((msg, idx) => (
        <div key={idx} className="p-1 border-b text-sm">
          {msg}
        </div>
      ))}
    </div>
  );
}
