import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// ------------------ Field Component ------------------
const Field = ({
  name,
  label,
  type = 'text',
  placeholder,
  form,
  errors,
  handleChange,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-300 mb-1">
      {label}
    </label>

    <input
      type={type}
      name={name}
      value={form[name]}
      onChange={handleChange}
      placeholder={placeholder}
      className={`input-field ${errors[name] ? 'border-red-500' : ''}`}
    />

    {errors[name] && (
      <p className="text-red-400 text-xs mt-1">
        {errors[name]}
      </p>
    )}
  </div>
);

// ------------------ Register Component ------------------
const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    avatar: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};

    if (!form.username)
      errs.username = 'Username is required';
    else if (form.username.length < 3)
      errs.username = 'Min 3 characters';
    else if (form.username.length > 20)
      errs.username = 'Max 20 characters';

    if (!form.email)
      errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = 'Invalid email';

    if (!form.password)
      errs.password = 'Password is required';
    else if (form.password.length < 6)
      errs.password = 'Min 6 characters';

    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';

    return errs;
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [e.target.name]: '',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);

    try {
      await register({
        username: form.username,
        email: form.email,
        password: form.password,
        avatar: form.avatar,
      });

      toast.success('Account created! Welcome to QuizBattle 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h1 className="text-3xl font-bold">Join QuizBattle</h1>
          <p className="text-slate-400 mt-2">
            Create your free account and start competing
          </p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field
              name="username"
              label="Username"
              placeholder="coolquizzer"
              form={form}
              errors={errors}
              handleChange={handleChange}
            />

            <Field
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              form={form}
              errors={errors}
              handleChange={handleChange}
            />

            <Field
              name="password"
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              form={form}
              errors={errors}
              handleChange={handleChange}
            />

            <Field
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Repeat password"
              form={form}
              errors={errors}
              handleChange={handleChange}
            />

            <Field
              name="avatar"
              label="Avatar URL (optional)"
              placeholder="https://..."
              form={form}
              errors={errors}
              handleChange={handleChange}
            />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-indigo-400 hover:underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;