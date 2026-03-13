import { create } from 'zustand';

const DATA_URL = `${import.meta.env.BASE_URL}data/agents.json`;

export const useDataStore = create((set, get) => ({
  raw: null,
  loading: false,
  error: null,

  fetchData: async () => {
    if (get().raw) return;
    set({ loading: true, error: null });
    try {
      const res = await fetch(DATA_URL);
      if (!res.ok) throw new Error(res.statusText);
      const raw = await res.json();
      set({ raw, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  getByCategory: (category) => {
    const { raw } = get();
    if (!raw || !raw[category]) return [];
    return raw[category];
  },

  getAllCategories: () => {
    const { raw } = get();
    if (!raw) return [];
    return Object.keys(raw);
  },

  getDossiers: () => {
    const { raw } = get();
    if (!raw) return [];
    const categories = ['active', 'agent', 'crown', 'secrown', 'target', 'legacy', 'inactive', 'prison'];
    return categories.flatMap((cat) => (raw[cat] || []).map((item) => ({ ...item, category: cat })));
  },

  getDeceased: () => {
    const dead = get().getByCategory('dead') || [];
    const dpc = get().getByCategory('dpc') || [];
    return [...dead, ...dpc].filter((e) => e.death && e.death.trim() && e.death.toLowerCase() !== 'alive');
  },
}));
