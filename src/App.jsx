import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './components/Auth';
import { Home, BaitaList, BaitaDetail, Calendario, Info, Profilo, Auto } from './pages';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/40">
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="baite" element={<BaitaList />} />
            <Route path="baite/:id" element={<BaitaDetail />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="auto" element={<Auto />} />
            <Route path="info" element={<Info />} />
            <Route path="profilo" element={<Profilo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
