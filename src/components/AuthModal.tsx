import React, { useState } from 'react';
import { X, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();
  const [isLogin, setIsLogin] = useState<boolean>(authModalMode === 'login');
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Sync mode with prop change
  React.useEffect(() => {
    setIsLogin(authModalMode === 'login');
    setError('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      if (!username.trim() || !password) {
        setError('Please enter your username/email and password.');
        return;
      }
    } else {
      if (username.trim().length < 3) {
        setError('Username must be at least 3 characters.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setError('Please provide a valid email address.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters.');
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        await login(username.trim(), password);
      } else {
        await register(username.trim(), email.trim(), password);
      }
      closeAuthModal();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1b2228] w-full max-w-sm border border-[#2c3440] rounded-[3px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-[#99aabb]">
        <div className="px-5 py-4 border-b border-[#2c3440] flex items-center justify-between bg-[#14181c]">
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-[#00e054]" />
              <span className="w-2 h-2 rounded-full bg-[#ff8000]" />
              <span className="w-2 h-2 rounded-full bg-[#40bcf4]" />
            </div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">
              {isLogin ? 'Sign In to Chitra Lekha' : 'Create an Account'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeAuthModal}
            className="p-1 text-[#8899aa] hover:text-white rounded-[2px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-2.5 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded-[3px]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
              {isLogin ? 'Username or Email' : 'Username'}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#8899aa]">
                <User className="w-3.5 h-3.5" />
              </span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isLogin ? 'username or member email' : 'e.g. storylover'}
                className="w-full pl-8 pr-3 py-2 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#8899aa]">
                  <Mail className="w-3.5 h-3.5" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center text-[#8899aa]">
                <Lock className="w-3.5 h-3.5" />
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-8 pr-3 py-2 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-bold uppercase tracking-wider text-[#14181c] bg-[#00e054] hover:bg-[#00c84b] rounded-[3px] transition-colors shadow-md disabled:opacity-50"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Join Chitra Lekha'}
          </button>

          <div className="pt-2 text-center text-xs text-[#8899aa]">
            {isLogin ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-[#00e054] hover:underline font-bold"
                >
                  Create one here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-[#00e054] hover:underline font-bold"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
