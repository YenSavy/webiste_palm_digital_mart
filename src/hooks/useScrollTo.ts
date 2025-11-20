export const scrollToId = (id: string, offset = 0, behavior: ScrollBehavior = 'smooth') => {
  const el = document.getElementById(id)
  if (!el) return
  const y = el.getBoundingClientRect().top + window.scrollY + offset
  window.scrollTo({ top: y, behavior })
}

export default function useScrollTo() {
  return scrollToId
}
