
import React, { useState, useEffect, useCallback } from 'react';
import { EstimationState, Player, Session, Story, AIAnalysis } from './types';
import { FIBONACCI_CARDS, MOCK_PLAYERS, INITIAL_STORY } from './constants';
import { analyzeStory } from './services/geminiService';
import EstimationBoard from './components/EstimationBoard';
import StoryInput from './components/StoryInput';
import AIAnalyst from './components/AIAnalyst';
import PlayerList from './components/PlayerList';

const App: React.FC = () => {
  const [session, setSession] = useState<Session>({
    id: 'session-123',
    currentStory: INITIAL_STORY,
    players: [
      { id: '1', name: 'You (Dev)', vote: null, isHost: true },
      ...MOCK_PLAYERS
    ],
    state: EstimationState.VOTING,
    history: []
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);

  // Simulate other players voting when user votes
  const handleVote = useCallback((vote: string) => {
    setSession(prev => ({
      ...prev,
      players: prev.players.map(p => {
        if (p.id === '1') return { ...p, vote };
        // Simulate random delay for other players
        return { ...p, vote: p.vote || FIBONACCI_CARDS[Math.floor(Math.random() * 6) + 2] }; 
      })
    }));
  }, []);

  const handleReveal = () => {
    setSession(prev => ({ ...prev, state: EstimationState.REVEALED }));
  };

  const handleReset = () => {
    setSession(prev => ({
      ...prev,
      state: EstimationState.VOTING,
      players: prev.players.map(p => ({ ...p, vote: null }))
    }));
    setAiAnalysis(null);
  };

  const handleNewStory = (story: Story) => {
    setSession(prev => ({
      ...prev,
      currentStory: story,
      state: EstimationState.VOTING,
      players: prev.players.map(p => ({ ...p, vote: null }))
    }));
    setAiAnalysis(null);
    runAIAnalysis(story);
  };

  const runAIAnalysis = async (story: Story) => {
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeStory(story.title, story.description);
      setAiAnalysis(analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run initial analysis
  useEffect(() => {
    runAIAnalysis(INITIAL_STORY);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <i className="fas fa-layer-group text-xl"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">AgilePoint AI</h1>
            <p className="text-xs text-slate-500 font-medium">SMART PLANNING SESSION</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-semibold text-slate-700">Room: #882-Alpha</span>
            <span className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              Live Session
            </span>
          </div>
          <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-200">
            <i className="fas fa-share-alt mr-2"></i> Invite
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row p-4 md:p-6 gap-6 overflow-hidden">
        {/* Left Side: Players & Story Info */}
        <aside className="w-full lg:w-80 flex flex-col gap-6 order-2 lg:order-1">
          <PlayerList players={session.players} state={session.state} />
          
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Current Story</h3>
            <div className="space-y-3">
              <h4 className="text-lg font-bold text-slate-800 leading-tight">{session.currentStory.title}</h4>
              <p className="text-sm text-slate-600 line-clamp-4">{session.currentStory.description}</p>
              <button 
                onClick={() => {}} 
                className="text-indigo-600 text-sm font-semibold hover:text-indigo-700"
              >
                Edit Story
              </button>
            </div>
          </div>

          <StoryInput onAddStory={handleNewStory} />
        </aside>

        {/* Center: Voting Table */}
        <section className="flex-1 order-1 lg:order-2">
          <EstimationBoard 
            session={session}
            onVote={handleVote}
            onReveal={handleReveal}
            onReset={handleReset}
          />
        </section>

        {/* Right Side: AI Assistant */}
        <aside className="w-full lg:w-96 order-3">
          <AIAnalyst 
            isAnalyzing={isAnalyzing} 
            analysis={aiAnalysis} 
          />
        </aside>
      </main>

      {/* Footer / Toast area could go here */}
    </div>
  );
};

export default App;
