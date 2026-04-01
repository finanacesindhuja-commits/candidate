import React, { useState, useEffect, useRef } from 'react';

const PullToRefresh = ({ children }) => {
    const [pullDistance, setPullDistance] = useState(0);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const containerRef = useRef(null);
    const startY = useRef(0);
    const isPulling = useRef(false);

    const pullThreshold = 80;

    const handleTouchStart = (e) => {
        if (window.scrollY === 0) {
            startY.current = e.touches[0].pageY;
            isPulling.current = true;
        }
    };

    const handleTouchMove = (e) => {
        if (!isPulling.current) return;
        
        const currentY = e.touches[0].pageY;
        const diff = currentY - startY.current;

        if (diff > 0) {
            // Apply resistance: diff / 2
            setPullDistance(Math.min(diff / 2, pullThreshold + 20));
            if (diff > 10) {
                // Prevent default pull-to-refresh if we are handling it
                if (e.cancelable) e.preventDefault();
            }
        } else {
            setPullDistance(0);
            isPulling.current = false;
        }
    };

    const handleTouchEnd = () => {
        if (!isPulling.current) return;
        
        if (pullDistance >= pullThreshold) {
            setIsRefreshing(true);
            setPullDistance(pullThreshold);
            
            // Simulate refresh / trigger reload
            setTimeout(() => {
                window.location.reload();
            }, 800);
        } else {
            setPullDistance(0);
        }
        isPulling.current = false;
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full min-h-screen overscroll-behavior-y-contain"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            {/* Spinner Container */}
            <div 
                className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none transition-transform duration-200"
                style={{ 
                    height: `${pullThreshold}px`,
                    transform: `translateY(${pullDistance - pullThreshold}px)`,
                    opacity: pullDistance / pullThreshold
                }}
            >
                <div className={`w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full ${isRefreshing ? 'animate-spin' : ''}`} 
                     style={{ transform: `rotate(${pullDistance * 2}deg)` }}
                />
            </div>

            {/* Content Container */}
            <div 
                className="transition-transform duration-200"
                style={{ transform: `translateY(${pullDistance}px)` }}
            >
                {children}
            </div>
        </div>
    );
};

export default PullToRefresh;
