import { useEffect, useState } from 'react';
import { X, Camera, Loader2 } from 'lucide-react';
import api from '../lib/axios';

export default function ExpenseModal({ isOpen, onClose, onRefresh }) {
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [ocrError, setOcrError] = useState('');
    const [form, setForm] = useState({
        amount: '',
        description: '',
        site_id: '',
        date: new Date().toISOString().split('T')[0],
        receipt_url: ''
    });

    useEffect(() => {
        if (!isOpen) {
            setLoading(false);
            setProcessing(false);
            setOcrError('');
            setForm({
                amount: '',
                description: '',
                site_id: '',
                date: new Date().toISOString().split('T')[0],
                receipt_url: ''
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setProcessing(true);
        setOcrError('');
        const formData = new FormData();
        formData.append('receipt', file);

        try {
            const res = await api.post('/supervisor/process-receipt', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setForm((currentForm) => ({
                ...currentForm,
                amount: res.data.amount,
                description: res.data.description,
                date: res.data.date,
                receipt_url: res.data.receipt_url || ''
            }));

            if (res.data.error) {
                setOcrError(res.data.error);
            }
        } catch (err) {
            const message = err.response?.data?.message || err.response?.data?.error || err.message || 'Unknown error';
            setOcrError(`Upload gagal: ${message}`);
            console.error('AI Processing Error:', err);
        } finally {
            setProcessing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/supervisor/expense', form);
            onRefresh();
            onClose();
        } catch (err) {
            alert(err.response?.data?.message || 'Error saving data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white border border-slate-200 w-full md:max-w-lg md:mx-4 rounded-t-3xl md:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] md:max-h-none flex flex-col">
                <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
                    <h3 className="text-lg md:text-xl font-bold text-slate-900">Record Expense</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={22} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5 md:p-6 space-y-5 overflow-y-auto">
                    {/* AI Upload Section */}
                    <div className="relative group">
                        <input 
                            type="file" 
                            accept="image/*" 
                            capture="environment"
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className={`p-6 md:p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 transition-all ${
                            processing ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-200 group-hover:border-emerald-300 group-hover:bg-emerald-50/50'
                        }`}>
                            {processing ? (
                                <>
                                    <Loader2 className="text-emerald-600 h-10 w-10 animate-spin" />
                                    <p className="text-emerald-600 font-bold text-sm">Gemini AI is reading the receipt...</p>
                                </>
                            ) : (
                                <>
                                    <div className="p-4 bg-emerald-50 rounded-full text-emerald-600">
                                        <Camera size={32} />
                                    </div>
                                    <p className="text-slate-600 font-medium text-center text-sm md:text-base">
                                        Click to capture a receipt image<br />
                                        <span className="text-xs text-slate-400">AI will auto-fill the form</span>
                                    </p>
                                </>
                            )}
                        </div>
                    </div>

                    {ocrError && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
                            <p className="font-bold mb-1">Ralat Pembacaan Resit:</p>
                            <p>{ocrError}</p>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Usage / Description</label>
                            <input 
                                required
                                value={form.description}
                                onChange={e => setForm({...form, description: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="e.g. Site meals, Hardware supplies"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Date</label>
                                <input
                                    required
                                    type="date"
                                    value={form.date}
                                    onChange={e => setForm({...form, date: e.target.value})}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Amount (RM)</label>
                                <input 
                                    required
                                    type="number"
                                    step="0.01"
                                    inputMode="decimal"
                                    value={form.amount}
                                    onChange={e => setForm({...form, amount: e.target.value})}
                                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Site ID</label>
                            <input 
                                required
                                value={form.site_id}
                                onChange={e => setForm({...form, site_id: e.target.value})}
                                className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3.5 text-base text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                                placeholder="A102"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading || processing}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 text-base"
                    >
                        {loading ? 'Saving...' : 'CONFIRM EXPENSE'}
                    </button>
                </form>
            </div>
        </div>
    );
}
