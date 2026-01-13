import {getCurrentLang} from "./useCurrentLang"

const useArrayTranslated = (arr: string[], arr_kh: string[], arr_ch: string[]): string[] => {
       const l = getCurrentLang()
    return l === "en" ? arr : l === "km" ? arr_kh : l === "ch" ? arr_ch : []
}

export default useArrayTranslated