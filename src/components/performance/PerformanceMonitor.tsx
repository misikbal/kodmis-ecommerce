'use client';

import { useState, useEffect, useRef } from 'react';
import { Activity, Zap, Clock, Database } from 'lucide-react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderTime: number;
  componentCount: number;
}

interface PerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
}

export function PerformanceMonitor({ 
  className = '', 
  showDetails = false 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    memory: 0,
    renderTime: 0,
    componentCount: 0
  });
  
  const [isVisible, setIsVisible] = useState(false);
  const frameRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  useEffect(() => {
    const startTime = performance.now();
    
    const measurePerformance = () => {
      const currentTime = performance.now();
      const deltaTime = currentTime - lastTimeRef.current;
      
      frameCountRef.current++;
      
      if (deltaTime >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / deltaTime);
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memory: (performance as any).memory?.usedJSHeapSize / 1024 / 1024 || 0,
          renderTime: currentTime - startTime,
          componentCount: document.querySelectorAll('*').length
        }));
        
        frameCountRef.current = 0;
        lastTimeRef.current = currentTime;
      }
      
      frameRef.current = requestAnimationFrame(measurePerformance);
    };
    
    frameRef.current = requestAnimationFrame(measurePerformance);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-green-600';
    if (fps >= 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMemoryColor = (memory: number) => {
    if (memory < 50) return 'text-green-600';
    if (memory < 100) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className={`fixed bottom-4 right-4 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 ${className}`}
        title="Performance Monitor"
      >
        <Activity className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[200px] ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Performance</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <Zap className="h-3 w-3 mr-1" />
            <span>FPS</span>
          </div>
          <span className={getFPSColor(metrics.fps)}>{metrics.fps}</span>
        </div>
        
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center">
            <Database className="h-3 w-3 mr-1" />
            <span>Memory</span>
          </div>
          <span className={getMemoryColor(metrics.memory)}>
            {metrics.memory.toFixed(1)}MB
          </span>
        </div>
        
        {showDetails && (
          <>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Render</span>
              </div>
              <span>{metrics.renderTime.toFixed(0)}ms</span>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span>Components</span>
              <span>{metrics.componentCount}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
