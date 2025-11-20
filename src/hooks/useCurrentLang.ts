const useCurrentLang = () => {
    const lang = localStorage.getItem("i18nextLng")
    return lang
}

export default useCurrentLang