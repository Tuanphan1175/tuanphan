
import React from 'react';

const VideoDemo: React.FC<{ t: any }> = ({ t }) => {
  return (
    <div className="flex flex-col gap-6 px-5 py-12 bg-white dark:bg-[#161b22] border-b border-gray-100 dark:border-gray-800">
      <div className="flex flex-col gap-3 text-center items-center">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
          <span className="material-symbols-outlined text-primary text-sm">play_circle</span>
          <span className="text-xs font-bold text-primary uppercase tracking-wide">{t.watchDemo}</span>
        </div>
        <h2 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white">{t.demoTitle}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
          {t.demoDesc}
        </p>
      </div>
      <div className="group relative w-full aspect-video overflow-hidden rounded-2xl bg-gray-900 shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 cursor-pointer">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("https://picsum.photos/seed/demo/1280/720")` }}></div>
        <div className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary">
            <span className="material-symbols-outlined text-4xl ml-1">play_arrow</span>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <div className="flex items-center justify-between text-white">
            <div className="flex flex-col">
              <span className="text-xs font-bold shadow-black drop-shadow-md">{t.overviewTour}</span>
              <span className="text-[10px] opacity-80">1:45 • HD</span>
            </div>
            <span className="material-symbols-outlined text-xl opacity-80 hover:opacity-100 cursor-pointer hover:text-primary transition-colors">fullscreen</span>
          </div>
          <div className="mt-3 h-1 w-full rounded-full bg-white/20">
            <div className="h-full w-1/4 rounded-full bg-primary"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDemo;
