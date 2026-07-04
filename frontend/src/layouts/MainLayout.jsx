import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';

const MainLayout = () => {
  const { pathname } = useLocation();
  const isDashboard = pathname === '/dashboard';
  const bgImage = isDashboard ? '/homebg.png' : '/otherbg.png';

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Dark overlay to keep text readable over pixel art */}
      <div className="fixed inset-0 bg-black/55 pointer-events-none z-0" />

      <Navbar />
      <main className="flex-1 relative z-10">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
