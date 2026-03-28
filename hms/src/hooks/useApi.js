import { useState, useCallback, useEffect, useRef } from 'react';

export function useApi(apiFn, { fallback = null, immediate = false, args = [] } = {}) {
  const [data,    setData]    = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const execute = useCallback(async (...callArgs) => {
    if (mounted.current) { setLoading(true); setError(null); }
    try {
      const res = await apiFn(...callArgs);
      const payload = res?.data;
      if (mounted.current) setData(payload ?? fallback);
      return payload;
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || err.message || 'Request failed';
      if (mounted.current) {
        setError(msg);
        // If network error and we have fallback, keep using it silently
        if (!err.response && fallback !== null) setData(fallback);
      }
      throw err;
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [apiFn, fallback]);

  // Auto-execute on mount if requested
  useEffect(() => {
    if (immediate) execute(...args).catch(() => {});
  }, []); // eslint-disable-line

  return { data, loading, error, execute, setData };
}
