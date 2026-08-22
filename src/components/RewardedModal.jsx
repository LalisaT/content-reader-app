import React, { useState, useEffect } from 'react';
import { Award, Play, CheckCircle2, X, Sparkles, ShieldCheck } from 'lucide-react';
import { ADMOB_CONFIG } from '../services/admobService';

export default function RewardedModal({ isOpen, onClose, onRewardEarned, articleTitle }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false);
      setProgress(0);
      setIsCompleted(false);
      return;
    }
  }, [isOpen]);

  const handleStartRewardVideo = () => {
    setIsPlaying(true);
    setProgress(0);
    const duration = 5000; // 5 seconds test video
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsCompleted(true);
          setIsPlaying(false);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);
  };

  const handleClaimReward = () => {
    onRewardEarned();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
        {/* Top Header */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 flex items-center justify-between text-slate-950">
          <div className="flex items-center space-x-1.5 font-black text-xs uppercase tracking-wide">
            <Award className="w-4 h-4" />
            <span>AdMob Rewarded Video</span>
          </div>
          <button
            onClick={onClose}
            disabled={isPlaying}
            className="p-1 rounded-full hover:bg-black/10 transition-colors disabled:opacity-30"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {!isPlaying && !isCompleted && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center mx-auto mb-4 text-amber-600 dark:text-amber-400">
                <Sparkles className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                Unlock Premium Masterclass
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                Watch a short 5-second sponsor video to get lifetime reading access to:
              </p>
              
              <div className="mt-2.5 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                "{articleTitle}"
              </div>

              <button
                onClick={handleStartRewardVideo}
                className="mt-5 w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-extrabold text-sm py-3 px-4 rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Watch Video & Unlock (5s)</span>
              </button>

              <p className="text-[10px] text-slate-400 mt-3 font-mono">
                AdMob Rewarded Unit: {ADMOB_CONFIG.TEST_IDS.REWARDED_ANDROID.slice(0, 24)}...
              </p>
            </div>
          )}

          {/* Playing Simulation */}
          {isPlaying && (
            <div className="text-center py-4">
              <div className="relative w-full h-44 rounded-2xl bg-slate-950 overflow-hidden flex flex-col items-center justify-center border border-slate-800">
                <div className="absolute top-2 left-2 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded">
                  Reward in Progress
                </div>
                
                <div className="w-12 h-12 rounded-full bg-amber-500/20 animate-ping absolute" />
                <Play className="w-10 h-10 text-amber-400 relative z-10 fill-amber-400" />
                
                <span className="text-xs font-medium text-slate-300 mt-2 relative z-10">
                  Simulating AdMob Video Ad...
                </span>

                {/* Progress Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-slate-800">
                  <div 
                    className="h-full bg-amber-500 transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <p className="text-xs font-semibold text-slate-500 mt-3">
                Please do not close until the video completes.
              </p>
            </div>
          )}

          {/* Reward Completed */}
          {isCompleted && (
            <div className="text-center py-2 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center mx-auto mb-3 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Reward Earned!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                You have successfully unlocked this exclusive guide.
              </p>

              <button
                onClick={handleClaimReward}
                className="mt-5 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                Start Reading Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
