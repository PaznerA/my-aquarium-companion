import { Link, useLocation } from 'react-router-dom';
import { Home, Droplets, Package, Settings, Menu, X, Book, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useI18n } from '@/lib/i18n';

export const GlassmorphismNavigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchMove, setTouchMove] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  const navItems = [
    { path: '/', label: t.nav.dashboard, icon: Home },
    { path: '/aquariums', label: t.nav.aquariums, icon: Droplets },
    { path: '/lexicon', label: t.nav.lexicon, icon: Book },
    { path: '/inventory', label: t.nav.inventory, icon: Package },
    { path: '/settings', label: t.nav.settings, icon: Settings },
  ];

  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchMove(currentTouch);
    
    const diff = currentTouch - touchStart;
    
    // Only allow dragging when open (dragging left to close)
    // or when at edge and dragging right to open
    if (isOpen && diff < 0) {
      setDragOffset(Math.max(diff, -300));
    } else if (!isOpen && touchStart < 30 && diff > 0) {
      setDragOffset(Math.min(diff, 300));
    }
  };

  const handleTouchEnd = () => {
    if (touchStart === null || touchMove === null) {
      setTouchStart(null);
      setTouchMove(null);
      setDragOffset(0);
      return;
    }

    const diff = touchMove - touchStart;
    
    // Swipe right to open (from left edge)
    if (!isOpen && touchStart < 30 && diff > 100) {
      setIsOpen(true);
    }
    // Swipe left to close
    else if (isOpen && diff < -100) {
      setIsOpen(false);
    }

    setTouchStart(null);
    setTouchMove(null);
    setDragOffset(0);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navTransform = isOpen 
    ? `translateX(${dragOffset}px)` 
    : `translateX(calc(-100% + ${Math.max(dragOffset, 0)}px))`;

  return (
    <>
      {/* Swipe detection overlay (left edge) */}
      <div 
        className="fixed left-0 top-0 w-8 h-full z-40 md:hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />

      {/* Backdrop overlay */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/40 backdrop-blur-sm transition-opacity duration-300 md:hidden",
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* Desktop Glass Navigation */}
      <nav 
        className="hidden md:flex fixed left-0 top-0 h-screen w-72 flex-col p-6 z-50
                   glass-nav border-r border-border/30"
      >
        <div className="mb-8 p-4 rounded-2xl glass-card">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">🐠</span>
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {t.nav.appName}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{t.nav.appDescription}</p>
        </div>
        
        <div className="flex flex-col gap-2">
          {navItems.map(({ path, label, icon: Icon }, index) => (
            <Link key={path} to={path}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3 h-12 px-4 text-base font-medium",
                  "glass-nav-item transition-all duration-300",
                  location.pathname === path 
                    ? "glass-nav-active shadow-lg shadow-primary/20" 
                    : "hover:glass-nav-hover"
                )}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <Icon className="h-5 w-5" />
                {label}
                {location.pathname === path && (
                  <ChevronRight className="h-4 w-4 ml-auto animate-pulse" />
                )}
              </Button>
            </Link>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-border/30">
          <div className="glass-card p-3 rounded-xl">
            <p className="text-xs text-muted-foreground">{t.settings.version} 1.2.0</p>
          </div>
        </div>
      </nav>

      {/* Mobile Glass Navigation - Slide from left */}
      <nav 
        ref={navRef}
        className={cn(
          "md:hidden fixed left-0 top-0 h-full w-72 z-50 flex flex-col p-6",
          "glass-nav border-r border-border/30",
          "transition-transform duration-300 ease-out"
        )}
        style={{ transform: navTransform }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="mb-8 p-4 rounded-2xl glass-card">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
            <span className="text-2xl">🐠</span>
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {t.nav.appName}
            </span>
          </h1>
        </div>
        
        <div className="flex flex-col gap-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path} onClick={() => setIsOpen(false)}>
              <Button
                variant={location.pathname === path ? 'default' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3 h-12 px-4 text-base font-medium",
                  "glass-nav-item transition-all duration-300",
                  location.pathname === path 
                    ? "glass-nav-active shadow-lg shadow-primary/20" 
                    : "hover:glass-nav-hover"
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Button>
            </Link>
          ))}
        </div>

        {/* Swipe indicator */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-1 h-16 rounded-full bg-foreground/20" />
      </nav>

      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 glass-header border-b border-border/30">
        <div className="flex items-center justify-between px-5 py-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 glass-nav-item"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
          
          <h1 className="text-lg font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
            🐠 {t.nav.appName}
          </h1>
          
          <div className="w-10" /> {/* Spacer for center alignment */}
        </div>
      </header>

      {/* Mobile Bottom Navigation - Floating glass pills */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 z-40 glass-bottom-nav rounded-2xl border border-border/30 safe-area-bottom">
        <div className="flex justify-around px-2 py-2">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link key={path} to={path}>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "flex-col h-auto py-2 px-3 gap-1 rounded-xl transition-all duration-300",
                  location.pathname === path 
                    ? "glass-nav-active bg-primary/20 text-primary shadow-lg shadow-primary/20" 
                    : "glass-nav-item hover:glass-nav-hover"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-transform duration-300",
                  location.pathname === path && "scale-110"
                )} />
                <span className="text-[10px] font-medium">{label}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};
