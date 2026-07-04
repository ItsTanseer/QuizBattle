import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import toast from 'react-hot-toast';

const pixelHeading = {
  fontFamily: '"Press Start 2P", "Courier New", monospace',
  color: '#ffd700',
  textShadow: '2px 2px 0 #000, 3px 3px 0 #7c3aed',
};

const CreateRoom = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await roomAPI.create();
      const room = res.data.room;
      toast.success(`Room created! Code: ${room.code}`);
      navigate(`/rooms/${room.code}/lobby`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Hero image card */}
        <div
          className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl mb-6"
          style={{ minHeight: '220px' }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('/createroom.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center" style={{ minHeight: '220px' }}>
            <h1 className="text-xl font-black mb-2" style={pixelHeading}>
              Create a Room
            </h1>
            <p
              className="text-sm"
              style={{ color: '#e2e8f0', textShadow: '1px 1px 0 #000' }}
            >
              You'll be the host. Share the room code with friends once it's created.
            </p>
          </div>
        </div>

        {/* Rules card with glassmorphism */}
        <div
          className="rounded-xl border border-white/15 p-6 space-y-5"
          style={{
            background: 'rgba(10,10,25,0.80)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div
            className="rounded-lg p-4 space-y-2 border border-white/10"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          >
            <h3
              className="text-xs font-bold"
              style={{
                color: '#ffd700',
                textShadow: '1px 1px 0 #000',
                fontFamily: '"Press Start 2P", monospace',
              }}
            >
              Room Rules
            </h3>
            <ul className="text-slate-300 text-sm space-y-1 mt-2">
              <li>• Maximum 8 players per room</li>
              <li>• Minimum 2 players to start</li>
              <li>• Only you (host) can start the game</li>
              <li>• You'll select the quiz in the lobby</li>
              <li>• Room code is auto-generated</li>
            </ul>
          </div>

          <button
            onClick={handleCreate}
            disabled={loading}
            className="btn-primary w-full py-4 text-base"
          >
            {loading ? '⏳ Creating Room...' : '✨ Create Room'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateRoom;
