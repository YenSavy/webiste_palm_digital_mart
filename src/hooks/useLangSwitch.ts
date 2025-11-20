import useCurrentLang from "./useCurrentLang"

const useLangSwitch = (en_text: string, km_text:string, ch_text:string) => {
    const l = useCurrentLang()
    const final =  l === "en" ? en_text : l === "km" ? km_text: l === "ch" ? ch_text: ""
    return final
}
export default useLangSwitch