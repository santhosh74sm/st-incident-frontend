import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Send, ShieldAlert, Camera, CheckSquare, Square, Search, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateIncident = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 
        description: '', 
        category: '', 
        severity: 'Low', 
        class: '', 
        section: '', 
        location: '' 
    });
    
    const [dbFilters, setDbFilters] = useState({ classes: [], sections: [] });
    const [students, setStudents] = useState([]);
    const [studentSearch, setStudentSearch] = useState('');
    const [selectedStudent, setSelectedStudent] = useState('');
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [image, setImage] = useState(null);
    const [newField, setNewField] = useState({ type: '', val: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, [user.token]);

    const fetchInitialData = async () => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const resFilters = await axios.get('http://https://st-incident-backend.onrender.com/api/students/filters', config);
            const resCat = await axios.get('http://https://st-incident-backend.onrender.com/api/incidents/categories', config);
            const resLoc = await axios.get('http://https://st-incident-backend.onrender.com/api/incidents/locations', config);

            setDbFilters({
                classes: resFilters.data.classes || [],
                sections: resFilters.data.sections || []
            });

            setCategories(resCat.data || []);
            setLocations(resLoc.data || []);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        if (formData.class && formData.section) {
            axios.get(
                `http://https://st-incident-backend.onrender.com/api/students/filter?className=${formData.class}&section=${formData.section}`,
                { headers: { Authorization: `Bearer ${user.token}` } }
            ).then(res => {
                const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
                setStudents(sorted);
            });
        } else {
            setStudents([]);
        }
    }, [formData.class, formData.section, user.token]);

    const filteredStudents = students.filter(s =>
        s.name.toLowerCase().includes(studentSearch.toLowerCase())
    );

    const handleToggleStudent = (name) => {
        setSelectedStudent(prev => prev === name ? '' : name);
    };

    const handleDynamicAdd = async () => {
        if (!newField.val) return;

        const type = newField.type;
        const url = type === 'category' ? 'categories' : 'locations';

        try {
            await axios.post(
                `http://https://st-incident-backend.onrender.com/api/incidents/${url}`,
                { name: newField.val },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            setFormData(prev => ({ ...prev, [type]: newField.val }));
            setNewField({ type: '', val: '' });
            fetchInitialData();
        } catch (err) {
            alert("Error adding new " + type);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.category || !formData.location || !selectedStudent) {
            alert("Please select Type, Location and Student!");
            return;
        }

        setLoading(true);

        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        data.append('title', formData.category);
        data.append('studentsInvolved', selectedStudent);
        if (image) data.append('image', image);

        try {
            await axios.post('http://https://st-incident-backend.onrender.com/api/incidents', data, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            alert("Incident Reported Successfully!");
            navigate('/incidents');
        } catch (err) {
            alert("Error reporting incident. Check all fields.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 max-w-5xl mx-auto w-full overflow-y-auto">
                    <div className="bg-white rounded-3xl shadow-sm border p-8">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <ShieldAlert className="text-primary" /> Report Incident
                        </h2>

                        <textarea
                            className="w-full p-4 border rounded-2xl mb-6 outline-none font-medium"
                            placeholder="What happened? Describe the incident in detail..."
                            rows="3"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <select
                                className="p-3 border rounded-xl bg-white font-bold"
                                value={formData.class}
                                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                            >
                                <option value="">Select Class</option>
                                {dbFilters.classes.map(c => (
                                    <option key={c} value={c}>{c}th Std</option>
                                ))}
                            </select>

                            <select
                                className="p-3 border rounded-xl bg-white font-bold"
                                value={formData.section}
                                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                            >
                                <option value="">Select Section</option>
                                {dbFilters.sections.map(s => (
                                    <option key={s} value={s}>Section {s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                    Select One Student:
                                </p>

                                <div className="relative w-full md:w-64">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search student name..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm outline-none"
                                        value={studentSearch}
                                        onChange={(e) => setStudentSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 max-h-40 overflow-y-auto p-1">
                                {filteredStudents.length > 0 ? (
                                    filteredStudents.map(s => (
                                        <button
                                            key={s._id}
                                            type="button"
                                            onClick={() => handleToggleStudent(s.name)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold transition-all ${
                                                selectedStudent === s.name
                                                    ? 'bg-primary text-white border-primary shadow-md'
                                                    : 'bg-white text-gray-600 hover:border-primary'
                                            }`}
                                        >
                                            {selectedStudent === s.name
                                                ? <CheckSquare size={16} />
                                                : <Square size={16} className="text-gray-300" />
                                            }
                                            {s.name}
                                        </button>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 italic">
                                        No students found. Select Class & Section first.
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div>
                                <select
                                    className="w-full p-3 border rounded-xl bg-white font-bold"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Incident Type</option>
                                    {categories.map(c => (
                                        <option key={c._id} value={c.name}>{c.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setNewField({ type: 'category', val: '' })}
                                    className="text-[10px] text-primary mt-1 font-black uppercase"
                                >
                                    + New Type
                                </button>
                            </div>

                            <div>
                                <select
                                    className="w-full p-3 border rounded-xl bg-white font-bold"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                >
                                    <option value="">Location</option>
                                    {locations.map(l => (
                                        <option key={l._id} value={l.name}>{l.name}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setNewField({ type: 'location', val: '' })}
                                    className="text-[10px] text-primary mt-1 font-black uppercase"
                                >
                                    + New Location
                                </button>
                            </div>

                            <select
                                className="p-3 border rounded-xl bg-white font-bold"
                                value={formData.severity}
                                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                            >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </div>

                        {newField.type && (
                            <div className="mb-6 flex gap-2 p-3 bg-blue-50 rounded-2xl border border-blue-100">
                                <input
                                    className="flex-1 p-2 border rounded-xl outline-none font-bold"
                                    placeholder={`Enter new ${newField.type} name...`}
                                    value={newField.val}
                                    onChange={(e) => setNewField({ ...newField, val: e.target.value })}
                                />
                                <button
                                    onClick={handleDynamicAdd}
                                    className="bg-primary text-white px-6 rounded-xl font-bold"
                                >
                                    Save & Select
                                </button>
                            </div>
                        )}

                        <div className="mb-8">
                            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-3xl bg-gray-50 cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <Camera className="text-gray-400" />
                                    <span className="text-sm font-bold text-gray-500">
                                        {image ? image.name : "Upload Evidence Photo"}
                                    </span>
                                </div>
                                <input
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => setImage(e.target.files[0])}
                                />
                            </label>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`w-full py-4 rounded-2xl font-black shadow-lg flex items-center justify-center gap-2 ${
                                loading
                                    ? 'bg-slate-400'
                                    : 'bg-primary text-white'
                            }`}
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            {loading ? 'Submitting...' : 'Submit Incident Report'}
                        </button>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CreateIncident;
