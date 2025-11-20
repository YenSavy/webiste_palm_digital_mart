import useCurrentLang from "./useCurrentLang"

const useArrayTranslated = (arr: string[], arr_kh: string[], arr_ch: string[]): string[] => {
       const l = useCurrentLang()
    return l === "en" ? arr : l === "km" ? arr_kh : l === "ch" ? arr_ch : []
}

export default useArrayTranslated