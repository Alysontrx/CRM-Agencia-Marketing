import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import MainLayout from './pages/MainLayout';
import ResetPassword from './pages/ResetPassword';
import PlanejadorPage from './pages/Planejador';
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
    <GoogleOAuthProvider clientId="767960843931-b3akclvcgpg2i461pno3dgipals62n71.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/planejador" element={<PlanejadorPage />} />
          <Route path="/*" element={
            <AppProvider>
              <AgencyRouter />
            </AppProvider>
          } />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
