import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './pages/MainLayout';
import ResetPassword from './pages/ResetPassword';
import { Loader2 } from 'lucide-react';

function AgencyRouter() {
  const { currentUser, loadingData } = useApp();

  if (loadingData) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-400">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-4" />
        <p className="font-medium animate-pulse">Sincronizando CRM...</p>
      </div>
    );
  }

  return currentUser ? <MainLayout /> : <LoginPage />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/*" element={
          <AppProvider>
            <AgencyRouter />
          </AppProvider>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
