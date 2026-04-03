import { ReactNode } from 'react';
import { useAuth } from '@/lib/authContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, LogOut, LayoutDashboard, History, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = user?.role === 'coordinador'
    ? [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Nueva Cirugía', path: '/nueva-cirugia', icon: Plus },
        { label: 'Historial', path: '/historial', icon: History },
      ]
    : user?.role === 'encargado'
    ? [
        { label: 'Mis Cirugías', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Historial', path: '/historial', icon: History },
      ]
    : [
        { label: 'Mis Cirugías', path: '/dashboard', icon: LayoutDashboard },
      ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SafeOp</span>
          </button>

          <nav className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button key={item.path} onClick={() => navigate(item.path)} className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
                  <Icon className="h-4 w-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">{user?.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
