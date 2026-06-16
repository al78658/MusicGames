import React, { useState, useEffect } from 'react';
import { getConnectionsData } from '../../services/deezer';
import { ScoreDisplay } from '../../components/ScoreDisplay';
import { useStats } from '../../contexts/StatsContext';
import { Heart, RefreshCw, AlertCircle, HelpCircle } from 'lucide-react';

interface ConnectionItem {
  id: string;
  text: string;
  groupId: number;
}

interface ConnectionGroup {
  id: number;
  name: string;
}

const COLOR_SOLID: Record<number, string> = {
  0: 'bg-yellow-600 text-white',
  1: 'bg-emerald-600 text-white',
  2: 'bg-blue-600 text-white',
  3: 'bg-purple-600 text-white',
};

export const MusicConnections: React.FC = () => {
  const { recordGameResult } = useStats();
  const [items, setItems] = useState<ConnectionItem[]>([]);
  const [groups, setGroups] = useState<ConnectionGroup[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [solvedGroups, setSolvedGroups] = useState<number[]>([]);
  const [lives, setLives] = useState(4);
  const [gameState, setGameState] = useState<'playing' | 'ended'>('playing');
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    setLoading(true);
    setSelectedIds([]);
    setSolvedGroups([]);
    setLives(4);
    setScore(0);
    setFeedback(null);
    setGameState('playing');

    const data = await getConnectionsData();
    setItems(data.items);
    setGroups(data.groups);
    setLoading(false);
  };

  const handleItemClick = (id: string) => {
    if (gameState !== 'playing') return;
    setFeedback(null);

    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const checkSelection = () => {
    if (selectedIds.length !== 4) return;

    // Get the items based on selection
    const selectedItems = items.filter(item => selectedIds.includes(item.id));
    const firstGroupId = selectedItems[0].groupId;
    
    // Check if all selected items share the same group ID
    const isCorrect = selectedItems.every(item => item.groupId === firstGroupId);

    if (isCorrect) {
      // Add to solved groups
      setSolvedGroups([...solvedGroups, firstGroupId]);
      setSelectedIds([]);
      setFeedback(`Excelente! Encontraste o grupo: "${groups[firstGroupId].name}"`);
      
      const newScore = score + 25;
      setScore(newScore);

      // Check if all groups solved
      if (solvedGroups.length + 1 === 4) {
        setGameState('ended');
        recordGameResult('music_connections', true, newScore, 4);
      }
    } else {
      // Wrong guess
      const nextLives = lives - 1;
      setLives(nextLives);

      // Check if they were "One away"
      const counts: Record<number, number> = {};
      selectedItems.forEach(item => {
        counts[item.groupId] = (counts[item.groupId] || 0) + 1;
      });
      const oneAway = Object.values(counts).some(count => count === 3);
      
      if (oneAway) {
        setFeedback("Faltou apenas 1 música para completar o grupo!");
      } else {
        setFeedback("Combinação incorreta.");
      }

      setSelectedIds([]);

      if (nextLives <= 0) {
        setGameState('ended');
        recordGameResult('music_connections', false, score, 0);
      }
    }
  };

  const getUnsolvedItems = () => {
    return items.filter(item => !solvedGroups.includes(item.groupId));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">A criar grupos musicais...</p>
      </div>
    );
  }

  if (gameState === 'ended') {
    const won = solvedGroups.length === 4;
    return (
      <ScoreDisplay
        score={score}
        maxScore={100}
        won={won}
        onRestart={loadGameData}
        message={
          won
            ? "Fantástico! Conseguiste resolver todas as conexões musicais."
            : "Esgotaste as tuas tentativas. Os grupos eram: " + groups.map(g => g.name).join(", ")
        }
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400">Modo de Jogo</span>
          <h1 className="text-2xl font-extrabold text-purple-400">Music Connections</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-1">
            <span className="text-xs text-slate-500 mr-1">Vidas:</span>
            {Array.from({ length: 4 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-slate-700'}`}
              />
            ))}
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase text-slate-500 block">Pontuação</span>
            <span className="font-bold text-sm text-yellow-400">{score}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Instructions banner */}
        <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
          <HelpCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-slate-300 leading-relaxed">
            Agrupa as 16 músicas/artistas em 4 grupos de 4 elements que partilham uma relação comum (ex: Big Four do Thrash Metal, Músicas de 2008, etc.). Seleciona 4 elementos e clica em Verificar.
          </p>
        </div>

        {/* Feedback message */}
        {feedback && (
          <div className="bg-slate-900/80 border border-slate-850 px-4 py-3 rounded-xl text-center text-sm font-semibold text-purple-300 flex items-center justify-center gap-2 animate-pulse">
            <AlertCircle className="w-4 h-4" />
            {feedback}
          </div>
        )}

        {/* Completed Groups Display */}
        <div className="flex flex-col gap-3">
          {solvedGroups.map(groupId => (
            <div
              key={groupId}
              className={`w-full py-4 px-6 rounded-xl border flex flex-col items-center justify-center font-bold text-center text-sm shadow-md animate-fade-in ${COLOR_SOLID[groupId]}`}
            >
              <span className="text-xs uppercase opacity-85 tracking-widest mb-1">Grupo Resolvido</span>
              <span className="text-lg">{groups[groupId].name}</span>
              <span className="text-xs font-normal opacity-90 mt-1">
                {items.filter(item => item.groupId === groupId).map(i => i.text).join(" • ")}
              </span>
            </div>
          ))}
        </div>

        {/* Connections Grid */}
        {getUnsolvedItems().length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {getUnsolvedItems().map(item => {
              const isSelected = selectedIds.includes(item.id);
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`h-24 p-3 rounded-xl border font-bold text-xs flex items-center justify-center text-center transition-all duration-200 select-none ${
                    isSelected
                      ? 'bg-purple-600 border-purple-400 text-white shadow-lg scale-98'
                      : 'bg-slate-900/40 border-slate-850 hover:bg-slate-900/80 hover:border-slate-800 text-slate-200'
                  }`}
                >
                  {item.text}
                </button>
              );
            })}
          </div>
        )}

        {/* Control Buttons */}
        <div className="flex gap-4">
          <button
            onClick={loadGameData}
            className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl font-bold flex items-center justify-center gap-2 transition"
          >
            <RefreshCw className="w-4 h-4" />
            Reiniciar Grelha
          </button>
          
          <button
            onClick={checkSelection}
            disabled={selectedIds.length !== 4}
            className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:border-transparent text-white border border-purple-500 rounded-xl font-bold flex items-center justify-center gap-2 transition"
          >
            Verificar ({selectedIds.length}/4)
          </button>
        </div>
      </div>
    </div>
  );
};
