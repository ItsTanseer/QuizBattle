import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🤔</div>
        <h1 className="text-6xl font-extrabold text-indigo-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
        <p className="text-slate-400 mb-8 max-w-md mx-auto">
          Looks like this page got lost in the quiz void. Let's get you back to safety.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/" className="btn-primary py-3 px-8">
            🏠 Go Home
          </Link>
          <Link to="/dashboard" className="btn-secondary py-3 px-8">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
