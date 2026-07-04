import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { roomAPI } from '../services/api';
import toast from 'react-hot-toast';

const pixelHeading = {
  fontFamily: '"Press Start 2P", "Courier New", monospace',
  color: '#ffd700',
  textShadow: '2px 2px 0 #000, 3px 3px 0 #7c3aed',
};

const JoinRoom = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6));
    setError('');
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Room code must be exactly 6 characters');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // First attempt
      await roomAPI.getByCode(code);
      navigate(`/rooms/${code}/lobby`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Room not found';

      // If "already ended", retry once after 2s — host may still be joining
      if (msg.includes('ended') || err.response?.status === 400) {
        toast('Room is initialising, retrying...', { icon: '⏳' });
        setTimeout(async () => {
          try {
            await roomAPI.getByCode(code);
            navigate(`/rooms/${code}/lobby`);
          } catch (retryErr) {
            const retryMsg = retryErr.response?.data?.message || 'Room not found';
            setError(retryMsg);
            toast.error(retryMsg);
            setLoading(false);
          }
        }, 2500);
      } else {
        setError(msg);
        toast.error(msg);
        setLoading(false);
      }
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
              backgroundImage: "url('/joinroom.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
          <div className="relative z-10 flex flex-col items-center justify-center h-full p-8 text-center" style={{ minHeight: '220px' }}>
            <h1 className="text-xl font-black mb-2" style={pixelHeading}>
              Join a Room
            </h1>
            <p
              className="text-sm"
              style={{ color: '#e2e8f0', textShadow: '1px 1px 0 #000' }}
            >
              Enter the 6-character room code to join a quiz battle
            </p>
          </div>
        </div>

        {/* Form card with glassmorphism */}
        <div
          className="rounded-xl border border-white/15 p-6"
          style={{
            background: 'rgba(10,10,25,0.80)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <form onSubmit={handleJoin} className="space-y-6">
            <div>
              <label
                className="block text-xs font-bold mb-2 text-center"
                style={{
                  color: '#ffd700',
                  textShadow: '1px 1px 0 #000',
                  fontFamily: '"Press Start 2P", monospace',
                }}
              >
                Room Code
              </label>
              <input
                type="text"
                value={code}
                onChange={handleChange}
                placeholder="ABCD12"
                maxLength={6}
                className={`input-field text-center text-3xl font-mono font-bold tracking-widest py-4 ${
                  error ? 'border-red-500' : ''
                }`}
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  color: '#ffd700',
                  borderColor: error ? '#ef4444' : 'rgba(255,255,255,0.2)',
                  textShadow: '1px 1px 0 #000',
                }}
              />
              {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
              <p className="text-slate-500 text-xs text-center mt-2">
                Letters and numbers only, 6 characters
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="btn-primary w-full py-4 text-base"
            >
              {loading ? '⏳ Joining...' : '🎮 Join Room'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;