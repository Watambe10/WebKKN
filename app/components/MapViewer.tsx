"use client";

import { useState, useRef, MouseEvent, TouchEvent, useEffect } from "react";

interface MapViewerProps {
  src: string | null | undefined;
  alt: string;
}

export default function MapViewer({ src, alt }: MapViewerProps) {
  const [activeTab, setActiveTab] = useState<"geografis" | "administrasi">(
    src ? "administrasi" : "geografis"
  );
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const viewerRef = useRef<HTMLDivElement>(null);

  // Reset position when zoom goes back to 1
  useEffect(() => {
    if (scale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  }, [scale]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 1));
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Dragging logic for image view
  const startDrag = (clientX: number, clientY: number) => {
    if (scale > 1) {
      setIsDragging(true);
      dragStart.current = { x: clientX - position.x, y: clientY - position.y };
    }
  };

  const onDrag = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    let newX = clientX - dragStart.current.x;
    let newY = clientY - dragStart.current.y;
    
    // Clamp movement bounds so the image does not go completely off screen
    if (viewerRef.current) {
      const rect = viewerRef.current.getBoundingClientRect();
      const maxX = (rect.width * (scale - 1)) / 2;
      const maxY = (rect.height * (scale - 1)) / 2;
      
      newX = Math.max(-maxX, Math.min(maxX, newX));
      newY = Math.max(-maxY, Math.min(maxY, newY));
    }
    
    setPosition({ x: newX, y: newY });
  };

  const stopDrag = () => {
    setIsDragging(false);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (activeTab !== "administrasi" || !src) return;
    
    // Do not drag if clicking controls or buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest(".z-10")) {
      return;
    }
    
    e.preventDefault();
    startDrag(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (activeTab !== "administrasi" || !src) return;
    onDrag(e.clientX, e.clientY);
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (activeTab !== "administrasi" || !src) return;
    
    // Do not drag if touching controls or buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest(".z-10")) {
      return;
    }
    
    if (e.touches.length === 1) {
      startDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (activeTab !== "administrasi" || !src) return;
    if (e.touches.length === 1) {
      onDrag(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  return (
    <div className="flex flex-col flex-grow w-full">
      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          type="button"
          onClick={() => setActiveTab("geografis")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all border cursor-pointer ${
            activeTab === "geografis"
              ? "bg-[#1b352c] text-white border-[#1b352c] shadow-sm"
              : "bg-[#fcfbfa] text-[#5b6b63] border-[#e0dacb] hover:bg-[#f6f3ec] hover:text-[#1e2c26]"
          }`}
        >
          Peta Geografis (Live OSM)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("administrasi")}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all border cursor-pointer ${
            activeTab === "administrasi"
              ? "bg-[#1b352c] text-white border-[#1b352c] shadow-sm"
              : "bg-[#fcfbfa] text-[#5b6b63] border-[#e0dacb] hover:bg-[#f6f3ec] hover:text-[#1e2c26]"
          }`}
        >
          Peta Administrasi (RT/RW)
        </button>
      </div>

      {/* Map Viewer Area */}
      <div 
        ref={viewerRef}
        className="relative w-full h-full min-h-[350px] md:min-h-[420px] overflow-hidden rounded-lg bg-[#fbfaf6] border border-[#e7e1d3] select-none flex items-center justify-center flex-grow"
        style={{ 
          cursor: activeTab === "administrasi" && src && scale > 1 
            ? (isDragging ? "grabbing" : "grab") 
            : "default" 
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrag}
      >
        {activeTab === "geografis" ? (
          /* OpenStreetMap live map for Plasan, Watugajah, Gedangsari, Gunung Kidul */
          <iframe 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            scrolling="no" 
            marginHeight={0} 
            marginWidth={0} 
            src="https://www.openstreetmap.org/export/embed.html?bbox=110.5925,-7.8105,110.5985,-7.8060&layer=mapnik&marker=-7.8082,110.5954"
            className="absolute inset-0 w-full h-full rounded-lg border-0"
            title="Peta Geografis Padukuhan Plasan"
          ></iframe>
        ) : src ? (
          /* Custom uploaded map image (Zoom & Pan enabled) */
          <>
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-75 ease-out"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: "center center",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={alt}
                className="max-h-[420px] max-w-full object-contain pointer-events-none"
                draggable={false}
              />
            </div>

            {/* Zoom Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-white/95 backdrop-blur-sm p-1.5 rounded-lg border border-[#e0dacb] shadow-md z-10">
              <span className="px-2.5 text-xs font-bold text-[#1e2c26] tabular-nums">
                {Math.round(scale * 100)}%
              </span>
              <div className="h-4 w-px bg-[#e0dacb]" />
              
              {/* Zoom Out Button */}
              <button
                type="button"
                onClick={handleZoomOut}
                disabled={scale === 1}
                className="p-1.5 rounded text-[#1e2c26] hover:bg-[#f6f3ec] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                title="Zoom Out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                </svg>
              </button>

              {/* Zoom In Button */}
              <button
                type="button"
                onClick={handleZoomIn}
                disabled={scale === 4}
                className="p-1.5 rounded text-[#1e2c26] hover:bg-[#f6f3ec] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                title="Zoom In"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
              </button>

              {/* Reset Button */}
              <button
                type="button"
                onClick={handleReset}
                disabled={scale === 1 && position.x === 0 && position.y === 0}
                className="p-1.5 rounded text-[#1e2c26] hover:bg-[#f6f3ec] disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
                title="Reset"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </button>
            </div>

            {/* Floating Instruction Overlay (shows when zoom > 1) */}
            {scale > 1 && (
              <div className="absolute top-4 left-4 bg-[#1b352c]/90 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded shadow-sm pointer-events-none select-none">
                Geser Peta (Drag to Pan)
              </div>
            )}
          </>
        ) : (
          /* Custom map image placeholder when not uploaded */
          <div className="flex flex-col items-center justify-center p-8 text-center text-[#8e8570]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-[#b9b094] mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8m-9-10.5a.75.75 0 01.75-.75h7.5a.75.75 0 01.75.75v11.25a.75.75 0 01-.75.75h-7.5a.75.75 0 01-.75-.75V5.25z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12h19.5M12 2.25v19.5" />
            </svg>
            <p className="font-bold text-[#5b6b63]">Gambar Peta Administrasi Belum Tersedia</p>
            <p className="text-xs mt-1 text-[#8e8570] max-w-sm">Gambar peta administratif RT/RW belum diunggah. Pengurus dapat mengunggah gambar peta melalui Panel Admin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
