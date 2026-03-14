import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Agents from './pages/Agents';
import Dossiers from './pages/Dossiers';
import Deceased from './pages/Deceased';
import Resources from './pages/Resources';
import Maps from './pages/Maps';
import Chronicles from './pages/Chronicles';
import Players from './pages/Players';
import Initiative from './pages/Initiative';

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
        <Route path="/chronicles" element={<Chronicles />} />
        <Route path="/players" element={<Players />} />
        <Route path="/initiative" element={<Initiative />} />
      </Routes>
    </Layout>
  );
}

export default App;
