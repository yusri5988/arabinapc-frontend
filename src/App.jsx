import { HashRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from './pages/Login';
import Layout from './components/Layout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminSupervisors from './pages/admin/AdminSupervisors';
import AdminTopup from './pages/admin/AdminTopup';
import AdminTransactions from './pages/admin/AdminTransactions';
import AdminSupervisorTransactions from './pages/admin/AdminSupervisorTransactions';
import SupervisorOverview from './pages/supervisor/SupervisorOverview';
import SupervisorLedger from './pages/supervisor/SupervisorLedger';
import Profile from './pages/Profile';
import { useEffect, useState } from 'react';

const queryClient = new QueryClient();

function RoleRedirect({ user }) {
    if (!user) return <Navigate to="/login" replace />;
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
    if (user.role === 'supervisor') return <Navigate to="/supervisor/dashboard" replace />;
    return <Navigate to="/login" replace />;
}

function AdminGuard({ user }) {
    if (user?.role !== 'admin') return <Navigate to="/" replace />;
    return <Outlet />;
}

function SupervisorGuard({ user }) {
    if (user?.role !== 'supervisor') return <Navigate to="/" replace />;
    return <Outlet />;
}

function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    if (loading) return null;

    return (
        <QueryClientProvider client={queryClient}>
            <Toaster 
                position="top-center" 
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#fff',
                        color: '#0f172a',
                        fontWeight: 'bold',
                        borderRadius: '1rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                    },
                }}
            />
            <Router>
                <Routes>
                    <Route path="/login" element={!user ? <Login setUser={setUser} /> : <RoleRedirect user={user} />} />
                    
                    <Route element={<Layout user={user} setUser={setUser} />}>
                        <Route path="/" element={<RoleRedirect user={user} />} />
                        
                        <Route path="admin" element={<AdminGuard user={user} />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<AdminOverview />} />
                            <Route path="supervisors" element={<AdminSupervisors />} />
                            <Route path="supervisors/:supervisorId/transactions" element={<AdminSupervisorTransactions />} />
                            <Route path="send-to-supervisor" element={<AdminTopup />} />
                            <Route path="topup" element={<Navigate to="send-to-supervisor" replace />} />
                            <Route path="transactions" element={<AdminTransactions />} />
                        </Route>
                        
                        <Route path="supervisor" element={<SupervisorGuard user={user} />}>
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<SupervisorOverview />} />
                            <Route path="ledger" element={<SupervisorLedger />} />
                        </Route>

                        <Route path="profile" element={<Profile user={user} setUser={setUser} />} />
                    </Route>
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
