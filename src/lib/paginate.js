export function paginate(items, page, size) {
  const pages = Math.max(1, Math.ceil(items.length / size))
  const safePage = Math.min(Math.max(page, 0), pages - 1)
  const start = safePage * size
  return { page: safePage, pages, start, items: items.slice(start, start + size) }
}
