import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardStore {
  activeCategory: string;
  savedCategories: string[];
  isMinimized: boolean; 
  setActiveCategory: (category: string) => void;
  addSavedCategory: (category: string) => void;
  removeSavedCategory: (category: string) => void;
  toggleMinimize: () => void; 
}

const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      activeCategory: 'company',
      savedCategories: [],
      isMinimized: false, 
      setActiveCategory: (category) => set({ activeCategory: category }),
      addSavedCategory: (category) =>
        set((state) => ({
          savedCategories: state.savedCategories.includes(category)
            ? state.savedCategories
            : [...state.savedCategories, category],
        })),
      removeSavedCategory: (category) =>
        set((state) => ({
          savedCategories: state.savedCategories.filter((c) => c !== category),
        })),
      toggleMinimize: () => set((state) => ({ 
        isMinimized: !state.isMinimized 
      })), 
    }),
    {
      name: 'dashboard-storage',
    }
  )
);

export default useDashboardStore;