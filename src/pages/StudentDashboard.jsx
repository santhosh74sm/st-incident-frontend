import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ShieldAlert, LogOut, Clock, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentDashboard = () => {
    const { user, logout } = useAuth();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Error Fix: Check if user and token exist
        if (!user || !user.token) {
            navigate('/student-login');
            return;
        }

        const fetchMyIncidents = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://https://st-incident-backend.onrender.com/api/incidents', config);
                setIncidents(data);
            } catch (err) {
                console.error("Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyIncidents();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/student-login');
    };

    if (!user) return null; // Avoid rendering if user is null during redirect

    return (
        <div className="min-h-screen bg-slate-50 font-bold">
            <header className="bg-white border-b p-6 flex justify-between items-center sticky top-0 z-10 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-100"><ShieldAlert size={24}/></div>
                    <div>
                        <h1 className="text-xl font-black text-slate-800 uppercase tracking-tighter italic">Student: {user.name}</h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">ADMISSION NO: {user.admissionNo}</p>
                    </div>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-2 text-rose-500 hover:bg-rose-50 px-5 py-2.5 rounded-2xl transition font-black uppercase text-xs border border-rose-50">
                    <LogOut size={18}/> Sign Out
                </button>
            </header>

            <main className="p-6 max-w-4xl mx-auto">
                <div className="mb-10 flex justify-between items-end border-b-2 border-slate-200 pb-4">
                    <h2 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter underline decoration-blue-500 decoration-4 underline-offset-8">My Incident Logs</h2>
                    <span className="bg-slate-800 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Total Logs: {incidents.length}</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600" size={40}/></div>
                ) : (
                    <div className="space-y-6">
                        {incidents.map(inc => (
                            <div key={inc._id} className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tight">{inc.category}</h3>
                                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">Logged on: {new Date(inc.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border-2 ${
                                        inc.status === 'Closed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                                    }`}>
                                        {inc.status === 'Closed' ? <CheckCircle className="inline mr-1" size={14}/> : <Clock className="inline mr-1" size={14}/>}
                                        {inc.status}
                                    </span>
                                </div>

                                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                                    <p className="text-slate-600 text-sm font-bold italic leading-relaxed">"{inc.description}"</p>
                                </div>

                                <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-50">
                                    <div className="flex items-center gap-6">
                                        <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest ${inc.severity === 'High' ? 'text-rose-500' : 'text-blue-500'}`}>
                                            <AlertTriangle size={16}/> {inc.severity} Priority
                                        </div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                                            Area: <span className="text-slate-600">{inc.location}</span>
                                        </div>
                                    </div>
                                    {inc.actionTaken ? (
                                        <div className="bg-blue-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg shadow-blue-100">
                                            Resolution: {inc.actionTaken}
                                        </div>
                                    ) : (
                                        <div className="text-[10px] text-slate-300 font-black uppercase tracking-widest italic">Awaiting resolution notes...</div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {incidents.length === 0 && (
                            <div className="text-center py-24 bg-white rounded-[40px] border-4 border-dashed border-slate-100">
                                <ShieldAlert className="mx-auto text-slate-200 mb-4" size={50}/>
                                <p className="text-slate-400 font-black uppercase italic tracking-widest">Clean Record! No incidents found.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default StudentDashboard;