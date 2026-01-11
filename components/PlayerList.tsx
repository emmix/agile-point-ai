
import React from 'react';
import { Player, EstimationState } from '../types';

interface PlayerListProps {
  players: Player[];
  state: EstimationState;
}

const PlayerList: React.FC<PlayerListProps> = ({ players, state }) => {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Players ({players.length})</h3>
      </div>
      <div className="space-y-3">
        {players.map(player => (
          <div key={player.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                {player.name.charAt(0)}
              </div>
              <div>
                <span className="text-sm font-semibold text-slate-700 block leading-none">{player.name}</span>
                {player.isHost && <span className="text-[10px] text-indigo-500 font-medium">HOST</span>}
              </div>
            </div>
            
            <div className="flex items-center">
              {player.vote ? (
                state === EstimationState.REVEALED ? (
                  <span className="w-8 h-10 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold shadow-sm">
                    {player.vote}
                  </span>
                ) : (
                  <div className="w-8 h-10 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
                    <i className="fas fa-check text-white text-xs"></i>
                  </div>
                )
              ) : (
                <div className="w-8 h-10 bg-slate-200 rounded-lg flex items-center justify-center border border-dashed border-slate-300">
                  <span className="animate-pulse w-1.5 h-1.5 bg-slate-400 rounded-full"></span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
