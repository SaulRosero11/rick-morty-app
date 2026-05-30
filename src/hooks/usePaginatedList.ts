import { useState, useEffect, useRef, useCallback } from 'react';
import { PaginatedResponse } from '../types/api';

type FetchFn<T> = (page: number) => Promise<PaginatedResponse<T>>;

interface PaginatedState<T> {
  data: T[];
  loading: boolean;
  initialLoading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
}

export function usePaginatedList<T>(fetchFn: FetchFn<T>): PaginatedState<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  // initialLoading is true ONLY on the very first fetch — never reset by search changes
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const pageRef = useRef(1);
  const isFetchingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetchPage = useCallback(
    async (pageNum: number) => {
      if (isFetchingRef.current) return;
      isFetchingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const response = await fetchFn(pageNum);
        if (!mountedRef.current) return;
        setData((prev) =>
          pageNum === 1 ? response.results : [...prev, ...response.results]
        );
        setHasMore(response.info.next !== null);
      } catch (err: any) {
        if (!mountedRef.current) return;
        // Rick & Morty API returns 404 when a search query has no matches
        // {"error":"There is nothing here"} — treat as empty list, not as an error
        if (err?.response?.status === 404) {
          setData([]);
          setHasMore(false);
        } else {
          const msg = err?.message ?? 'Error desconocido';
          setError(`No se pudo cargar la información. (${msg})`);
        }
      } finally {
        isFetchingRef.current = false;
        if (mountedRef.current) {
          setLoading(false);
          // Only flip initialLoading once — on the very first fetch completion
          setInitialLoading(false);
        }
      }
    },
    [fetchFn]
  );

  useEffect(() => {
    pageRef.current = 1;
    isFetchingRef.current = false;
    setData([]);
    setHasMore(true);
    setError(null);
    // ⚠️ Do NOT setInitialLoading(true) here — that would cause a full-screen
    // spinner on every search query change. initialLoading starts true and is
    // flipped to false exactly once, when the first fetch completes.
    fetchPage(1);
  }, [fetchFn]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(() => {
    if (isFetchingRef.current || !hasMore) return;
    const next = pageRef.current + 1;
    pageRef.current = next;
    fetchPage(next);
  }, [hasMore, fetchPage]);

  const refresh = useCallback(() => {
    pageRef.current = 1;
    isFetchingRef.current = false;
    setData([]);
    setHasMore(true);
    fetchPage(1);
  }, [fetchPage]);

  return { data, loading, initialLoading, error, hasMore, loadMore, refresh };
}
