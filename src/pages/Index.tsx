
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, BarChart2, Calendar, Award, ArrowRight } from 'lucide-react';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-habit-primary/10 to-habit-tertiary/5 pointer-events-none" />
        
        <div className="container mx-auto py-16 px-4 md:px-6 relative">
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-habit-primary to-habit-tertiary bg-clip-text text-transparent">
              HabitFlow
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')}>
                Log In
              </Button>
              <Button onClick={() => navigate('/signup')}>
                Sign Up
              </Button>
            </div>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Build better habits, one day at a time
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your daily habits, build streaks, and improve your life with our simple and effective habit tracking app.
              </p>
              <div className="flex gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-90 transition-opacity"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                >
                  Log In
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-habit-primary to-habit-tertiary blur-md opacity-30" />
                <div className="relative bg-card rounded-lg shadow-xl p-6 border">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 border rounded-md bg-background/80">
                      <div className="h-6 w-6 rounded-full bg-status-completed flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Morning Meditation</span>
                      <span className="ml-auto text-sm">🔥 7 days</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-md bg-background/80">
                      <div className="h-6 w-6 rounded-full bg-status-completed flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                      <span className="font-medium">Read 30 minutes</span>
                      <span className="ml-auto text-sm">🔥 12 days</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-md bg-background/80">
                      <div className="h-6 w-6 rounded-full border-2 border-habit-primary" />
                      <span className="font-medium">Drink water</span>
                      <span className="ml-auto text-sm">Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-accent/50 py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build and maintain great habits
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-habit-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-habit-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Daily Habits</h3>
              <p className="text-muted-foreground">
                Easily track your habits with a simple check-in system. Mark habits complete with a single tap.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-habit-primary/10 flex items-center justify-center mb-4">
                <BarChart2 className="h-6 w-6 text-habit-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visualize Progress</h3>
              <p className="text-muted-foreground">
                See your progress over time with beautiful charts and visualizations that keep you motivated.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-sm border flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-habit-primary/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-habit-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Calendar View</h3>
              <p className="text-muted-foreground">
                Get a bird's eye view of your habit completion with our monthly calendar view.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-habit-primary/10 rounded-lg p-8 md:p-12 text-center max-w-3xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-habit-primary/20 flex items-center justify-center mx-auto mb-6">
              <Award className="h-8 w-8 text-habit-primary" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Start building better habits today</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of people who are improving their lives one habit at a time with HabitFlow.
            </p>
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-90 transition-opacity"
            >
              Create Free Account
            </Button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-accent/50 py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-xl font-bold bg-gradient-to-r from-habit-primary to-habit-tertiary bg-clip-text text-transparent mb-4 md:mb-0">
              HabitFlow
            </div>
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} HabitFlow. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
