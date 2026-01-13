
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './supabase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import NewOrder from './pages/NewOrder';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';

const ProtectedRoute: React.FC<{ children: React.ReactNode; session: any }> = ({ children, session }) => {
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="text-primary font-medium animate-pulse transition-all">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen bg-background-dark text-white selection:bg-primary selection:text-black font-display">
        <Routes>
          <Route path="/login" element={session ? <Navigate to="/" replace /> : <Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute session={session}>
                <div className="flex flex-col h-screen overflow-hidden">
                  <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/order/:id" element={<OrderDetails />} />
                      <Route path="/new-order" element={<NewOrder />} />
                      <Route path="/reports" element={<Reports />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </div>
                  <Navbar />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
