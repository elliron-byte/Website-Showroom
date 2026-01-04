
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface AdminLoginProps {
  onLogin: (success: boolean) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [number, setNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError('');
    
    try {
      // Get global credentials from Supabase
      const { data, error: fetchError } = await supabase
        .from('admin_settings')
        .select('*')
        .single();

      if (fetchError) throw fetchError;

      if (number === data.number && password === data.password) {
        onLogin(true);
      } else {
        setError('Invalid credentials. Please check your number and password.');
      }
    } catch (err) {
      console.error("Login verify error:", err);
      // Fallback logic if table doesn't exist yet
      if (number === '0256414239' && password === 'KuKu2009') {
        onLogin(true);
      } else {
        setError('Connection error or invalid credentials.');
      }
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main-pattern px-4">
      <div className="max-w-md w-full bg-pattern rounded-[2.5rem] shadow-2xl border border-slate-200 p-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-950 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900">Admin Portal</h2>
          <p className="text-slate-500 font-medium mt-2">Secure cloud access across all devices</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Admin Number</label>
            <div className="relative">
              <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input 
                type="text" 
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                placeholder="Enter ID number"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Secret Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-2xl py-3.5 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-xs font-bold p-4 rounded-xl border border-red-100 animate-pulse">
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={isVerifying}
            className="w-full bg-indigo-950 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-900 transition-all shadow-xl shadow-indigo-950/20 flex items-center justify-center gap-2"
          >
            {isVerifying && <Loader2 className="w-5 h-5 animate-spin" />}
            {isVerifying ? 'Authenticating...' : 'Authenticate'}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <a href="/" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">Return to Homepage</a>
        </div>
      </div>
    </div>
  );
};
