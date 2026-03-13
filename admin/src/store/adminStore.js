import { create } from 'zustand';

const DEFAULT_DATA = {
  npcs: [],
  artifacts: [],
  materials: [],
  maps: [],
  resources: [],
};

const getDataUrl = () => {
  const base = import.meta.env.BASE_URL || '/';
  let clientBase = base.replace(/admin\/?$/, '');

  if (!clientBase.startsWith('/')) {
    clientBase = `/${clientBase}`;
  }
  if (!clientBase.endsWith('/')) {
    clientBase = `${clientBase}/`;
  }

  return new URL(`${clientBase}data/agents.json`, window.location.origin).toString();
};

export const useAdminStore = create((set, get) => ({
  raw: { ...DEFAULT_DATA },
  loading: false,
  error: null,
  saved: false,
  fetched: false,

  fetchData: async (force = false) => {
    const { loading, fetched } = get();
    if (loading) return;
    if (fetched && !force) return;

    set({ loading: true, error: null });
    try {
      const url = getDataUrl();
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      const raw = await res.json();
      set({
        raw: {
          ...DEFAULT_DATA,
          ...raw,
          npcs: Array.isArray(raw.npcs) ? raw.npcs : [],
          artifacts: Array.isArray(raw.artifacts) ? raw.artifacts : [],
          materials: Array.isArray(raw.materials) ? raw.materials : (Array.isArray(raw.resources) ? raw.resources : []),
          maps: Array.isArray(raw.maps) ? raw.maps : [],
          resources: Array.isArray(raw.resources) ? raw.resources : (Array.isArray(raw.materials) ? raw.materials : []),
        },
        fetched: true,
      });
    } catch (e) {
      set({ raw: { ...DEFAULT_DATA }, error: e.message, fetched: true });
    } finally {
      set({ loading: false });
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

  setResources: (resources) => set((s) => ({ raw: { ...s.raw, resources, materials: resources } })),
  setMaterials: (materials) => set((s) => ({ raw: { ...s.raw, materials, resources: materials } })),
  setMaps: (maps) => set((s) => ({ raw: { ...s.raw, maps } })),

  setSaved: (saved) => set({ saved }),
}));
