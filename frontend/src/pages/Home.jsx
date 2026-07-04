import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: '⚡', title: 'Real-Time Battles', desc: 'Compete live against friends with Socket.IO-powered multiplayer.' },
  { icon: '🏆', title: 'Leaderboards', desc: 'Track your rank, score, and win percentage globally.' },
  { icon: '📚', title: '5 Categories', desc: 'Programming, Science, Movies, Sports & General Knowledge.' },
  { icon: '🎮', title: 'Easy to Play', desc: 'Create a room, share the code, and start quizzing in seconds.' },
];

const categories = ['Programming', 'General Knowledge', 'Movies', 'Sports', 'Science'];
const categoryEmojis = { Programming: '💻', 'General Knowledge': '🌍', Movies: '🎬', Sports: '⚽', Science: '🔬' };

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 via-slate-900 to-purple-900/20" />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="text-7xl mb-6 animate-bounce-slow">🧠</div>
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            QuizBattle
          </h1>
          <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
            Challenge your friends in real-time multiplayer quiz battles. Create a room, pick a quiz,
            and see who comes out on top!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                <Link to="/rooms/create" className="btn-primary text-lg py-3 px-8">
                  🚀 Create Room
                </Link>
                <Link to="/rooms/join" className="btn-secondary text-lg py-3 px-8">
                  🔑 Join Room
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg py-3 px-8">
                  🚀 Get Started Free
                </Link>
                <Link to="/login" className="btn-secondary text-lg py-3 px-8">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why QuizBattle?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card text-center hover:border-indigo-600 transition-colors">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Quiz Categories</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-full px-6 py-3 text-sm font-medium hover:border-indigo-500 transition-colors cursor-default"
              >
                <span>{categoryEmojis[cat]}</span>
                {cat}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 px-4 bg-slate-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { step: '1', icon: '🏠', title: 'Create a Room', desc: 'Start a room and get a 6-character code instantly.' },
              { step: '2', icon: '📤', title: 'Share the Code', desc: 'Send the room code to up to 7 friends.' },
              { step: '3', icon: '🎯', title: 'Battle!', desc: 'Answer questions fast to earn more points.' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {s.step}
                </div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-slate-400 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-16 px-4 text-center">
          <div className="max-w-2xl mx-auto card">
            <h2 className="text-3xl font-bold mb-4">Ready to Battle?</h2>
            <Link to="/register" className="btn-primary text-lg py-3 px-8">
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
