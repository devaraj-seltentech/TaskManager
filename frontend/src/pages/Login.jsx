import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/board';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    const success = await login(email, password);
    
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError('Invalid email or password');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl  flex items-center justify-center">
              <img
                src="/Selten-icon.png"
                alt="Selten WorkFlow"
                className="w-8 h-8 object-contain"
              />
            </div>
            <span className="text-2xl font-bold text-foreground">Selten WorkFlow</span>
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-bold text-foreground mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">
            Sign in to your account to continue
          </p>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-6 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@taskflow.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-10"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground mb-2">Demo Credentials</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p>Email: <code className="bg-background px-1.5 py-0.5 rounded text-foreground">admin@taskflow.com</code></p>
              <p>Password: <code className="bg-background px-1.5 py-0.5 rounded text-foreground">admin123</code></p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex flex-1 bg-primary items-center justify-center p-8">
        <div className="max-w-lg text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <img
              src="/Selten-icon.png"
              alt="Selten WorkFlow"
               className="w-16 h-16 object-contain brightness-0 invert"
            />
          </div>
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">
            Sprint & Task Management
          </h2>
          <p className="text-primary-foreground/80 text-lg">
            Streamline your workflow with powerful Kanban boards, sprint planning, and team collaboration tools.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
