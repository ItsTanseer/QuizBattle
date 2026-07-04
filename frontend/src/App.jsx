import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Lobby from './pages/Lobby';
import QuizScreen from './pages/QuizScreen';
import Results from './pages/Results';
import Leaderboard from './pages/Leaderboard';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import QuizForm from './pages/QuizForm';
import NotFound from './pages/NotFound';

// Auth guards
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';

const App = () => {
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="admin/login" element={<AdminLogin />} />

            {/* Protected (logged-in) routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="rooms/create" element={<CreateRoom />} />
              <Route path="rooms/join" element={<JoinRoom />} />
              <Route path="rooms/:code/lobby" element={<Lobby />} />
              <Route path="rooms/:code/quiz" element={<QuizScreen />} />
              <Route path="matches/:id/results" element={<Results />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/quizzes/new" element={<QuizForm />} />
              <Route path="admin/quizzes/:id/edit" element={<QuizForm />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </SocketProvider>
    </AuthProvider>
  );
};

export default App;
