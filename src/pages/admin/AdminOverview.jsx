import { useQuery } from '@tanstack/react-query';
import api from '../../lib/axios';
import { Wallet, ArrowUpRight, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

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
                <p className="text-slate-500 text-sm font-medium mt-0.5">Global cash movement and staff</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {/* Main Cash Balance Card */}
                <Link to="/admin/topup" className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 p-6 md:p-8 rounded-[2rem] shadow-2xl shadow-emerald-600/20 group active:scale-[0.98] transition-transform block text-white">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 blur-3xl rounded-full group-hover:scale-110 transition-transform duration-700"></div>
                    <div className="relative z-10 flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm">
                                <Wallet className="text-white drop-shadow-sm" size={24} />
                            </div>
                            <p className="text-emerald-50 font-bold uppercase tracking-widest text-[11px] drop-shadow-sm">Main Balance</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:bg-white/20 transition-colors">
                            <ArrowUpRight size={16} />
                        </div>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[40px] md:text-5xl font-black tracking-tight drop-shadow-lg leading-none">
                            <span className="text-xl font-bold align-top mr-1.5 opacity-90">RM</span>{data?.total_admin_cash}
                        </p>
                    </div>
                </Link>

                <div className="grid grid-cols-2 gap-4">
                    {/* Total Distributed Card */}
                    <div className="bg-white border border-slate-200/60 p-5 rounded-[2rem] shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full blur-2xl group-hover:bg-rose-100 transition-colors duration-500 -z-0"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-100 to-rose-50 border border-rose-100 flex items-center justify-center mb-4">
                                <TrendingUp className="text-rose-600" size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Distributed</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">
                                    <span className="text-xs font-bold text-slate-500 mr-1">RM</span>{data?.total_supervisor_cash}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Total Supervisors Card */}
                    <Link to="/admin/supervisors" className="bg-white border border-slate-200/60 p-5 rounded-[2rem] shadow-sm relative overflow-hidden group hover:border-amber-200 hover:shadow-lg hover:shadow-amber-500/5 transition-all active:scale-[0.98]">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full blur-2xl group-hover:bg-amber-100 transition-colors duration-500 -z-0"></div>
                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Users className="text-amber-600" size={18} strokeWidth={2.5} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Supervisors</p>
                                <p className="text-2xl font-black text-slate-900 leading-none">
                                    {data?.supervisors?.length}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
