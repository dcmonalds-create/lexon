import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useTelegramUser } from './hooks/useTelegramUser';
import Layout from './components/Layout';
import Home from './pages/Home';
import History from './pages/History';
import Profile from './pages/Profile';
import ToolPage from './pages/tools/ToolPage';

const MANIFEST_URL = import.meta.env.VITE_TONCONNECT_MANIFEST_URL || `${window.location.origin}/tonconnect-manifest.json`;

function TelegramInit() {
  useTelegramUser();
  return null;
}

export default function App() {
  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <BrowserRouter>
        <TelegramInit />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="history" element={<History />} />
            <Route path="profile" element={<Profile />} />
            <Route path="tool/:toolId" element={<ToolPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </TonConnectUIProvider>
  );
}
