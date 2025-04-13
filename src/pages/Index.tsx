
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { CheckCircle, BarChart2, Calendar, Award, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// Playful component for interactive feature cards
const FeatureCard = ({ icon: Icon, title, description, className }: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  className?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={cn(
        "bg-card p-6 rounded-lg border flex flex-col items-center text-center card-hover",
        isHovered && "shadow-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={cn(
          "h-12 w-12 rounded-full bg-habit-primary/10 flex items-center justify-center mb-4 transition-all duration-300",
          isHovered && "bg-habit-primary/30 transform scale-110"
        )}
      >
        <Icon className={cn(
          "h-6 w-6 text-habit-primary transition-all duration-300",
          isHovered && "text-habit-secondary"
        )} />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

// Sample habit card with animation
const AnimatedHabitCard = ({ title, streak, completed = false }: { 
  title: string; 
  streak?: number;
  completed?: boolean;
}) => {
  return (
    <div className={cn(
      "flex items-center gap-3 p-3 border rounded-md bg-background/80 transition-all duration-300",
      "hover:shadow-md hover:-translate-y-0.5"
    )}>
      <div className={cn(
        "h-6 w-6 rounded-full transition-all duration-300",
        completed ? "bg-status-completed flex items-center justify-center" : "border-2 border-habit-primary"
      )}>
        {completed && <CheckCircle className="h-4 w-4 text-white animate-pop" />}
      </div>
      <span className="font-medium">{title}</span>
      {streak && (
        <span className="ml-auto text-sm flex items-center gap-1">
          <span className="inline-block animate-pulse-light">🔥</span> {streak} days
        </span>
      )}
    </div>
  );
};

const Index: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);
  
  return (
    <div className="min-h-screen bg-background relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-habit-primary/10 to-habit-tertiary/5 pointer-events-none" />
        
        <div className="container mx-auto py-16 px-4 md:px-6 relative">
          <nav className="flex justify-between items-center mb-16">
            <div className="text-2xl font-bold bg-gradient-to-r from-habit-primary to-habit-tertiary bg-clip-text text-transparent flex items-center">
              <Sparkles className="h-5 w-5 mr-1 text-habit-primary" />
              HabitFlow
            </div>
            <div className="flex gap-4">
              <Button variant="ghost" onClick={() => navigate('/login')} className="interactive-btn">
                Log In
              </Button>
              <Button onClick={() => navigate('/signup')} className="interactive-btn">
                Sign Up
              </Button>
            </div>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Build better habits, <span className="bg-gradient-to-r from-habit-primary to-habit-tertiary bg-clip-text text-transparent">one day at a time</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Track your daily habits, build streaks, and improve your life with our simple and effective habit tracking app.
              </p>
              <div className="flex gap-4 pt-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-90 transition-opacity interactive-btn group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => navigate('/login')}
                  className="interactive-btn"
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
                    <AnimatedHabitCard title="Morning Meditation" streak={7} completed={true} />
                    <AnimatedHabitCard title="Read 30 minutes" streak={12} completed={true} />
                    <AnimatedHabitCard title="Drink water" />
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
            <FeatureCard 
              icon={CheckCircle}
              title="Track Daily Habits"
              description="Easily track your habits with a simple check-in system. Mark habits complete with a single tap."
            />
            
            <FeatureCard 
              icon={BarChart2}
              title="Visualize Progress"
              description="See your progress over time with beautiful charts and visualizations that keep you motivated."
            />
            
            <FeatureCard 
              icon={Calendar}
              title="Calendar View"
              description="Get a bird's eye view of your habit completion with our monthly calendar view."
            />
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="bg-habit-primary/10 rounded-lg p-8 md:p-12 text-center max-w-3xl mx-auto transform transition-transform hover:scale-[1.01]">
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
              className="bg-gradient-to-r from-habit-primary to-habit-tertiary hover:opacity-90 transition-all interactive-btn"
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
            <div className="text-xl font-bold bg-gradient-to-r from-habit-primary to-habit-tertiary bg-clip-text text-transparent mb-4 md:mb-0 flex items-center">
              <Sparkles className="h-4 w-4 mr-1 text-habit-primary" />
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
