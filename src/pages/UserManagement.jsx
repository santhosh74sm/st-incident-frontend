import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { Trash2, Mail, Users, Search, Filter, UserPlus, X, Check, Loader2 } from 'lucide-react';

const UserManagement = () => {
    const { user } = useAuth();

    const [view, setView] = useState('Staff');
    const [usersList, setUsersList] = useState([]);
    const [studentRegistry, setStudentRegistry] = useState([]);
    const [classFilter, setClassFilter] = useState('');
    const [sectionFilter, setSectionFilter] = useState('');
    const [loading, setLoading] = useState(true);

    // Add Student Form State
    const [showAddForm, setShowAddForm] = useState(false);
    const [newStudent, setNewStudent] = useState({
        name: '', admissionNo: '', className: '', section: ''
    });

    // ✅ Define Standard Classes (6th to 12th)
    const standardClasses = [
        { label: '6th Std', value: '6' },
        { label: '7th Std', value: '7' },
        { label: '8th Std', value: '8' },
        { label: '9th Std', value: '9' },
        { label: '10th Std', value: '10' },
        { label: '11th Std', value: '11' },
        { label: '12th Std', value: '12' }
    ];

    // ================= DATA FETCH LOGIC =================
    const fetchData = async () => {
        setLoading(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            if (view === 'Staff') {
                const res = await axios.get('http://https://st-incident-backend.onrender.com/api/auth/users', config);
                setUsersList(res.data.sort((a, b) => a.name.localeCompare(b.name)));
            } else {
                let url = 'http://https://st-incident-backend.onrender.com/api/students/all';
                if (classFilter || sectionFilter) {
                    url = `http://https://st-incident-backend.onrender.com/api/students/filter?className=${classFilter}&section=${sectionFilter}`;
                }
                const res = await axios.get(url, config);
                setStudentRegistry(res.data.sort((a, b) => a.name.localeCompare(b.name)));
            }
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    useEffect(() => { 
        fetchData(); 
    }, [view, classFilter, sectionFilter, user.token]);

    // ================= ADD STUDENT HANDLER =================
    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post('http://https://st-incident-backend.onrender.com/api/students', newStudent, config);
            alert("Student Record Created Successfully!");
            setShowAddForm(false);
            setNewStudent({ name: '', admissionNo: '', className: '', section: '' });
            fetchData();
        } catch (err) {
            alert(err.response?.data?.message || "Error adding student");
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Delete this ${type}?`)) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const url = type === 'Staff' ? `http://https://st-incident-backend.onrender.com/api/auth/users/${id}` : `http://https://st-incident-backend.onrender.com/api/students/${id}`;
            await axios.delete(url, config);
            fetchData();
        } catch (err) { alert("Error deleting user."); }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6">

                    <div className="flex justify-between items-center mb-8">
                        <div className="flex gap-4 bg-white p-2 rounded-2xl w-fit shadow-sm border border-slate-100 font-bold">
                            <button onClick={() => setView('Staff')} className={`px-6 py-2 rounded-xl transition ${view === 'Staff' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}>Staff Directory</button>
                            <button onClick={() => setView('Students')} className={`px-6 py-2 rounded-xl transition ${view === 'Students' ? 'bg-primary text-white shadow-lg' : 'text-gray-400'}`}>Student Registry</button>
                        </div>

                        {view === 'Students' && (
                            <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg transition-all">
                                <UserPlus size={18}/> Add Student
                            </button>
                        )}
                    </div>

                    {/* ================= ADD STUDENT FORM (6th - 12th) ================= */}
                    {showAddForm && (
                        <div className="mb-8 bg-white p-8 rounded-3xl border-2 border-emerald-100 shadow-xl animate-in slide-in-from-top-4">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-black text-emerald-700 uppercase text-sm tracking-widest flex items-center gap-2">
                                    <UserPlus size={20}/> New Student Entry
                                </h3>
                                <button onClick={() => setShowAddForm(false)} className="text-slate-400 hover:text-rose-500"><X size={20}/></button>
                            </div>
                            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <input required type="text" placeholder="Admission No" className="p-3 border rounded-xl bg-slate-50 text-xs font-bold" value={newStudent.admissionNo} onChange={(e) => setNewStudent({...newStudent, admissionNo: e.target.value})} />
                                <input required type="text" placeholder="Student Name" className="p-3 border rounded-xl bg-slate-50 text-xs font-bold uppercase" value={newStudent.name} onChange={(e) => setNewStudent({...newStudent, name: e.target.value})} />
                                
                                {/* ✅ FIXED 6th to 12th DROPDOWN */}
                                <select required className="p-3 border rounded-xl bg-slate-50 text-xs font-bold" value={newStudent.className} onChange={(e) => setNewStudent({...newStudent, className: e.target.value})}>
                                    <option value="">Select Class</option>
                                    {standardClasses.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                </select>

                                <div className="flex gap-2">
                                    <input required type="text" placeholder="Section (eg: A)" className="flex-1 p-3 border rounded-xl bg-slate-50 text-xs font-bold uppercase" value={newStudent.section} onChange={(e) => setNewStudent({...newStudent, section: e.target.value})} />
                                    <button type="submit" className="bg-emerald-600 text-white p-3 rounded-xl hover:bg-emerald-700 transition shadow-lg">
                                        <Check size={20}/>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* ================= STUDENT VIEW ================= */}
                    {view === 'Students' && (
                        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                                <div>
                                    <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2"><Users className="text-primary" size={20}/> Student Database</h3>
                                    <p className="text-xs text-slate-400 font-medium">Total: <span className="text-primary font-black">{studentRegistry.length}</span> students</p>
                                </div>

                                <div className="flex items-center gap-3 w-full md:w-auto">
                                    <div className="relative md:w-40">
                                        <Filter className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                        <select className="w-full pl-9 pr-4 py-2 border rounded-xl bg-slate-50 text-xs font-bold outline-none appearance-none" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                                            <option value="">Filter Class</option>
                                            {standardClasses.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                                        </select>
                                    </div>
                                    <div className="relative md:w-32">
                                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                                        <input type="text" placeholder="Section..." className="w-full pl-9 pr-4 py-2 border rounded-xl bg-slate-50 text-xs font-bold outline-none uppercase" value={sectionFilter} onChange={(e) => setSectionFilter(e.target.value)} />
                                    </div>
                                </div>
                            </div>

                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
                                    <tr><th className="p-4">Student Name</th><th className="p-4">Admission No</th><th className="p-4">Class-Sec</th><th className="p-4 text-right">Action</th></tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr><td colSpan="4" className="p-10 text-center font-bold text-slate-400">Loading registry...</td></tr>
                                    ) : studentRegistry.map(s => (
                                        <tr key={s._id} className="border-t hover:bg-slate-50 transition">
                                            <td className="p-4 font-black text-slate-700 text-xs uppercase italic">{s.name}</td>
                                            <td className="p-4 text-xs font-bold text-slate-400 tracking-tighter italic">{s.admissionNo}</td>
                                            <td className="p-4"><span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">{s.className}th Std - {s.section}</span></td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => handleDelete(s._id, 'Student')} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition"><Trash2 size={16}/></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-6 pt-6 border-t text-right">
                                <p className="text-sm font-black text-slate-700 uppercase tracking-tighter">
                                    Count: <span className="text-primary text-xl font-black">{studentRegistry.length}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ================= STAFF VIEW ================= */}
                    {view === 'Staff' && (
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <tr><th className="p-6">Staff Member</th><th className="p-6">Role</th><th className="p-6 text-right">Action</th></tr>
                                </thead>
                                <tbody>
                                    {usersList.map(u => (
                                        <tr key={u._id} className="border-t hover:bg-slate-50 transition">
                                            <td className="p-6">
                                                <div className="font-black text-slate-700 uppercase italic">{u.name}</div>
                                                <div className="text-xs text-slate-400 font-medium flex items-center gap-1 italic"><Mail size={12}/> {u.email}</div>
                                            </td>
                                            <td className="p-6"><span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{u.role}</span></td>
                                            <td className="p-6 text-right">
                                                {u.email !== user.email && <button onClick={() => handleDelete(u._id, 'Staff')} className="text-rose-500 p-2 hover:bg-rose-50 rounded-xl transition"><Trash2 size={18}/></button>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="p-6 bg-slate-50 text-right font-black uppercase text-sm tracking-tighter border-t">Total Staff: {usersList.length}</div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default UserManagement;