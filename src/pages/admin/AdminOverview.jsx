import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { Wallet, ArrowDownLeft, ArrowUpRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const money = (value) =>
    Number(value ?? 0).toLocaleString('ms-MY', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

export default function AdminOverview() {
    const { data, isLoading } = useQuery({
        queryKey: ['adminDashboard'],
        queryFn: async () => {
            const res = await api.get('/admin/dashboard');
            return res.data;
        }
    });

    if (isLoading) return <div className="flex items-center justify-center h-40 text-emerald-600 animate-pulse font-bold">Loading dashboard...</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Admin Overview</h2>
                <p className="text-slate-500 text-sm font-medium mt-0.5">Supervisor cash movement and staff</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Supervisor Cash Balance Card */}
                <Link to="/admin/send-to-supervisor" className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-emerald-600/20 group active:scale-[0.98] transition-transform block text-white">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm">
                                <Wallet className="text-white drop-shadow-sm" size={24} />
                            </div>
                            <p className="text-emerald-50 font-bold uppercase tracking-widest text-[11px] drop-shadow-sm">Supervisor Cash</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[40px] md:text-5xl font-black tracking-tight drop-shadow-lg leading-none">
                            <span className="text-xl font-bold align-top mr-1.5 opacity-90">RM</span>{money(data?.total_supervisor_cash)}
                        </p>
                        <p className="mt-3 text-sm font-bold text-emerald-50">Send cash directly to supervisors</p>
                    </div>
                </Link>

                <div className="grid grid-cols-1 gap-4">
                </div>
            </div>
        </div>
    );
}
