import React, { useState, useEffect } from 'react';
import {
  Vote, Plus, Trash2, CheckCircle2, AlertCircle, BarChart3,
  RefreshCw, Users, ShieldCheck, ToggleLeft, ToggleRight, Sparkles, Loader2
} from 'lucide-react';
import { collection, doc, setDoc, deleteDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../firebaseAdmin';

const POLLS_COLLECTION = 'polls';

export default function PollsManager() {
  const [polls, setPolls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Poll Form State
  const [question, setQuestion] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [isCreating, setIsCreating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 3500);
  };

  // Real-time polls listener from Firestore
  useEffect(() => {
    try {
      const pollsRef = collection(db, POLLS_COLLECTION);
      const q = query(pollsRef, orderBy('createdAt', 'desc'));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...docSnap.data()
          }));
          setPolls(list);
          setIsLoading(false);
        },
        (err) => {
          console.warn('Firestore polls listener error:', err);
          setIsLoading(false);
        }
      );
      return unsub;
    } catch (e) {
      console.warn('Polls listener init error:', e);
      setIsLoading(false);
    }
  }, []);

  const handleAddOption = () => {
    if (options.length >= 6) {
      showToast('Maximum 6 options allowed per poll.', true);
      return;
    }
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length <= 2) {
      showToast('A poll must have at least 2 options.', true);
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleCreatePoll = async (e) => {
    e.preventDefault();
    const cleanQuestion = question.trim();
    if (!cleanQuestion) {
      showToast('Please enter a poll question.', true);
      return;
    }

    const cleanOptions = options.map((o) => o.trim()).filter(Boolean);
    if (cleanOptions.length < 2) {
      showToast('Please provide at least 2 valid options.', true);
      return;
    }

    setIsCreating(true);
    try {
      const pollId = `poll-${Date.now()}`;
      const docRef = doc(db, POLLS_COLLECTION, pollId);

      const pollData = {
        id: pollId,
        question: cleanQuestion,
        description: description.trim(),
        options: cleanOptions.map((text, idx) => ({
          id: `opt-${idx + 1}-${Date.now().toString(36)}`,
          text,
          votes: 0
        })),
        totalVotes: 0,
        isActive: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      await setDoc(docRef, pollData);

      // Reset Form
      setQuestion('');
      setDescription('');
      setOptions(['', '']);
      showToast('Poll published live to all users!');
    } catch (err) {
      console.error('Failed to create poll:', err);
      showToast('Failed to save poll to Firestore.', true);
    } finally {
      setIsCreating(false);
    }
  };

  const handleToggleActive = async (poll) => {
    try {
      const docRef = doc(db, POLLS_COLLECTION, poll.id);
      await setDoc(docRef, { isActive: !poll.isActive, updatedAt: Date.now() }, { merge: true });
      showToast(poll.isActive ? 'Poll marked as Closed.' : 'Poll activated!');
    } catch (err) {
      console.error('Failed to toggle poll status:', err);
      showToast('Could not update poll status.', true);
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (!window.confirm('Are you sure you want to permanently delete this poll?')) return;
    try {
      const docRef = doc(db, POLLS_COLLECTION, pollId);
      await deleteDoc(docRef);
      showToast('Poll deleted successfully.');
    } catch (err) {
      console.error('Failed to delete poll:', err);
      showToast('Failed to delete poll.', true);
    }
  };

  const handleResetVotes = async (poll) => {
    if (!window.confirm('Reset all votes for this poll back to zero?')) return;
    try {
      const docRef = doc(db, POLLS_COLLECTION, poll.id);
      const resetOptions = (poll.options || []).map((o) => ({ ...o, votes: 0 }));
      await setDoc(docRef, { options: resetOptions, totalVotes: 0, updatedAt: Date.now() }, { merge: true });
      showToast('Votes reset to zero.');
    } catch (err) {
      console.error('Failed to reset votes:', err);
      showToast('Failed to reset votes.', true);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl text-xs font-bold shadow-xl border flex items-center space-x-2 animate-in slide-in-from-bottom duration-200 ${
            toast.isError
              ? 'bg-rose-950/90 text-rose-200 border-rose-800'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
          }`}
        >
          {toast.isError ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Vote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Community Polls & Live Voting</h2>
              <p className="text-xs text-slate-400">
                Engage readers, gather feedback, and let your audience vote in real time
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-indigo-300 bg-indigo-950/60 border border-indigo-800/80 px-3 py-1.5 rounded-full flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>{polls.filter((p) => p.isActive).length} Active Poll(s)</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Create New Poll Form */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 h-fit">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-sm text-white">Create New Community Poll</h3>
          </div>

          <form onSubmit={handleCreatePoll} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Poll Question <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Which topic would you like us to cover next?"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-300 mb-1.5">
                Description / Context (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give readers a quick reason to vote or what will happen with the results..."
                rows={2}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors resize-none"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block font-bold text-slate-300">
                  Voting Options (Min 2, Max 6) <span className="text-rose-400">*</span>
                </label>
                {options.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Add Choice</span>
                  </button>
                )}
              </div>

              <div className="space-y-2">
                {options.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      placeholder={`Option ${idx + 1}`}
                      required
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500 transition-colors"
                    />
                    {options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveOption(idx)}
                        className="p-2 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Remove option"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={isCreating}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Publishing Poll...</span>
                </>
              ) : (
                <>
                  <Vote className="w-4 h-4" />
                  <span>Publish Poll Live to App</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Live Polls List & Analytics */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-extrabold text-sm text-white flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              <span>Existing Polls & Live Results ({polls.length})</span>
            </h3>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              Loading live polls from Firestore...
            </div>
          ) : polls.length === 0 ? (
            <div className="text-center py-12 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 text-slate-400 text-xs">
              <Vote className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="font-bold text-white text-sm">No polls created yet</p>
              <p className="mt-1">Create your first poll on the left to start engaging your audience!</p>
            </div>
          ) : (
            polls.map((poll) => {
              const totalVotes = Math.max(
                poll.totalVotes || 0,
                (poll.options || []).reduce((sum, o) => sum + (Number(o.votes) || 0), 0)
              );

              return (
                <div
                  key={poll.id}
                  className={`bg-slate-900 border rounded-3xl p-5 shadow-lg space-y-4 transition-all ${
                    poll.isActive ? 'border-slate-800' : 'border-slate-800/60 opacity-75'
                  }`}
                >
                  {/* Top Poll Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                            poll.isActive
                              ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {poll.isActive ? '● Live & Voting' : 'Closed'}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(poll.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">
                        {poll.question}
                      </h4>
                      {poll.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {poll.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      <button
                        onClick={() => handleToggleActive(poll)}
                        className={`p-1.5 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors ${
                          poll.isActive
                            ? 'bg-amber-950/60 text-amber-300 hover:bg-amber-900/60'
                            : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60'
                        }`}
                        title={poll.isActive ? 'Close poll' : 'Reactivate poll'}
                      >
                        {poll.isActive ? 'Close' : 'Reopen'}
                      </button>

                      <button
                        onClick={() => handleDeletePoll(poll.id)}
                        className="p-1.5 rounded-xl text-rose-400 hover:bg-rose-950/60 transition-colors"
                        title="Delete poll"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Results Progress Bars */}
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {(poll.options || []).map((opt) => {
                      const votes = Number(opt.votes) || 0;
                      const pct = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

                      return (
                        <div
                          key={opt.id}
                          className="relative overflow-hidden rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-xs"
                        >
                          <div
                            className="absolute top-0 bottom-0 left-0 bg-indigo-600/25 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                          <div className="relative flex items-center justify-between font-semibold">
                            <span className="text-slate-200 truncate pr-2">
                              {opt.text}
                            </span>
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className="text-slate-400 text-[11px]">
                                {votes} votes
                              </span>
                              <span className="font-mono text-indigo-400 font-bold">
                                {pct}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer Metadata */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800">
                    <span className="flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5" />
                      <strong className="text-slate-300">{totalVotes}</strong> total votes
                    </span>

                    <button
                      onClick={() => handleResetVotes(poll)}
                      className="text-slate-500 hover:text-amber-400 transition-colors flex items-center space-x-1"
                      title="Reset vote count to 0"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Reset Votes</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
