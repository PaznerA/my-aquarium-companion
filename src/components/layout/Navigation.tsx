import { Link, useLocation } from 'react-router-dom';
import { Home, Droplets, Package, Settings, Menu, X, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export const Navigation = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useI18n();

  const navItems = [
    { path: '/', label: t.nav.dashboard, icon: Home },
    { path: '/aquariums', label: t.nav.aquariums, icon: Droplets },
    { path: '/lexicon', label: t.lexicon.title, icon: Book },
    { path: '/inventory', label: t.nav.inventory, icon: Package },
    { path: '/settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col border-r-2 border-border bg-card p-8">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-tight">
            🐠 {t.nav.appName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t.nav.appDescription}</p>
        </div>
        
        <div className="flex flex-col gap-1.5">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3 h-12 px-4 text-base font-medium transition-all",
                  location.pathname === path 
                    ? "shadow-sm" 
                    : "hover:bg-accent/50 hover:translate-x-1"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-border">
          <p className="text-xs text-muted-foreground">{t.settings.version} 1.2.0</p>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed top-0 left-0 right-0 z-50 border-b-2 border-border bg-card">
        <div className="flex items-center justify-between px-5 py-4">
          <h1 className="text-lg font-bold">🐠 {t.nav.appName}</h1>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10"
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
          <div className="flex flex-col p-5 gap-1.5">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link key={path} to={path} onClick={() => setMobileOpen(false)}>
                <Button
                  variant={location.pathname === path ? 'default' : 'ghost'}
                  className="w-full justify-start gap-3 h-12 px-4 text-base"
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
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t-2 border-border bg-card safe-area-bottom">
        <div className="flex justify-around px-2 py-3">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                size="icon"
                className={cn(
                  "flex-col h-auto py-2.5 px-4 gap-1.5 rounded-xl transition-all",
                  location.pathname === path && "shadow-sm"
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};
