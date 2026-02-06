import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './components/Auth';
import { Home, BaitaList, BaitaDetail, Attivita, Calendario, Info, Profilo } from './pages';

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename="/40">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="baite" element={<BaitaList />} />
            <Route path="baite/:id" element={<BaitaDetail />} />
            <Route path="attivita" element={<Attivita />} />
            <Route path="calendario" element={<Calendario />} />
            <Route path="info" element={<Info />} />
            <Route path="profilo" element={<Profilo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
