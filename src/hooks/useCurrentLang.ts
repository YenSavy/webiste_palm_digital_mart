export const getCurrentLang = () => {
    const lang = localStorage.getItem("i18nextLng")
    return lang
}

