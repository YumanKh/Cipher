export function faviconUrl(link: string | null | undefined): string | null {
  if (!link) return null
  try {
    const normalized = /^https?:\/\//i.test(link) ? link : `https://${link}`
    const { hostname } = new URL(normalized)
    return `https://icons.duckduckgo.com/ip3/${hostname}.ico`
  } catch {
    return null
  }
}