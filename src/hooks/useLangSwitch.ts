import { getCurrentLang } from "./useCurrentLang";


//This hook was my mistake. To avoid unnecessary changes let use getLangSwitch function instead
const useLangSwitch = (en_text: string, km_text: string, ch_text: string) => {
  const l = getCurrentLang();
  const final =
    l === "en" ? en_text : l === "km" ? km_text : l === "ch" ? ch_text : "";
  return final;
};
export default useLangSwitch;



//here it is
export const getLangSwitch = (en_text: string, km_text: string, ch_text: string) => {
  const l = getCurrentLang();
  const final =
    l === "en" ? en_text : l === "km" ? km_text : l === "ch" ? ch_text : "";
  return final;
};