import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Mail, Lock, User, ShieldCheck } from 'lucide-react';

const Register = () => {
    // Default role Teacher-nu maathiyachu
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Teacher' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://st-incident-backend.onrender.com/api/auth/register', formData);
            alert("Staff Account Created Successfully!");
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-bold">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                <div className="bg-primary p-8 text-center text-white">
                    <h2 className="text-3xl font-black uppercase tracking-tighter">Staff Portal</h2>
                    <p className="text-blue-100 text-xs mt-2 font-medium">Create Admin or Teacher account</p>
                </div>

                <div className="p-8">
                    {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-xs mb-6 border border-rose-100">{error}</div>}
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input type="text" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                                placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                        </div>

                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input type="email" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                                placeholder="Email Address" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                        </div>

                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <input type="password" required className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
                                placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} />
                        </div>

                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-3.5 text-slate-400" size={18} />
                            <select className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none bg-white font-black uppercase text-xs tracking-widest"
                                onChange={(e) => setFormData({...formData, role: e.target.value})}>
                                <option value="Teacher">Teacher</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </div>

                        <button type="submit" className="w-full bg-primary hover:bg-blue-800 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition shadow-lg shadow-blue-100 uppercase text-sm tracking-widest">
                            <UserPlus size={20} /> Register Staff
                        </button>
                    </form>
                    <p className="text-center text-xs text-slate-400 mt-8 font-medium">
                        Go back to <Link to="/login" className="text-primary font-black hover:underline">Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;