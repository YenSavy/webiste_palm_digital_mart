import { create } from "zustand"

type DashboardStoreType = {
    activeCategory: "company" | "branch" | "warehouse" | "position" | "currency"
    setActiveCategory: (cat: "company" | "branch" | "warehouse" | "position" | "currency") => void

    isMinimized: boolean
    toggleMinimize: () => void;
}

const useDashboardStore = create<DashboardStoreType>((set) => ({
    activeCategory: "company",
    setActiveCategory: (cat: "company" | "branch" | "warehouse" | "position" | "currency") => set({activeCategory: cat}),


    isMinimized: false,
    toggleMinimize: () => set((state) => ({isMinimized: !state.isMinimized}))
}))


export default useDashboardStore;