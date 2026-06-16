import React from 'react';
import { Trophy, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  won: boolean;
  onRestart: () => void;
  message?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore,
  won,
  onRestart,
  message
}) => {
  return (
    <div className="glass-panel max-w-md w-full mx-auto rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl animate-fade-in border border-slate-800">
      <div className="w-20 h-20 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center mb-6">
        <Trophy className={`w-10 h-10 ${won ? 'text-yellow-400 animate-bounce-slow' : 'text-slate-400'}`} />
      </div>

      <h2 className="text-3xl font-bold mb-2">
        {won ? 'Parabéns!' : 'Fim de Jogo!'}
      </h2>

      {message && <p className="text-slate-300 mb-6 text-sm max-w-xs">{message}</p>}

      <div className="bg-slate-900/60 rounded-2xl py-4 px-8 mb-8 border border-slate-800/80">
        <span className="text-xs uppercase tracking-wider text-slate-400 block mb-1">Pontuação Final</span>
        <span className="text-5xl font-extrabold text-blue-400">
          {score}
          {maxScore !== undefined && <span className="text-2xl text-slate-500 font-medium">/{maxScore}</span>}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button
          onClick={onRestart}
          className="flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-500 active:scale-98 transition rounded-xl font-semibold flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          Jogar Novamente
        </button>
        <Link
          to="/"
          className="flex-1 py-3.5 px-6 bg-slate-850 hover:bg-slate-800 active:scale-98 transition rounded-xl font-semibold flex items-center justify-center gap-2 border border-slate-700/60"
        >
          <ArrowLeft className="w-5 h-5" />
          Menu Principal
        </Link>
      </div>
    </div>
  );
};
