// pages/agentChat.tsx
import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const AgentChat = () => {
  const { data, error, mutate } = useSWR('/api/messages', fetcher);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');

  const handleSendMessage = async () => {
    if (selectedChat && message.trim()) {
      await axios.post('/api/sendMessage', {
        chatId: selectedChat.chatId as any,
        message,
      });
      setMessage('');
      mutate(); // Refresh the messages
    }
  };

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h2>Chats</h2>
        {data.messages.map((chat: any) => (
          <div
            key={chat.chatId}
            onClick={() => setSelectedChat(chat)}
            style={{
              padding: '0.5rem',
              cursor: 'pointer',
              backgroundColor: selectedChat?.chatId === chat.chatId ? '#f0f0f0' : 'transparent',
            }}
            className={`${selectedChat?.chatId === chat.chatId ? 'bg-gray-200 text-black' : ''}`}
          >
            {chat.username || `User ${chat.chatId}`}
          </div>
        ))}
      </div>
      <div style={{ width: '70%', padding: '1rem' }}>
        <h2>Chat Window</h2>
        {selectedChat ? (
          <>
            <div style={{ height: '80%', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
              {selectedChat.messages.map((msg: any, index: number) => (
                <div key={index} style={{ margin: '0.5rem 0' }}>
                  <strong>{msg.from}: </strong>{msg.text}
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1rem' }}>
              <input
                type="text"
                className='text-black'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '80%', padding: '0.5rem' }}
              />
              <button className='border' onClick={handleSendMessage} style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div>Select a chat to view messages</div>
        )}
      </div>
    </div>
  );
};

export default AgentChat;
