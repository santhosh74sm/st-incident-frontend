import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Save, Trash2, ShieldCheck } from 'lucide-react';

const IncidentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [incident, setIncident] = useState(null);
    const [status, setStatus] = useState('');
    const [actionTaken, setActionTaken] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchIncident = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`https://st-incident-backend.onrender.com/api/incidents`, config);
                const current = data.find(i => i._id === id);
                if (current) {
                    setIncident(current);
                    setStatus(current.status);
                    setActionTaken(current.actionTaken || '');
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchIncident();
    }, [id, user.token]);

    // ✅ UPDATED DETAILED ERROR HANDLING
    const handleUpdate = async () => {
        try {
            const config = {
                headers: { 
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await axios.patch(
                `https://st-incident-backend.onrender.com/api/incidents/${id}/status`,
                { status, actionTaken },
                config
            );

            if (response.status === 200) {
                alert('Status updated successfully!');
                navigate('/incidents');
            }

        } catch (err) {
            console.error("Full Error Object:", err.response);
            const errorMsg = err.response?.data?.message || err.message;
            alert(`Failed to Update: ${errorMsg}`);
            
            if (err.response?.status === 401 || err.response?.status === 403) {
                console.log("Current User Role:", user.role);
                alert("Permissions Check: Unga role correct-ah illana token expire aagiduchu.");
            }
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Delete this report?")) {
            try {
                await axios.delete(
                    `https://st-incident-backend.onrender.com/api/incidents/${id}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                alert('Deleted!');
                navigate('/incidents');
            } catch (err) {
                alert('Error: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    if (loading) return <div className="p-10 text-center font-bold">Loading...</div>;
    if (!incident) return <div className="p-10 text-center font-bold text-red-500">Not found.</div>;

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 max-w-5xl mx-auto w-full overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-500 font-bold hover:text-blue-600 transition"
                        >
                            <ArrowLeft size={20} /> Back
                        </button>

                        {(user.role === 'Admin' || user.role === 'Teacher') && (
                            <button
                                onClick={handleDelete}
                                className="bg-red-50 text-red-600 px-4 py-2 rounded-xl font-bold flex items-center gap-2 border border-red-100 hover:bg-red-600 hover:text-white transition"
                            >
                                <Trash2 size={18} /> Delete
                            </button>
                        )}
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
                        <div className="p-8 border-b bg-slate-50">
                            <h2 className="text-3xl font-black text-slate-800 uppercase italic mb-2">
                                {incident.title}
                            </h2>
                            <div className="flex items-center gap-3">
                                <span className="text-slate-500 font-semibold italic">
                                    Reported by <span className="text-blue-600">{incident.reportedBy?.name}</span>
                                </span>
                                <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-[10px] font-bold uppercase">
                                    {incident.reportedBy?.role || 'Staff'}
                                </span>
                                <span className="text-slate-400 font-medium">
                                    • {new Date(incident.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
                            <div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase mb-4 tracking-widest">
                                    Description
                                </h4>
                                <div className="bg-slate-50 p-6 rounded-2xl border text-slate-700 italic mb-8">
                                    {incident.description || 'No description.'}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white border rounded-2xl">
                                        <p className="text-[10px] text-gray-400 font-black uppercase">Students</p>
                                        <p className="font-bold text-slate-800 text-sm">
                                            {incident.studentsInvolved?.join(', ') || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white border rounded-2xl">
                                        <p className="text-[10px] text-gray-400 font-black uppercase">Location</p>
                                        <p className="font-bold text-slate-800 text-sm uppercase">
                                            {incident.location || 'N/A'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white border rounded-2xl">
                                        <p className="text-[10px] text-gray-400 font-black uppercase">Class Info</p>
                                        <p className="font-bold text-slate-800 text-sm">
                                            {incident.class}th Std - Section {incident.section || 'All'}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white border rounded-2xl">
                                        <p className="text-[10px] text-gray-400 font-black uppercase">Severity</p>
                                        <p className={`font-bold text-sm ${
                                            incident.severity === 'High'
                                                ? 'text-red-600'
                                                : incident.severity === 'Medium'
                                                ? 'text-orange-500'
                                                : 'text-blue-600'
                                        }`}>
                                            {incident.severity}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Evidence Photo
                                </h4>
                                {incident.image ? (
                                    <img
                                        src={`https://st-incident-backend.onrender.com/${incident.image.replace(/\\/g, "/")}`}
                                        alt="evidence"
                                        className="w-full h-56 object-cover rounded-3xl border shadow-md"
                                    />
                                ) : (
                                    <div className="h-40 bg-gray-50 rounded-3xl flex items-center justify-center text-gray-400 border-2 border-dashed text-xs italic">
                                        No evidence uploaded
                                    </div>
                                )}

                                {(user.role === 'Admin' || user.role === 'Teacher') && (
                                    <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                                        <h4 className="text-sm font-bold text-blue-800 mb-4 flex items-center gap-2">
                                            <ShieldCheck size={18}/> Resolution Center
                                        </h4>
                                        <div className="space-y-4">
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="w-full p-3 border rounded-xl bg-white font-bold"
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Closed">Closed / Resolved</option>
                                            </select>

                                            <textarea
                                                rows="3"
                                                placeholder="Action taken..."
                                                value={actionTaken}
                                                onChange={(e) => setActionTaken(e.target.value)}
                                                className="w-full p-3 border rounded-xl"
                                            />

                                            <button
                                                onClick={handleUpdate}
                                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                                            >
                                                <Save size={18}/> Save Case Updates
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default IncidentDetail;
