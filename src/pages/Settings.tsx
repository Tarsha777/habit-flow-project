
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const Settings: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [successMessage, setSuccessMessage] = React.useState('');
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    } else if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user, isLoading, navigate]);
  
  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would make an API call to update the user
    // For this demo, we'll just show a success message
    setSuccessMessage('Your settings have been updated successfully.');
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(''), 3000);
  };
  
  const handleDeleteAccount = () => {
    // In a real application, you would make an API call to delete the user account
    // For this demo, we'll just log out the user
    logout();
    navigate('/');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse-light text-xl">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-6 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSaveChanges}>
              <CardContent className="space-y-4">
                {successMessage && (
                  <Alert className="bg-status-completed/10 text-status-completed border-status-completed">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{successMessage}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </CardContent>
              
              <CardFooter>
                <Button type="submit">Save Changes</Button>
              </CardFooter>
            </form>
          </Card>
          
          {/* Danger Zone */}
          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
              <CardDescription>
                Irreversible and destructive actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm">
                Deleting your account will remove all of your data. This action cannot be undone.
              </p>
              <Button 
                variant="destructive" 
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
