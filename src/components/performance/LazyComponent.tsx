'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

export function LazyComponent({ 
  children, 
  fallback,
  threshold = 0.1,
  rootMargin = '50px',
  className = ''
}: LazyComponentProps) {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    if (componentRef.current) {
      observer.observe(componentRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  useEffect(() => {
    if (isInView) {
      // Simulate loading delay for demonstration
      const timer = setTimeout(() => {
        setIsLoaded(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [isInView]);

  const defaultFallback = (
    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  );

  return (
    <div ref={componentRef} className={className}>
      {isInView ? (
        isLoaded ? (
          children
        ) : (
          fallback || defaultFallback
        )
      ) : (
        <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
      )}
    </div>
  );
}
