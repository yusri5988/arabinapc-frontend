import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { Wallet, ArrowUpRight, Send, UserPlus, History, KeyRound, Loader2 } from 'lucide-react';
import CreateSupervisorModal from '../../components/CreateSupervisorModal';
import SupervisorTopupModal from '../../components/SupervisorTopupModal';
import { Link } from 'react-router-dom';

export default function AdminSupervisors() {
    const [selectedSupervisor, setSelectedSupervisor] = useState(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [resettingSupervisorId, setResettingSupervisorId] = useState(null);
    const [resetFeedback, setResetFeedback] = useState(null);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['adminSupervisors'],
        queryFn: async () => {
            const res = await api.get('/admin/supervisors');
            return res.data;
        }
    });

    const handleResetStaffPassword = async (supervisor) => {
        const confirmed = window.confirm(`Reset password ${supervisor.name} kepada 123456?`);
        if (!confirmed) return;

        setResettingSupervisorId(supervisor.id);
        setResetFeedback(null);

        try {
            const res = await api.post(`/admin/supervisors/${supervisor.id}/reset-password`);
            setResetFeedback({
                type: 'success',
                message: `${res.data.supervisor?.name || supervisor.name} password reset kepada 123456.`
            });
        } catch (err) {
            setResetFeedback({
                type: 'error',
                message: err.response?.data?.message || `Unable to reset password for ${supervisor.name}.`
            });
        } finally {
            setResettingSupervisorId(null);
        }
    };

    if (isLoading) return <div className="flex items-center justify-center h-40 text-emerald-600 animate-pulse font-bold">Loading staff data...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <CreateSupervisorModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSuccess={refetch}
            />
            <SupervisorTopupModal
                isOpen={selectedSupervisor !== null}
                supervisor={selectedSupervisor}
                onClose={() => setSelectedSupervisor(null)}
                onSuccess={refetch}
            />

            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff</h2>
                    <p className="text-slate-500 text-sm font-medium mt-0.5">Manage supervisor accounts</p>
                </div>
            </div>

            <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="w-full relative group overflow-hidden flex items-center justify-center gap-2 px-5 py-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-2xl transition-all text-[15px] font-bold shadow-lg shadow-emerald-600/20"
            >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                <UserPlus size={18} strokeWidth={2.5} />
                <span className="tracking-wide">Add Supervisor</span>
            </button>

            {resetFeedback && (
                <div className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                    resetFeedback.type === 'success'
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                        : 'border-red-200 bg-red-50 text-red-600'
                }`}>
                    {resetFeedback.message}
                </div>
            )}

            {/* Mobile Card List */}
            <div className="md:hidden space-y-3">
                {data?.supervisors?.map((sv) => (
                    <div key={sv.id} className="bg-white border border-slate-200/60 p-5 rounded-[1.5rem] space-y-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold shadow-sm text-lg shrink-0">
                                {sv.name[0]}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-slate-900 font-bold text-[16px] truncate leading-tight">{sv.name}</p>
                                <p className="text-slate-400 text-[12px] font-medium truncate mt-0.5">{sv.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-4 border-t border-slate-100/80">
                            <div className="inline-flex items-center gap-2 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/50">
                                <Wallet size={14} className="text-emerald-600" strokeWidth={2.5} />
                                <span className="text-emerald-700 font-black tracking-tight">RM {sv.balance}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                <Link
                                    to={`/admin/supervisors/${sv.id}/transactions`}
                                    className="min-w-0 flex items-center justify-center gap-1.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 text-[12px] font-bold px-2 py-2.5 rounded-xl border border-slate-200/60 active:scale-95 transition-all"
                                >
                                    <History size={14} strokeWidth={2.5} />
                                    History
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => setSelectedSupervisor(sv)}
                                    className="min-w-0 flex items-center justify-center gap-1.5 text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 text-[12px] font-bold px-2 py-2.5 rounded-xl border border-slate-200/60 active:scale-95 transition-all"
                                >
                                    <Send size={14} strokeWidth={2.5} />
                                    Send
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleResetStaffPassword(sv)}
                                    disabled={resettingSupervisorId === sv.id}
                                    className="min-w-0 flex items-center justify-center gap-1.5 text-amber-700 hover:bg-amber-50 text-[12px] font-bold px-2 py-2.5 rounded-xl border border-amber-200/70 active:scale-95 transition-all disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {resettingSupervisorId === sv.id ? <Loader2 size={14} className="animate-spin" /> : <KeyRound size={14} strokeWidth={2.5} />}
                                    Reset
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white border border-slate-200/60 rounded-[2rem] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-5">Supervisor</th>
                                <th className="px-6 py-5">Email</th>
                                <th className="px-6 py-5 text-right">Balance (RM)</th>
                                <th className="px-6 py-5 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100/80">
                            {data?.supervisors?.map((sv) => (
                                <tr key={sv.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                                                {sv.name[0]}
                                            </div>
                                            <span className="text-slate-900 font-bold">{sv.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-medium">{sv.email}</td>
                                    <td className="px-6 py-4 text-right text-[15px] font-black text-slate-900">{sv.balance}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="inline-flex items-center gap-2">
                                            <Link
                                                to={`/admin/supervisors/${sv.id}/transactions`}
                                                className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700 bg-slate-50 px-4 py-2 rounded-xl font-bold transition-colors border border-slate-200/60"
                                            >
                                                <History size={16} strokeWidth={2.5} />
                                                History
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedSupervisor(sv)}
                                                className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-4 py-2 rounded-xl font-bold transition-colors"
                                            >
                                                Send <ArrowUpRight size={16} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleResetStaffPassword(sv)}
                                                disabled={resettingSupervisorId === sv.id}
                                                className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-800 bg-amber-50 px-4 py-2 rounded-xl font-bold transition-colors border border-amber-100 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {resettingSupervisorId === sv.id ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} strokeWidth={2.5} />}
                                                Reset
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
