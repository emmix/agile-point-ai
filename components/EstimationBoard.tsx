
import React, { useMemo } from 'react';
import { Session, EstimationState, Player } from '../types';
import { FIBONACCI_CARDS } from '../constants';

interface EstimationBoardProps {
  session: Session;
  onVote: (vote: string) => void;
  onReveal: () => void;
  onReset: () => void;
}

const EstimationBoard: React.FC<EstimationBoardProps> = ({ session, onVote, onReveal, onReset }) => {
  const user = session.players.find(p => p.id === '1');
  const allVoted = session.players.every(p => p.vote !== null);
  
  const stats = useMemo(() => {
    if (session.state !== EstimationState.REVEALED) return null;
    const votes = session.players
      .map(p => parseFloat(p.vote || '0'))
      .filter(v => !isNaN(v));
    
    if (votes.length === 0) return null;
    
    const sum = votes.reduce((a, b) => a + b, 0);
    const avg = sum / votes.length;
    return {
      average: avg.toFixed(1),
      min: Math.min(...votes),
      max: Math.max(...votes)
    };
  }, [session.players, session.state]);

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Table Area */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden flex flex-col items-center justify-center p-12 min-h-[400px]">
        {/* Radial background for the table */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-50/50 via-white to-white pointer-events-none"></div>

        {/* Players around the table */}
        <div className="relative w-full max-w-2xl aspect-video bg-slate-100/50 border-4 border-slate-200 rounded-[100px] flex items-center justify-center">
            {/* Center Display */}
            <div className="text-center z-10">
                {session.state === EstimationState.VOTING ? (
                    <div className="space-y-4">
                        <div className="text-slate-400 font-bold uppercase tracking-widest text-sm">Awaiting Votes</div>
                        <div className="flex gap-2 justify-center">
                            {session.players.map(p => (
                                <div key={p.id} className={`w-3 h-3 rounded-full ${p.vote ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="text-6xl font-black text-indigo-600 drop-shadow-sm">{stats?.average}</div>
                        <div className="text-slate-500 font-bold uppercase tracking-wider text-xs">Average Estimate</div>
                    </div>
                )}
            </div>

            {/* Simulated Table Positioning */}
            {session.players.map((p, idx) => {
                const angle = (idx / session.players.length) * 2 * Math.PI - Math.PI / 2;
                const radiusX = 340;
                const radiusY = 180;
                const x = Math.cos(angle) * radiusX;
                const y = Math.sin(angle) * radiusY;

                return (
                    <div 
                        key={p.id} 
                        className="absolute flex flex-col items-center gap-2 transition-all duration-500"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                    >
                        <div className={`
                            w-14 h-20 rounded-xl border-2 flex items-center justify-center text-xl font-bold shadow-md transition-all duration-500
                            ${session.state === EstimationState.REVEALED 
                                ? 'bg-indigo-600 text-white border-indigo-700 rotate-0 scale-110' 
                                : p.vote 
                                    ? 'bg-slate-800 border-slate-900 rotate-12 -translate-y-2' 
                                    : 'bg-white text-slate-200 border-slate-200 border-dashed'}
                        `}>
                            {session.state === EstimationState.REVEALED ? p.vote : (p.vote ? <i className="fas fa-check"></i> : '')}
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 bg-white/80 backdrop-blur px-2 py-0.5 rounded-full border border-slate-200 shadow-sm">{p.name}</span>
                    </div>
                );
            })}
        </div>

        {/* Actions */}
        <div className="mt-16 flex gap-4 z-20">
            {session.state === EstimationState.VOTING ? (
                <button 
                    onClick={onReveal}
                    disabled={!allVoted}
                    className={`
                        px-8 py-3 rounded-2xl font-bold text-lg shadow-lg transition-all
                        ${allVoted 
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0' 
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'}
                    `}
                >
                    Reveal Cards
                </button>
            ) : (
                <button 
                    onClick={onReset}
                    className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg hover:bg-slate-900 transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    New Round
                </button>
            )}
        </div>
      </div>

      {/* Stats (Mobile/Summary) */}
      {session.state === EstimationState.REVEALED && stats && (
        <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-slate-400 text-[10px] font-bold uppercase mb-1">Low</div>
                <div className="text-xl font-bold text-slate-700">{stats.min}</div>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 shadow-sm text-center">
                <div className="text-indigo-400 text-[10px] font-bold uppercase mb-1">Average</div>
                <div className="text-xl font-bold text-indigo-700">{stats.average}</div>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-center">
                <div className="text-slate-400 text-[10px] font-bold uppercase mb-1">High</div>
                <div className="text-xl font-bold text-slate-700">{stats.max}</div>
            </div>
        </div>
      )}

      {/* Your Hand */}
      <div className="bg-white/50 p-6 rounded-3xl border border-slate-200">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Your Hand</h3>
        <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
            {FIBONACCI_CARDS.map(card => (
                <button
                    key={card}
                    disabled={session.state === EstimationState.REVEALED}
                    onClick={() => onVote(card)}
                    className={`
                        w-12 h-16 md:w-16 md:h-24 rounded-xl font-bold text-lg md:text-2xl transition-all shadow-sm border-2
                        ${user?.vote === card 
                            ? 'bg-indigo-600 text-white border-indigo-700 -translate-y-4 shadow-indigo-200 shadow-xl' 
                            : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-400 hover:-translate-y-2'}
                        ${session.state === EstimationState.REVEALED ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {card}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default EstimationBoard;
