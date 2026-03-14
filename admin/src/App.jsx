import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NpcsEdit from './pages/NpcsEdit';
import ArtifactsEdit from './pages/ArtifactsEdit';
import MaterialsEdit from './pages/MaterialsEdit';
import MapsSimpleEdit from './pages/MapsSimpleEdit';
import ChroniclesEdit from './pages/ChroniclesEdit';
import PlayersEdit from './pages/PlayersEdit';
import './styles/app.scss';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/npcs" element={<NpcsEdit />} />
        <Route path="/artifacts" element={<ArtifactsEdit />} />
        <Route path="/materials" element={<MaterialsEdit />} />
        <Route path="/maps" element={<MapsSimpleEdit />} />
        <Route path="/chronicles" element={<ChroniclesEdit />} />
        <Route path="/players" element={<PlayersEdit />} />
      </Routes>
    </Layout>
  );
}
