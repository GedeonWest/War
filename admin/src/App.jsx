import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AgentList from './pages/AgentList';
import AgentEdit from './pages/AgentEdit';
import ResourcesEdit from './pages/ResourcesEdit';
import MapsEdit from './pages/MapsEdit';
import './styles/app.scss';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agents/:category" element={<AgentList />} />
        <Route path="/agents/:category/new" element={<AgentEdit />} />
        <Route path="/agents/:category/:index" element={<AgentEdit />} />
        <Route path="/resources" element={<ResourcesEdit />} />
        <Route path="/maps" element={<MapsEdit />} />
      </Routes>
    </Layout>
  );
}
