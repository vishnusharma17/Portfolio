export const asset = (path = '') => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path

  const base = import.meta.env.BASE_URL || '/'
  const clean = String(path).replace(/^\//, '')
  return `${base}${clean}`.replace(/([^:]\/)\/+/g, '$1')
}
