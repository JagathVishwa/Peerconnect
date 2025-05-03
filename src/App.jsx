import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Room from './pages/Room';  // Make sure you have this component in place
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
