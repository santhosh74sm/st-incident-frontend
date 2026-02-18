import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { KeyRound, User, ShieldCheck, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StudentLogin = () => {
    const [admissionNo, setAdmissionNo] = useState('');
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
            // ✅ loginType: 'student' add panniyachu
            const { data } = await axios.post('http://https://st-incident-backend.onrender.com/api/auth/login', { 
                email: admissionNo, password, loginType: 'student' 
            });
            
            login(data);
            navigate('/student-dashboard'); 
        } catch (err) {
            setError(err.response?.data?.message || "Invalid Student Record");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-blue-700 p-6 font-bold">
            <div className="max-w-md w-full bg-white rounded-[45px] shadow-2xl p-12 relative border-b-[10px] border-blue-50">
                {/* BACK BUTTON */}
                <button onClick={() => navigate('/login')} className="absolute left-10 top-10 text-slate-300 hover:text-blue-600 transition flex items-center gap-1 text-[10px] uppercase font-black">
                    <ArrowLeft size={20}/> Back
                </button>

                <div className="text-center mb-12 mt-4">
                    <div className="bg-blue-50 w-20 h-20 rounded-[30px] flex items-center justify-center mx-auto mb-4 border border-blue-100 text-blue-600 shadow-inner">
                        <ShieldCheck size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tighter italic">Student Portal</h2>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest font-black italic">Incident Database Access</p>
                </div>

                {error && <div className="bg-rose-50 text-rose-600 p-4 rounded-2xl text-[10px] mb-8 text-center font-black border border-rose-100 uppercase italic">{error}</div>}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Admission Number</label>
                        <div className="relative">
                            <User className="absolute left-5 top-4 text-slate-300" size={18} />
                            <input type="text" required className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[25px] outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-slate-700 transition-all" 
                                placeholder="eg: 1001" onChange={(e) => setAdmissionNo(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-2">Secret Key (ST+ID)</label>
                        <div className="relative">
                            <KeyRound className="absolute left-5 top-4 text-slate-300" size={18} />
                            <input type="password" required className="w-full pl-14 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-[25px] outline-none focus:ring-4 focus:ring-blue-500/10 font-black text-slate-700 transition-all" 
                                placeholder="eg: ST1001" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[30px] shadow-2xl shadow-blue-200 transition-all uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                        {loading ? <Loader2 className="animate-spin" size={20}/> : 'Sync My Record'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default StudentLogin;