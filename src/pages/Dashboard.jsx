import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, CheckCircle2, Clock, BarChart3, ArrowRight, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data } = await axios.get('http://https://st-incident-backend.onrender.com/api/incidents', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setIncidents(data);
            } catch (err) {
                console.error("Error fetching dashboard data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, [user.token]);

    const totalCount = incidents.length;
    const pendingCount = incidents.filter(i => i.status !== 'Closed').length;
    const resolvedCount = incidents.filter(i => i.status === 'Closed').length;
    const highPriorityCount = incidents.filter(i => i.severity === 'High').length;

    const stats = [
        { label: 'Total Incidents', value: totalCount, icon: <BarChart3 size={24}/>, color: 'bg-blue-600' },
        { label: 'Pending', value: pendingCount, icon: <Clock size={24}/>, color: 'bg-amber-500' },
        { label: 'Resolved', value: resolvedCount, icon: <CheckCircle2 size={24}/>, color: 'bg-emerald-500' },
        { label: 'High Priority', value: highPriorityCount, icon: <AlertCircle size={24}/>, color: 'bg-rose-600' },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 font-sans">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 tracking-tight">School Overview</h2>
                            <p className="text-gray-500 text-sm">Real-time incident tracking dashboard.</p>
                        </div>
                        {user?.role !== 'Parent' && (
                            <Link to="/create-incident" className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-800 transition shadow-lg shadow-blue-200">
                                <PlusCircle size={20} /> Report Incident
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    <p className="text-3xl font-black text-gray-800 mt-1">
                                        {loading ? '...' : stat.value.toString().padStart(2, '0')}
                                    </p>
                                </div>
                                <div className={`${stat.color} p-3 rounded-xl text-white shadow-lg`}>
                                    {stat.icon}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                            <h3 className="font-bold text-gray-800">Recent Activity</h3>
                            <Link to="/incidents" className="text-secondary font-bold text-sm flex items-center gap-1 hover:underline">
                                View Registry <ArrowRight size={16} />
                            </Link>
                        </div>
                        <div className="p-0">
                            {incidents.length === 0 ? (
                                <div className="p-16 text-center">
                                    <BarChart3 className="mx-auto text-gray-200 mb-2" size={48} />
                                    <p className="text-gray-400 font-medium">No incidents reported yet.</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-gray-50 text-gray-500 text-[10px] uppercase font-black tracking-widest border-b">
                                            <tr>
                                                <th className="px-6 py-4">Incident</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4">Date</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {incidents.slice(0, 5).map((incident) => (
                                                <tr key={incident._id} className="hover:bg-gray-50/50 transition cursor-default">
                                                    <td className="px-6 py-4 font-bold text-gray-700 text-sm">{incident.title}</td>
                                                    <td className="px-6 py-4 text-xs font-semibold text-gray-500">
                                                        <span className="bg-gray-100 px-2 py-1 rounded-md">{incident.category}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                            incident.status === 'Open' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                                                            incident.status === 'Closed' ? 'bg-emerald-50 text-green-600 border-green-100' : 
                                                            'bg-amber-50 text-amber-600 border-amber-100'
                                                        }`}>
                                                            {incident.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-xs text-gray-400 font-medium">
                                                        {new Date(incident.createdAt).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Dashboard;