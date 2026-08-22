import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, FastForward } from 'lucide-react';

export default function AudioPlayer({ textToRead, title }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rate, setRate] = useState(1.0);
  const synthRef = useRef(window.speechSynthesis || null);
  const utteranceRef = useRef(null);

  useEffect(() => {
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const cleanText = (raw) => {
    return raw
      .replace(/###|##|#|\*|\>|\`/g, '')
      .replace(/\n+/g, ' ')
      .slice(0, 3000);
  };

  const handlePlayPause = () => {
    if (!synthRef.current) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    if (isPlaying) {
      synthRef.current.pause();
      setIsPlaying(false);
    } else {
      if (synthRef.current.paused) {
        synthRef.current.resume();
        setIsPlaying(true);
      } else {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(cleanText(textToRead));
        utterance.rate = rate;
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = () => setIsPlaying(false);
        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
        setIsPlaying(true);
      }
    }
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
    }
  };

  const toggleRate = () => {
    const rates = [1.0, 1.25, 1.5];
    const nextRate = rates[(rates.indexOf(rate) + 1) % rates.length];
    setRate(nextRate);
    if (isPlaying && synthRef.current) {
      handleStop();
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(cleanText(textToRead));
        utterance.rate = nextRate;
        utterance.onend = () => setIsPlaying(false);
        utteranceRef.current = utterance;
        synthRef.current.speak(utterance);
        setIsPlaying(true);
      }, 100);
    }
  };

  return (
    <div className="bg-indigo-50/90 dark:bg-indigo-950/70 border border-indigo-200/80 dark:border-indigo-800/60 rounded-2xl p-3.5 flex items-center justify-between shadow-sm my-4">
      {/* Icon & Title */}
      <div className="flex items-center space-x-3 min-w-0 flex-1">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
          isPlaying ? 'bg-indigo-600 text-white animate-pulse' : 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300'
        }`}>
          <Volume2 className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              AI Audio Reader
            </span>
            {isPlaying && (
              <span className="flex space-x-0.5 items-end h-2.5">
                <span className="w-0.5 h-full bg-indigo-500 rounded animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-0.5 h-2/3 bg-indigo-500 rounded animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-0.5 h-full bg-indigo-500 rounded animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
            {title}
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-1.5 ml-3 flex-shrink-0">
        <button
          onClick={toggleRate}
          className="px-2 py-1 text-[11px] font-bold text-indigo-700 dark:text-indigo-300 bg-white dark:bg-slate-800 rounded-lg border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 transition-colors"
        >
          {rate}x
        </button>

        <button
          onClick={handlePlayPause}
          className="w-8 h-8 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 transition-transform active:scale-95"
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
        </button>

        {isPlaying && (
          <button
            onClick={handleStop}
            className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 transition-colors"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}
      </div>
    </div>
  );
}
