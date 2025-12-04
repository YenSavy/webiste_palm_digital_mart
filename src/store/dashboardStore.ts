import { create } from "zustand"

type DashboardStoreType = {
    activeCategory: "company" | "branch" | "warehouse" | "position" | "currency"
    setActiveCategory: (cat: "company" | "branch" | "warehouse" | "position" | "currency") => void
}

const useDashboardStore = create<DashboardStoreType>((set) => ({
    activeCategory: "company",
    setActiveCategory: (cat: "company" | "branch" | "warehouse" | "position" | "currency") => set({activeCategory: cat})
}))


export default useDashboardStore;