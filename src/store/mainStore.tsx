import { create } from "zustand"

type TTypeStore = {
    isLoadingWebsite: boolean
    setIsLoadingStore: (isLoading: boolean) => void
}



const useMainStore = create<TTypeStore>((set) => ({
    isLoadingWebsite: false,
    setIsLoadingStore: (isLoading: boolean) => set(() => ({isLoadingWebsite: isLoading}))
}))
export default useMainStore

