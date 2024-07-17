import { useState, useEffect, useRef } from 'react';
import useSWR from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then(res => res.data);

const AgentChat = () => {
  const { data, error, mutate } = useSWR('/api/messages', fetcher);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to WebSocket server
    ws.current = new WebSocket('https://fuse-support-api.onrender.com');

    ws.current.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.current.onmessage = (event) => {
      const message =(event.data);
      console.log('WebSocket message received:', message);
      mutate(); // Refresh the messages
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (selectedChat && message.trim()) {
      await axios.post('/api/sendMessage', {
        chatId: selectedChat.chatId,
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
            className={`${selectedChat?.chatId === chat.chatId ? 'text-black' : ''}`}
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
                value={message}
                className='text-black'
                onChange={(e) => setMessage(e.target.value)}
                style={{ width: '80%', padding: '0.5rem' }}
              />
              <button onClick={handleSendMessage} className='border' style={{ padding: '0.5rem 1rem', marginLeft: '1rem' }}>
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
