import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; 
import Navbar from '../components/Navbar'; 
import { 
    Search, Filter, AlertCircle, Calendar, 
    User as UserIcon, PlusCircle, Eye, Clock, AlertTriangle 
} from 'lucide-react';

const IncidentList = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [filteredIncidents, setFilteredIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const fetchIncidents = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const token = userInfo?.token || localStorage.getItem('userToken');
                if (!token) { navigate('/login'); return; }

                const config = { headers: { Authorization: `Bearer ${token}` } };
                const { data } = await axios.get('https://st-incident-backend.onrender.com/api/incidents', config);
                setIncidents(data);
                setFilteredIncidents(data);
            } catch (err) {
                console.error("Error fetching incidents", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIncidents();
    }, [navigate]);

    useEffect(() => {
        let result = incidents;
        if (filterStatus !== 'All') {
            result = result.filter(i => i.status === filterStatus);
        }
        if (searchTerm) {
            const lowerTerm = searchTerm.toLowerCase();
            result = result.filter(i => 
                i.title.toLowerCase().includes(lowerTerm) ||
                i.category.toLowerCase().includes(lowerTerm) ||
                (i.studentsInvolved && i.studentsInvolved.some(s => s.toLowerCase().includes(lowerTerm)))
            );
        }
        setFilteredIncidents(result);
    }, [searchTerm, filterStatus, incidents]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Open': return 'bg-rose-100 text-rose-700 border-rose-200';
            case 'In Progress': return 'bg-amber-100 text-amber-700 border-amber-200';
            case 'Closed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getSeverityInfo = (severity) => {
        if (severity === 'High') return { icon: <AlertCircle size={14} />, color: 'text-rose-600' };
        if (severity === 'Medium') return { icon: <AlertTriangle size={14} />, color: 'text-amber-600' };
        return { icon: <Clock size={14} />, color: 'text-blue-600' };
    };

    return (
        <div className="flex h-screen bg-[#F3F4F6] overflow-hidden">
            <Sidebar /> 
            <div className="flex-1 flex flex-col overflow-hidden">
                <Navbar />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#F3F4F6] p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">All Incidents</h1>
                                <p className="text-gray-500 text-sm">View and manage reported incidents</p>
                            </div>
                            <button onClick={() => navigate('/create-incident')} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow transition">
                                <PlusCircle size={18} /> Report New Incident
                            </button>
                        </div>

                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                                <input type="text" placeholder="Search by student or type..." className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                            </div>
                            <select className="p-2 border rounded-lg bg-white" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                <option value="All">All Status</option>
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        {loading ? <div className="text-center py-20 text-gray-500 font-bold">Loading...</div> : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredIncidents.map((incident) => (
                                    <div key={incident._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(incident.status)}`}>{incident.status}</span>
                                            <div className={`flex items-center gap-1 text-xs font-bold ${getSeverityInfo(incident.severity).color}`}>{getSeverityInfo(incident.severity).icon} {incident.severity}</div>
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800 mb-1 uppercase italic">{incident.title}</h3>
                                        <p className="text-[11px] text-gray-400 mb-4 font-medium">Reported by: {incident.reportedBy?.name || 'Unknown'}</p>
                                        
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                            <div className="flex items-center gap-2">
                                                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600"><UserIcon size={16} /></div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold">Students Involved</p>
                                                    <p className="text-sm font-semibold text-gray-700">
                                                        {incident.studentsInvolved?.length > 0 ? incident.studentsInvolved.join(', ') : "N/A"}
                                                    </p>
                                                </div>
                                            </div>
                                            <button onClick={() => navigate(`/incidents/${incident._id}`)} className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1">View Details <Eye size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};
export default IncidentList;