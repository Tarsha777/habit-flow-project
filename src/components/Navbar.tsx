
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Calendar, BarChart2, Settings, LogOut, BookOpen } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span 
            className="text-2xl font-bold bg-gradient-to-r from-habit-primary to-habit-tertiary bg-clip-text text-transparent cursor-pointer"
            onClick={() => navigate('/dashboard')}
          >
            HabitFlow
          </span>
        </div>
        
        {user ? (
          <div className="flex items-center gap-4">
            <Button 
              variant={isActive('/dashboard') ? 'default' : 'ghost'}
              className="flex items-center gap-1" 
              onClick={() => navigate('/dashboard')}
            >
              <BarChart2 className="h-5 w-5 text-habit-primary" />
              <span className="hidden md:inline">Dashboard</span>
            </Button>
            
            <Button 
              variant={isActive('/calendar') ? 'default' : 'ghost'}
              className="flex items-center gap-1" 
              onClick={() => navigate('/calendar')}
            >
              <Calendar className="h-5 w-5 text-habit-primary" />
              <span className="hidden md:inline">Calendar</span>
            </Button>
            
            <Button 
              variant={isActive('/journal') ? 'default' : 'ghost'}
              className="flex items-center gap-1" 
              onClick={() => navigate('/journal')}
            >
              <BookOpen className="h-5 w-5 text-habit-primary" />
              <span className="hidden md:inline">Journal</span>
            </Button>
            
            <Button 
              variant={isActive('/settings') ? 'default' : 'ghost'}
              className="flex items-center gap-1" 
              onClick={() => navigate('/settings')}
            >
              <Settings className="h-5 w-5 text-habit-primary" />
              <span className="hidden md:inline">Settings</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center gap-1" 
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Log In
            </Button>
            <Button onClick={() => navigate('/signup')}>
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
