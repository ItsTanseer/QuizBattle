import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { quizAPI } from '../services/api';
import toast from 'react-hot-toast';

const CATEGORIES = ['Programming', 'General Knowledge', 'Movies', 'Sports', 'Science'];
const DIFFICULTIES = ['Easy', 'Medium', 'Hard'];

const emptyQuestion = () => ({
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  points: 100,
});

const QuizForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    category: 'General Knowledge',
    difficulty: 'Medium',
    timePerQuestion: 15,
    questions: [emptyQuestion()],
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  // Load existing quiz for editing
  useEffect(() => {
    if (!isEdit) return;
    quizAPI.getById(id)
      .then((r) => setForm(r.data.quiz))
      .catch(() => { toast.error('Quiz not found'); navigate('/admin'); })
      .finally(() => setFetching(false));
  }, [id, isEdit, navigate]);

  const updateField = (field, value) =>
    setForm((p) => ({ ...p, [field]: value }));

  const updateQuestion = (qi, field, value) =>
    setForm((p) => {
      const questions = [...p.questions];
      questions[qi] = { ...questions[qi], [field]: value };
      return { ...p, questions };
    });

  const updateOption = (qi, oi, value) =>
    setForm((p) => {
      const questions = [...p.questions];
      const options = [...questions[qi].options];
      options[oi] = value;
      questions[qi] = { ...questions[qi], options };
      return { ...p, questions };
    });

  const addQuestion = () =>
    setForm((p) => ({ ...p, questions: [...p.questions, emptyQuestion()] }));

  const removeQuestion = (qi) => {
    if (form.questions.length === 1) { toast.error('Need at least 1 question'); return; }
    setForm((p) => ({ ...p, questions: p.questions.filter((_, i) => i !== qi) }));
  };

  const validate = () => {
    if (!form.title.trim()) return 'Quiz title is required';
    for (let i = 0; i < form.questions.length; i++) {
      const q = form.questions[i];
      if (!q.question.trim()) return `Question ${i + 1}: text is required`;
      if (q.options.some((o) => !o.trim())) return `Question ${i + 1}: all 4 options are required`;
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { toast.error(err); return; }

    setLoading(true);
    try {
      if (isEdit) {
        await quizAPI.update(id, form);
        toast.success('Quiz updated!');
      } else {
        await quizAPI.create(form);
        toast.success('Quiz created!');
      }
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-center py-20 text-slate-400">Loading quiz...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate('/admin')} className="text-slate-400 hover:text-white text-xl">←</button>
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Quiz' : 'Create Quiz'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quiz Meta */}
        <div className="card space-y-5">
          <h2 className="font-bold text-lg border-b border-slate-700 pb-3">Quiz Details</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="e.g. JavaScript Fundamentals"
              className="input-field"
              maxLength={100}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
              <select
                value={form.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="input-field"
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Difficulty</label>
              <select
                value={form.difficulty}
                onChange={(e) => updateField('difficulty', e.target.value)}
                className="input-field"
              >
                {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Seconds per Question</label>
              <input
                type="number"
                value={form.timePerQuestion}
                onChange={(e) => updateField('timePerQuestion', Number(e.target.value))}
                min={5}
                max={60}
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg">Questions ({form.questions.length})</h2>
            <button type="button" onClick={addQuestion} className="btn-secondary text-sm py-1.5 px-4">
              + Add Question
            </button>
          </div>

          {form.questions.map((q, qi) => (
            <div key={qi} className="card space-y-4 border-l-4 border-indigo-600">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-indigo-400">Question {qi + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeQuestion(qi)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Question Text *</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(qi, 'question', e.target.value)}
                  placeholder="Enter the question..."
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-2">
                  Options * — click a letter to mark the correct answer
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['A', 'B', 'C', 'D'].map((letter, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuestion(qi, 'correctAnswer', oi)}
                        className={`w-9 h-9 rounded-lg font-bold text-sm flex-shrink-0 transition-colors ${
                          q.correctAnswer === oi
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                        }`}
                      >
                        {letter}
                      </button>
                      <input
                        type="text"
                        value={q.options[oi]}
                        onChange={(e) => updateOption(qi, oi, e.target.value)}
                        placeholder={`Option ${letter}`}
                        className="input-field flex-1 py-2"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-green-400 mt-2">
                  ✓ Correct answer: Option {['A', 'B', 'C', 'D'][q.correctAnswer]}
                </p>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Points for this question</label>
                <input
                  type="number"
                  value={q.points}
                  onChange={(e) => updateQuestion(qi, 'points', Number(e.target.value))}
                  min={10}
                  max={500}
                  className="input-field w-32"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary flex-1 py-3 text-lg">
            {loading ? 'Saving...' : isEdit ? '💾 Save Changes' : '✨ Create Quiz'}
          </button>
          <button type="button" onClick={() => navigate('/admin')} className="btn-secondary px-6">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizForm;
