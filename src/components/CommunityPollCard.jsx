import React, { useState } from 'react';
import { BarChart3, CheckCircle2, Vote, Sparkles, Users, Lock } from 'lucide-react';
import { storageService } from '../services/storageService';
import { firestoreSyncService } from '../services/firestoreSyncService';

export default function CommunityPollCard({ poll, onVoted, onVote }) {
  const [selectedOption, setSelectedOption] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(() => storageService.hasUserVoted(poll?.id));
  const [userVotedOptionId, setUserVotedOptionId] = useState(() => storageService.getUserVotedOption(poll?.id));

  if (!poll || !poll.options || poll.options.length === 0) return null;

  const totalVotes = Math.max(
    poll.totalVotes || 0,
    poll.options.reduce((sum, opt) => sum + (Number(opt.votes) || 0), 0)
  );

  const handleVote = async () => {
    if (!selectedOption || hasVoted || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 1. Submit atomic vote to Firestore
      await firestoreSyncService.votePoll(poll.id, selectedOption);

      // 2. Save locally so user cannot vote twice
      storageService.saveVotedPoll(poll.id, selectedOption);
      setHasVoted(true);
      setUserVotedOptionId(selectedOption);

      if (typeof onVoted === 'function') {
        onVoted(poll.id, selectedOption);
      }
      if (typeof onVote === 'function') {
        onVote(selectedOption);
      }
    } catch (e) {
      console.warn('Poll vote submission warning:', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto my-5 rounded-3xl bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/20 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-lg shadow-indigo-500/5 transition-all">
      {/* Poll Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/25">
            <Vote className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-200/50 dark:border-indigo-800/50">
              Community Pulse • Live Vote
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>{totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}</span>
        </div>
      </div>

      {/* Question */}
      <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
        {poll.question}
      </h3>

      {poll.description && (
        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1.5 leading-relaxed">
          {poll.description}
        </p>
      )}

      {/* Options Listing */}
      <div className="mt-4 space-y-2.5">
        {poll.options.map((option) => {
          const optVotes = Number(option.votes) || 0;
          const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
          const isSelected = selectedOption === option.id;
          const isUserVote = userVotedOptionId === option.id;

          if (hasVoted) {
            // Results Mode (Progress Bars)
            return (
              <div
                key={option.id}
                className={`relative overflow-hidden rounded-2xl border p-3 sm:p-3.5 transition-all ${
                  isUserVote
                    ? 'border-indigo-600 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850/50'
                }`}
              >
                {/* Visual Percentage Progress Fill */}
                <div
                  className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out opacity-20 ${
                    isUserVote ? 'bg-indigo-600' : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                />

                <div className="relative flex items-center justify-between text-xs sm:text-sm font-bold">
                  <div className="flex items-center space-x-2 min-w-0 pr-2">
                    {isUserVote ? (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0" />
                    )}
                    <span className={`truncate ${isUserVote ? 'text-indigo-700 dark:text-indigo-300 font-extrabold' : 'text-slate-800 dark:text-slate-200'}`}>
                      {option.text}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[11px] text-slate-400 font-medium">
                      ({optVotes})
                    </span>
                    <span className={`font-mono font-black ${isUserVote ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-700 dark:text-slate-300'}`}>
                      {percentage}%
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // Voting Mode (Selectable Options)
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setSelectedOption(option.id)}
              className={`w-full text-left p-3 sm:p-3.5 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/50 shadow-md shadow-indigo-600/10 scale-[1.01]'
                  : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-600'
                    : 'border-slate-300 dark:border-slate-600'
                }`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                </div>
                <span className={`text-xs sm:text-sm font-semibold truncate ${
                  isSelected ? 'text-indigo-900 dark:text-indigo-200 font-bold' : 'text-slate-800 dark:text-slate-200'
                }`}>
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Voting Actions Footer */}
      {!hasVoted ? (
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">
            Tap an option to vote
          </span>

          <button
            onClick={handleVote}
            disabled={!selectedOption || isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs shadow-md shadow-indigo-600/20 active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer flex items-center space-x-1.5"
          >
            <span>{isSubmitting ? 'Submitting...' : 'Submit Vote'}</span>
          </button>
        </div>
      ) : (
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Your vote is counted!</span>
          </span>
          <span className="text-[10px] text-slate-400">Live community poll</span>
        </div>
      )}
    </div>
  );
}
