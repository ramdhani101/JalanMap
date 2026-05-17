export function extractYoutubeId(url: string): string | null {
  if (!url.trim()) return null
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.slice(1).split('/')[0] || null
    }
    if (parsed.hostname.includes('youtube.com')) {
      return parsed.searchParams.get('v')
    }
  } catch {
    const short = url.match(/(?:youtu\.be\/|v=)([\w-]{11})/)
    return short?.[1] ?? null
  }
  return null
}

export function youtubeEmbedUrl(url: string): string | null {
  const id = extractYoutubeId(url)
  return id ? `https://www.youtube.com/embed/${id}` : null
}

export function youtubeThumbnail(url: string): string | null {
  const id = extractYoutubeId(url)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null
}
