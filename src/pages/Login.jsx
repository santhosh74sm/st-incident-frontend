import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { LogIn, Mail, Lock, UserCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            // ✅ loginType: 'staff' add panniyachu
            const { data } = await axios.post('https://st-incident-backend.onrender.com/api/auth/login', { 
                email, password, loginType: 'staff' 
            });
            
            login(data);
            navigate('/dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-bold">
            <div className="max-w-md w-full bg-white rounded-[35px] shadow-2xl overflow-hidden border border-slate-100">
                <div className="bg-slate-900 p-10 text-center text-white">
                    <h2 className="text-3xl font-black uppercase tracking-tighter italic underline decoration-blue-500 underline-offset-8">Staff Portal</h2>
                    <p className="text-slate-400 text-[10px] mt-4 uppercase font-black tracking-widest italic">Admin & Faculty Login</p>
                </div>

                <div className="p-10">
                    {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[10px] mb-6 border border-rose-100 uppercase text-center italic">{error}</div>}
                    
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Official ID / Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input type="email" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-slate-700 font-black" 
                                    placeholder="email@school.com" onChange={(e) => setEmail(e.target.value)} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-3.5 text-slate-300" size={18} />
                                <input type="password" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-slate-700 font-black" 
                                    placeholder="••••••••" onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[22px] flex items-center justify-center gap-2 transition shadow-xl shadow-slate-200 uppercase text-xs tracking-widest">
                            {loading ? <Loader2 className="animate-spin" size={20}/> : <LogIn size={20} />} 
                            {loading ? 'Authenticating...' : 'Sign In to Portal'}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-4 font-black">Student Record Access</p>
                        <button onClick={() => navigate('/student-login')} className="w-full border-2 border-slate-100 text-slate-600 hover:border-blue-600 hover:text-blue-600 font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all uppercase text-[10px] tracking-widest italic">
                            <UserCircle size={18} /> Go to Student Login
                        </button>
                    </div>

                    <p className="text-center text-[10px] text-slate-400 mt-6 uppercase font-black italic">
                        New Staff Member? <Link to="/register" className="text-blue-600 hover:underline">Create Account</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;