import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { UploadCloud, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

const StudentUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const { user } = useAuth();

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
        setMessage({ type: '', text: '' }); // Clear previous messages
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        
        if (!file) {
            return setMessage({ type: 'error', text: 'Please select an Excel file (.xlsx or .xls) first!' });
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        setMessage({ type: '', text: '' });

        try {
            const config = {
                headers: { 
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}` 
                }
            };

            const response = await axios.post('https://st-incident-backend.onrender.com/api/students/upload', formData, config);
            
            setMessage({ 
                type: 'success', 
                text: response.data.message || 'Student database updated successfully!' 
            });
            setFile(null); // Clear file after success
            
        } catch (err) {
            // BACKEND ERROR MESSAGE AH KAATTUM (Duplicate No, Column Mismatch, etc.)
            const errorText = err.response?.data?.message || 'Upload failed. Check server connection or file format.';
            setMessage({ type: 'error', text: errorText });
            console.error("Upload Error:", err.response?.data);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="p-6 lg:p-12 flex justify-center items-start">
                    <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12 text-center mt-10">
                        
                        {/* Header Icon */}
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-100">
                            <FileSpreadsheet size={40} className="text-blue-600" />
                        </div>
                        
                        <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight uppercase">Bulk Student Upload</h2>
                        <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                            Upload an Excel file to update your student registry. <br/>
                            Required headers: <span className="font-bold text-blue-600">admissionNo, name, class, section</span>
                        </p>

                        <form onSubmit={handleUpload} className="space-y-6 text-left">
                            
                            {/* File Input Box */}
                            <div className="relative border-2 border-dashed border-slate-200 rounded-3xl p-10 hover:border-blue-400 transition-all bg-slate-50/50 group cursor-pointer">
                                <input 
                                    type="file" 
                                    accept=".xlsx, .xls"
                                    onChange={handleFileChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="text-center">
                                    <UploadCloud size={32} className="mx-auto text-slate-400 group-hover:text-blue-500 transition-colors mb-3" />
                                    <p className="text-sm font-bold text-slate-600">
                                        {file ? file.name : "Click to select or drag & drop file"}
                                    </p>
                                    <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">Excel files only (.xlsx, .xls)</p>
                                </div>
                            </div>

                            {/* Status Message */}
                            {message.text && (
                                <div className={`flex items-start gap-3 p-4 rounded-2xl text-sm font-bold animate-in fade-in slide-in-from-top-2 ${
                                    message.type === 'success' 
                                    ? 'bg-green-50 text-green-700 border border-green-100' 
                                    : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                    {message.type === 'success' ? <CheckCircle size={20} className="shrink-0"/> : <AlertCircle size={20} className="shrink-0"/>}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            {/* Submit Button */}
                            <button 
                                type="submit" 
                                disabled={uploading}
                                className={`w-full py-4 rounded-2xl font-black text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                                    uploading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'
                                }`}
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Processing Database...
                                    </>
                                ) : (
                                    'Upload & Sync Database'
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                Note: Existing students will be updated, new students will be added.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentUpload;