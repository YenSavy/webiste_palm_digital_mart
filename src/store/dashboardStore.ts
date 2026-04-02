import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface DashboardStore {
  activeCategory: string;
  savedCategories: string[];
  isMinimized: boolean;
  subscriptionCompleted: boolean;
  setActiveCategory: (category: string) => void;
  addSavedCategory: (category: string) => void;
  removeSavedCategory: (category: string) => void;
  toggleMinimize: () => void;
  setSubscriptionCompleted: (completed: boolean) => void;
  reset: () => void;
}

const useDashboardStore = create<DashboardStore>()(
  persist(
    (set) => ({
      activeCategory: 'company',
      savedCategories: [],
      isMinimized: false, 
      subscriptionCompleted: false,
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
      setSubscriptionCompleted: (completed) => set({ subscriptionCompleted: completed }),
      reset: () =>
        set({ activeCategory: 'company', savedCategories: [], subscriptionCompleted: false }),
    }),
    {
      name: 'dashboard-storage',
    }
  )
);

export default useDashboardStore;
