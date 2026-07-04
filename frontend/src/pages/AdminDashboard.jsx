import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { quizAPI } from '../services/api';
import toast from 'react-hot-toast';

const diffColors = {
  Easy: 'bg-green-900 text-green-300',
  Medium: 'bg-yellow-900 text-yellow-300',
  Hard: 'bg-red-900 text-red-300',
};

const catEmoji = {
  Programming: '💻',
  'General Knowledge': '🌍',
  Movies: '🎬',
  Sports: '⚽',
  Science: '🔬',
};

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  const loadQuizzes = () => {
    quizAPI.getAll()
      .then((r) => setQuizzes(r.data.quizzes))
      .catch(() => toast.error('Failed to load quizzes'))
      .finally(() => setLoading(false));
  };

  useEffect(loadQuizzes, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await quizAPI.delete(id);
      toast.success('Quiz deleted');
      setQuizzes((q) => q.filter((x) => x._id !== id));
    } catch {
      toast.error('Failed to delete quiz');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1">Manage quizzes</p>
        </div>
        <Link to="/admin/quizzes/new" className="btn-primary">
          + New Quiz
        </Link>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-20">Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-5xl mb-4">📝</div>
          <p className="text-slate-400 mb-6">No quizzes yet.</p>
          <Link to="/admin/quizzes/new" className="btn-primary">Create First Quiz</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {quizzes.map((q) => (
            <div key={q._id} className="card flex flex-col gap-3 hover:border-indigo-600 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-bold text-lg leading-tight">{q.title}</p>
                  <p className="text-slate-400 text-sm mt-1">
                    {catEmoji[q.category]} {q.category}
                  </p>
                </div>
                <span className={`badge ${diffColors[q.difficulty]} ml-2 flex-shrink-0`}>
                  {q.difficulty}
                </span>
              </div>

              <p className="text-slate-500 text-xs">
                ⏱ {q.timePerQuestion}s per question
              </p>

              <div className="flex gap-2 mt-auto pt-2 border-t border-slate-700">
                <Link
                  to={`/admin/quizzes/${q._id}/edit`}
                  className="btn-secondary flex-1 text-center text-sm py-1.5"
                >
                  ✏️ Edit
                </Link>
                <button
                  onClick={() => handleDelete(q._id, q.title)}
                  disabled={deleting === q._id}
                  className="btn-danger flex-1 text-sm py-1.5"
                >
                  {deleting === q._id ? '...' : '🗑️ Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
