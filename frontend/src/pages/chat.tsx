import { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import axios from 'axios';

const AgentChat = () => {
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('text');
  const [agentId, setAgentId] = useState(null); // Set this from your auth system

  const users = useQuery(api.users.getAllUsers) || [];
  const messagesQuery = useQuery(
    api.messages.getMessagesByUserId,
    selectedChat ? { userId: selectedChat._id } : 'skip'
  );

  const messages = selectedChat ? messagesQuery || [] : [];

  const handleSendMessage = async () => {
    if (selectedChat && message.trim()) {
      await axios.post('/api/sendMessage', {
        chatId: selectedChat.tokenIdentifier,
        userId: selectedChat._id,
        type: messageType,
        content: message,
        agentTokenIdentifier: 'gabby',
      });

      // Add the message to the UI
      setMessage('');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '30%', borderRight: '1px solid #ccc', padding: '1rem' }}>
        <h2>Chats</h2>
        {users.map((user) => (
          <div
            key={user._id}
            onClick={() => setSelectedChat(user)}
            style={{
              padding: '0.5rem',
              cursor: 'pointer',
              backgroundColor: selectedChat?._id === user._id ? '#f0f0f0' : 'transparent',
            }}
            className={selectedChat?._id === user._id ? 'text-black' : ''}
          >
            {user.name || `User ${user.tokenIdentifier}`}
          </div>
        ))}
      </div>
      <div style={{ width: '70%', padding: '1rem' }}>
        <h2>Chat Window</h2>
        {selectedChat ? (
          <>
            <div style={{ height: '80%', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
              {messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    margin: '0.5rem 0',
                    textAlign: msg.from === 'agent' ? 'right' : 'left',
                    alignSelf: msg.from === 'agent' ? 'flex-end' : 'flex-start',
                  }}
                >
                  <strong>{msg.from}: </strong>{msg.content}
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
