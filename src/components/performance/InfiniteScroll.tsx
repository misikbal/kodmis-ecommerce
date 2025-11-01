'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';

interface InfiniteScrollProps {
  children: React.ReactNode;
  hasMore: boolean;
  loadMore: () => void;
  threshold?: number;
  loading?: boolean;
  className?: string;
}

export function InfiniteScroll({
  children,
  hasMore,
  loadMore,
  threshold = 0.1,
  loading = false,
  className = ''
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !loading && !isLoading) {
        setIsLoading(true);
        loadMore();
        setTimeout(() => setIsLoading(false), 1000);
      }
    },
    [hasMore, loading, isLoading, loadMore]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      threshold
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleObserver, threshold]);

  return (
    <div className={className}>
      {children}
      
      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-4">
          {loading || isLoading ? (
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Yükleniyor...</span>
            </div>
          ) : (
            <div className="text-gray-400 text-sm">Daha fazla içerik yükleniyor...</div>
          )}
        </div>
      )}
    </div>
  );
}
