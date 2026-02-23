import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Send, Image as ImageIcon } from 'lucide-react';

export function Chat() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { messages, sendMessage, jobs, currentUser } = useApp();
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const job = jobs.find(j => j.id === jobId);
  const chatMessages = messages[jobId!] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = () => {
    if (!newMessage.trim() || !jobId) return;

    sendMessage(jobId, {
      jobId,
      senderId: currentUser?.id || '',
      text: newMessage,
      type: 'user',
    });

    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Job not found</p>
      </div>
    );
  }

  const otherPartyName = currentUser?.role === 'customer' 
    ? job.providerName || 'Provider'
    : job.customerName;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)}>
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold">{otherPartyName}</h1>
            <p className="text-xs text-gray-600">{job.workType} - {job.subject}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto max-w-md mx-auto w-full p-4 space-y-3">
        {chatMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          chatMessages.map((msg) => {
            const isOwnMessage = msg.senderId === currentUser?.id;
            const isSystemMessage = msg.type === 'system';

            if (isSystemMessage) {
              return (
                <div key={msg.id} className="flex justify-center">
                  <div className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {msg.text}
                  </div>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    isOwnMessage
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-900 border'
                  }`}
                >
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Attachment"
                      className="rounded mb-2 max-w-full"
                    />
                  )}
                  {msg.text && <p className="text-sm">{msg.text}</p>}
                  <span
                    className={`text-xs mt-1 block ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t">
        <div className="max-w-md mx-auto p-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ImageIcon size={20} />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!newMessage.trim()}>
              <Send size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
