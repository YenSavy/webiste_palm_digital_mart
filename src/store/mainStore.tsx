import { create } from "zustand"

type TTypeStore = {
    isLoadingWebsite: boolean
    setIsLoadingStore: (isLoading: boolean) => void

    search: string,
    setSearch: (s: string) => void;

}



const useMainStore = create<TTypeStore>((set) => ({
    isLoadingWebsite: false,
    setIsLoadingStore: (isLoading: boolean) => set(() => ({isLoadingWebsite: isLoading})),
    
    search: "",
    setSearch: (s: string) => (set({search: s}))
}))
export default useMainStore

