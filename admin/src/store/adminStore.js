import { create } from 'zustand';

const getDataUrl = () => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clientBase = base.replace(/\/admin\/?$/, '') || '/';
  return `${window.location.origin}${clientBase}data/agents.json`;
};

export const useAdminStore = create((set, get) => ({
  raw: null,
  loading: false,
  error: null,
  saved: false,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const url = getDataUrl();
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const raw = await res.json();
      set({ raw, loading: false });
    } catch (e) {
      set({ error: e.message, loading: false });
    }
  },

  setRaw: (raw) => set({ raw }),

  getCategory: (category) => {
    const { raw } = get();
    if (!raw || !raw[category]) return [];
    return raw[category];
  },

  updateCategory: (category, list) => {
    const { raw } = get();
    if (!raw) return;
    set({ raw: { ...raw, [category]: list } });
  },

  addItem: (category, item) => {
    const list = [...(get().getCategory(category) || []), item];
    get().updateCategory(category, list);
  },

  updateItem: (category, index, item) => {
    const list = [...(get().getCategory(category) || [])];
    list[index] = item;
    get().updateCategory(category, list);
  },

  removeItem: (category, index) => {
    const list = get().getCategory(category).filter((_, i) => i !== index);
    get().updateCategory(category, list);
  },

  setResources: (resources) => set((s) => ({ raw: { ...s.raw, resources } })),
  setMaps: (maps) => set((s) => ({ raw: { ...s.raw, maps } })),

  setSaved: (saved) => set({ saved }),
}));
