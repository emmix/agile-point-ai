
import React from 'react';
import { AIAnalysis } from '../types';

interface AIAnalystProps {
  isAnalyzing: boolean;
  analysis: AIAnalysis | null;
}

const AIAnalyst: React.FC<AIAnalystProps> = ({ isAnalyzing, analysis }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
      <div className="p-5 border-b border-slate-100 flex items-center gap-3">
        <div className="bg-emerald-500 w-8 h-8 rounded-full flex items-center justify-center text-white">
          <i className="fas fa-robot text-sm"></i>
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-800">Gemini Analyst</h2>
          <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">AI ASSISTANT</span>
        </div>
      </div>

      <div className="flex-1 p-5 overflow-y-auto space-y-6">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-slate-100 border-t-emerald-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <i className="fas fa-brain text-emerald-200 text-xl"></i>
              </div>
            </div>
            <div>
              <p className="text-slate-800 font-bold">Analyzing complexity...</p>
              <p className="text-slate-500 text-xs mt-1 italic">Thinking about edge cases & dependencies</p>
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* Suggestion Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Points</span>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">High Confidence</span>
              </div>
              <div className="flex items-center gap-6">
                <div className="w-16 h-20 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-indigo-100">
                  {analysis.suggestedPoints}
                </div>
                <div>
                    <div className="text-xs text-slate-500 mb-1">Complexity Score</div>
                    <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className={`w-2 h-4 rounded-full ${i < analysis.complexityScore ? 'bg-emerald-500' : 'bg-slate-200'}`}></div>
                        ))}
                    </div>
                </div>
              </div>
            </div>

            {/* Reasoning */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Reasoning</h3>
              <p className="text-sm text-slate-600 leading-relaxed italic border-l-4 border-slate-100 pl-4 py-1">
                "{analysis.reasoning}"
              </p>
            </div>

            {/* Technical Risks */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Key Considerations</h3>
              <div className="space-y-2">
                {analysis.risks.map((risk, idx) => (
                  <div key={idx} className="flex gap-3 items-start p-3 bg-red-50/50 rounded-xl border border-red-100">
                    <i className="fas fa-exclamation-triangle text-red-500 mt-1 text-xs"></i>
                    <p className="text-xs text-slate-700 font-medium">{risk}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <p className="text-[10px] text-slate-400 leading-tight">
                AI estimates are generated based on text analysis and may not account for team-specific velocity or infrastructure nuances.
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-50">
             <i className="fas fa-lightbulb text-4xl text-slate-200"></i>
             <p className="text-slate-400 text-sm">Waiting for a user story to analyze.</p>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 rounded-b-3xl">
        <button className="w-full bg-white text-slate-700 py-3 px-4 rounded-xl text-sm font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
           <i className="fas fa-comment-dots"></i> Ask Analyst anything...
        </button>
      </div>
    </div>
  );
};

export default AIAnalyst;
