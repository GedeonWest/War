import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Agents from './pages/Agents';
import Dossiers from './pages/Dossiers';
import Deceased from './pages/Deceased';
import Resources from './pages/Resources';
import Maps from './pages/Maps';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/dossiers" element={<Dossiers />} />
        <Route path="/deceased" element={<Deceased />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/maps" element={<Maps />} />
      </Routes>
    </Layout>
  );
}

export default App;
