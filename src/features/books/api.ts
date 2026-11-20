import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/api/http'

export type SearchField = 'all' | 'title' | 'author' | 'isbn'
export type CatalogSource = 'openlibrary' | 'google'

/** Livro do catálogo externo, antes de ser escolhido. */
export type CatalogBook = {
  catalogId: string
  title: string
  subtitle: string | null
  authors: string[]
  description: string | null
  categories: string[]
  publishedDate: string | null
  isbn13: string | null
  coverUrl: string | null
  pageCount: number | null
}

/** Livro já guardado no Reten. */
export type Book = CatalogBook & {
  id: string
  lastSelectedAt: string | null
}

export type SearchResponse = { source: CatalogSource; results: CatalogBook[] }

export const sourceLabels: Record<CatalogSource, string> = {
  openlibrary: 'Open Library',
  google: 'Google Books',
}

export function useBookSearch(query: string, field: SearchField) {
  const text = query.trim()
  return useQuery({
    queryKey: ['books', 'search', field, text],
    queryFn: ({ signal }) =>
      api<SearchResponse>(`/books/search?q=${encodeURIComponent(text)}&by=${field}`, { signal }),
    enabled: text.length >= 2,
    placeholderData: keepPreviousData,
    staleTime: 10 * 60_000,
  })
}

export function useCatalogBook(catalogId: string | null) {
  return useQuery({
    queryKey: ['books', 'catalog', catalogId],
    queryFn: ({ signal }) => api<CatalogBook>(`/books/catalog?id=${encodeURIComponent(catalogId!)}`, { signal }),
    enabled: catalogId !== null,
    staleTime: 30 * 60_000,
  })
}

export function useRecentBooks() {
  return useQuery({
    queryKey: ['books', 'recent'],
    queryFn: () => api<Book[]>('/books/recent'),
  })
}

export function useBook(id: string | undefined) {
  return useQuery({
    queryKey: ['books', 'detail', id],
    queryFn: () => api<Book>(`/books/${id}`),
    enabled: Boolean(id),
  })
}

export function useSelectBook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (catalogId: string) => api<Book>('/books/select', { method: 'POST', body: { catalogId } }),
    onSuccess: (book) => {
      queryClient.setQueryData(['books', 'detail', book.id], book)
      queryClient.invalidateQueries({ queryKey: ['books', 'recent'] })
    },
  })
}

/** "2019" | "2019-03" | "2019-03-27" → texto legível em português. */
export function formatPublishedDate(value: string | null): string | null {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  if (!month) return String(year)
  const date = new Date(Date.UTC(year, month - 1, day || 1))
  return new Intl.DateTimeFormat('pt-BR', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'long',
    ...(day ? { day: 'numeric' } : {}),
  }).format(date)
}
