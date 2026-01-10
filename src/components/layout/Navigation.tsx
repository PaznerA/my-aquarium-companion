import { Link, useLocation } from 'react-router-dom';
import { Home, Droplets, Package, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/aquariums', label: 'Akvária', icon: Droplets },
  { path: '/inventory', label: 'Zásoby', icon: Package },
  { path: '/settings', label: 'Nastavení', icon: Settings },
];

export const Navigation = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-64 flex-col border-r-2 border-border bg-card p-6">
        <div className="mb-8">
          <h1 className="text-xl font-bold tracking-tight">
            🐠 AquariumJournal
          </h1>
        </div>
        
        <div className="flex flex-col gap-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                className="w-full justify-start gap-3"
              >
                <Icon className="h-5 w-5" />
                {label}
              </Button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 border-b-2 border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold">🐠 AquariumJournal</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
        
        <div
          className={cn(
            'absolute left-0 right-0 top-full border-b-2 border-border bg-card transition-all duration-200',
            mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          )}
        >
          <div className="flex flex-col p-4 gap-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={location.pathname === path ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3"
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border bg-card">
        <div className="flex justify-around p-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="icon"
                className="flex-col h-auto py-2 gap-1"
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};
