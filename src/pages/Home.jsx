import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './Home.css';  // Ensure this file exists and contains the styles

function Home() {
  const [username, setUsername] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    if (!username.trim()) return alert("Enter your name!");
    const newRoomId = uuidv4();
    navigate(`/room/${newRoomId}?name=${encodeURIComponent(username)}`);
  };

  const handleJoinRoom = () => {
    if (!username.trim() || !roomId.trim()) return alert("Fill in all fields!");
    navigate(`/room/${roomId}?name=${encodeURIComponent(username)}`);
  };

  return (
    <div className="home-container">
      <h1>👋 Welcome to PeerConnect+</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <div className="actions">
        <button onClick={handleCreateRoom}>🚀 Create New Room</button>
      </div>

      <div className="join-section">
        <input
          type="text"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button onClick={handleJoinRoom}>🔗 Join Room</button>
      </div>
    </div>
  );
}

export default Home;
