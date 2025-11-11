
import React, { useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { LoginPage, RoomsPage, ReservationsPage } from './pages/Pages';
import { Spinner } from './components/ui';

const ProtectedRoute: React.FC = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return token ? <Layout><Outlet /></Layout> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const { token, loading } = useContext(AuthContext);

  if (loading) {
     return (
      <div className="flex h-screen items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/rooms" /> : <LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/rooms" element={<RoomsPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Route>
      <Route path="*" element={<Navigate to={token ? "/rooms" : "/login"} />} />
    </Routes>
  );
};

export default App;
