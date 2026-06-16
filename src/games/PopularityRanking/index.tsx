import React, { useState, useEffect } from 'react';
import { getRandomTracks } from '../../services/deezer';
import type { Track } from '../../types';
import { ScoreDisplay } from '../../components/ScoreDisplay';
import { useStats } from '../../contexts/StatsContext';
import { Flame, ArrowUp, ArrowDown, Check, HelpCircle } from 'lucide-react';

export const PopularityRanking: React.FC = () => {
  const { recordGameResult } = useStats();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [shuffledTracks, setShuffledTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'playing' | 'answered' | 'ended'>('playing');
  const [score, setScore] = useState(0);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    setLoading(true);
    setGameState('playing');
    setScore(0);

    // Fetch 5 random tracks
    const fetched = await getRandomTracks(5);
    
    // Sort tracks by Deezer rank (highest first) as correct answer
    const sorted = [...fetched].sort((a, b) => (b.rank || 0) - (a.rank || 0));
    setTracks(sorted);

    // Shuffle tracks for player
    let shuffled = [...fetched];
    while (JSON.stringify(shuffled.map(t => t.id)) === JSON.stringify(sorted.map(t => t.id))) {
      shuffled.sort(() => Math.random() - 0.5);
    }
    setShuffledTracks(shuffled);
    setLoading(false);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (gameState !== 'playing') return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= shuffledTracks.length) return;

    const newArr = [...shuffledTracks];
    const temp = newArr[index];
    newArr[index] = newArr[targetIndex];
    newArr[targetIndex] = temp;
    setShuffledTracks(newArr);
  };

  const handleDragStart = (index: number) => {
    if (gameState !== 'playing') return;
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index || gameState !== 'playing') return;

    const newArr = [...shuffledTracks];
    const draggedItem = newArr[draggedIndex];
    newArr.splice(draggedIndex, 1);
    newArr.splice(index, 0, draggedItem);
    
    setDraggedIndex(index);
    setShuffledTracks(newArr);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const checkRanking = () => {
    setGameState('answered');

    // Score based on distance/correlation or simple match
    let correctCount = 0;
    shuffledTracks.forEach((track, index) => {
      if (track.id === tracks[index].id) {
        correctCount += 1;
      }
    });

    const points = correctCount * 20; // Max 100 points
    setScore(points);
  };

  const handleNext = () => {
    setGameState('ended');
    recordGameResult('popularity_ranking', score >= 60, score, score === 100 ? 1 : 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">A obter dados de popularidade...</p>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <ScoreDisplay
        score={score}
        maxScore={100}
        won={score >= 60}
        onRestart={loadGameData}
        message={`Fim do Ranking de Popularidade! Conseguiste estimar qual música tem mais reproduções na API.`}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400">Modo de Jogo</span>
          <h1 className="text-2xl font-extrabold text-rose-400 font-mono">Popularity Ranking</h1>
        </div>
        <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] uppercase text-slate-500 block">Pontos</span>
          <span className="font-bold text-sm text-yellow-400">{score}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            Ordena as músicas da mais popular/ouvida (topo) para a menos popular (fundo), de acordo com os dados da API Deezer. Arrasta os cartões ou usa as setas. Clica em "Verificar Popularidade" quando terminares.
          </p>
        </div>

        {/* Popularity track list */}
        <div className="flex flex-col gap-3">
          {shuffledTracks.map((track, index) => {
            const isCorrectAnswer = gameState === 'answered' && track.id === tracks[index].id;
            const originalPosition = tracks.findIndex(t => t.id === track.id);
            
            return (
              <div
                key={track.id}
                draggable={gameState === 'playing'}
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`glass-panel p-4 rounded-xl border flex items-center gap-4 transition-all duration-200 cursor-grab active:cursor-grabbing select-none ${
                  draggedIndex === index ? 'opacity-50 scale-95 border-rose-500' : ''
                } ${
                  gameState === 'answered'
                    ? isCorrectAnswer
                      ? 'border-emerald-500 bg-emerald-950/20'
                      : 'border-rose-500 bg-rose-950/20'
                    : 'border-slate-850'
                }`}
              >
                {/* Positional index */}
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-slate-400">
                  {index + 1}
                </div>

                <img
                  src={track.album.cover_medium}
                  alt={track.album.title}
                  className="w-14 h-14 rounded-lg object-cover shadow-sm pointer-events-none"
                />

                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-sm text-white truncate pointer-events-none">{track.title}</h4>
                  <p className="text-xs text-slate-400 truncate pointer-events-none">{track.artist.name}</p>
                  
                  {gameState === 'answered' && (
                    <div className="flex items-center gap-1 mt-1 animate-fade-in text-[11px]">
                      <Flame className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      <span className="font-semibold text-rose-300">
                        Rank: {(track.rank || 0).toLocaleString()}
                      </span>
                      {!isCorrectAnswer && (
                        <span className="text-rose-400 font-medium ml-1">
                          (Deveria ser #{originalPosition + 1})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Arrow handles / correctness display */}
                {gameState === 'playing' ? (
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:hover:bg-slate-850"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === shuffledTracks.length - 1}
                      className="p-1 rounded bg-slate-850 hover:bg-slate-800 text-slate-400 disabled:opacity-30 disabled:hover:bg-slate-850"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    {isCorrectAnswer ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-rose-400">#{originalPosition + 1}</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        {gameState === 'playing' ? (
          <button
            onClick={checkRanking}
            className="w-full py-4 bg-rose-500 hover:bg-rose-400 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
          >
            Verificar Popularidade
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-slate-950 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300"
          >
            Avançar
          </button>
        )}
      </div>
    </div>
  );
};
