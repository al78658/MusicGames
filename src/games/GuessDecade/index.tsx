import React, { useState, useEffect } from 'react';
import { getRandomTracks } from '../../services/deezer';
import type { Track } from '../../types';
import { AudioPlayer } from '../../components/AudioPlayer';
import { ScoreDisplay } from '../../components/ScoreDisplay';
import { useStats } from '../../contexts/StatsContext';
import { CheckCircle, XCircle, ArrowRight } from 'lucide-react';

const DECADES = ['70s', '80s', '90s', '2000s', '2010s', '2020s'];

export const GuessDecade: React.FC = () => {
  const { recordGameResult } = useStats();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDecade, setSelectedDecade] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'playing' | 'answered' | 'ended'>('playing');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    loadGameData();
  }, []);

  useEffect(() => {
    let interval: any;
    if (timerActive && gameState === 'playing') {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameState]);

  const loadGameData = async () => {
    setLoading(true);
    const fetched = await getRandomTracks(5);
    setTracks(fetched);
    setCurrentTrackIndex(0);
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setFeedback(null);
    setSelectedDecade(null);
    setSeconds(0);
    setTimerActive(true);
    setLoading(false);
  };

  const currentTrack = tracks[currentTrackIndex];

  const getDecadeFromYear = (yearStr?: string): string => {
    if (!yearStr) return '2010s';
    const year = parseInt(yearStr.split('-')[0]);
    if (year >= 2020) return '2020s';
    if (year >= 2010) return '2010s';
    if (year >= 2000) return '2000s';
    if (year >= 1990) return '90s';
    if (year >= 1980) return '80s';
    return '70s';
  };

  const handleDecadeSelect = (decade: string) => {
    if (gameState !== 'playing') return;
    setTimerActive(false);
    setSelectedDecade(decade);

    const correctDecade = getDecadeFromYear(currentTrack.release_date);
    const isCorrect = decade === correctDecade;

    let pointsGained = 0;
    if (isCorrect) {
      const speedBonus = Math.max(2, 10 - seconds * 0.6);
      pointsGained = Math.round(10 + speedBonus);
      
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(prev => Math.max(prev, newStreak));
      setScore(prev => prev + pointsGained);
      setFeedback({
        correct: true,
        message: `Correto! É dos anos ${correctDecade}. Ganhaste ${pointsGained} pontos (inclui bónus de velocidade).`
      });
    } else {
      setStreak(0);
      setFeedback({
        correct: false,
        message: `Errado! O correto era ${correctDecade} (lançada em ${currentTrack.release_date?.split('-')[0]}).`
      });
    }

    setGameState('answered');
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setSelectedDecade(null);
      setFeedback(null);
      setSeconds(0);
      setGameState('playing');
      setTimerActive(true);
    } else {
      setGameState('ended');
      recordGameResult(
        'guess_decade',
        score >= 50,
        score,
        maxStreak,
        seconds
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">A carregar músicas...</p>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <ScoreDisplay
        score={score}
        maxScore={100}
        won={score >= 50}
        onRestart={loadGameData}
        message={`Fim do Desafio Guess the Decade! Conseguiste adivinhar a época das canções com precisão.`}
      />
    );
  }

  const correctDecade = getDecadeFromYear(currentTrack.release_date);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400">Modo de Jogo</span>
          <h1 className="text-2xl font-extrabold text-teal-400">Guess the Decade</h1>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase text-slate-500 block">Música</span>
            <span className="font-bold text-sm text-white">{currentTrackIndex + 1}/{tracks.length}</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase text-slate-500 block">Pontuação</span>
            <span className="font-bold text-sm text-yellow-400">{score}</span>
          </div>
          <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
            <span className="text-[10px] uppercase text-slate-500 block">Sequência</span>
            <span className="font-bold text-sm text-teal-400">{streak} 🔥</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <AudioPlayer src={currentTrack.preview} autoPlay={true} />

        {/* Decode options grid */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          <h3 className="text-sm font-semibold text-slate-300 mb-4 text-center">
            De que década é esta música?
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {DECADES.map(decade => {
              const isSelected = selectedDecade === decade;
              const isCorrectOption = decade === correctDecade;
              
              let btnClass = "bg-slate-900/40 border-slate-850 hover:bg-slate-800/50 hover:border-slate-800 text-slate-200";
              if (gameState === 'answered') {
                if (isCorrectOption) {
                  btnClass = "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-950/20";
                } else if (isSelected) {
                  btnClass = "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-950/20";
                } else {
                  btnClass = "bg-slate-950 border-slate-900 text-slate-600 cursor-default";
                }
              } else if (isSelected) {
                btnClass = "bg-teal-600 border-teal-500 text-white";
              }

              return (
                <button
                  key={decade}
                  onClick={() => handleDecadeSelect(decade)}
                  disabled={gameState === 'answered'}
                  className={`py-3.5 px-6 rounded-xl border font-bold text-sm transition-all duration-200 ${btnClass}`}
                >
                  {decade}
                </button>
              );
            })}
          </div>

          {/* Feedback display */}
          {gameState === 'answered' && (
            <div className={`p-4 rounded-xl flex items-start gap-3 border mt-6 animate-fade-in ${feedback?.correct ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300' : 'bg-rose-950/40 border-rose-500/20 text-rose-300'}`}>
              {feedback?.correct ? <CheckCircle className="w-6 h-6 flex-shrink-0" /> : <XCircle className="w-6 h-6 flex-shrink-0" />}
              <div>
                <p className="font-bold text-base mb-1">{feedback?.correct ? 'Acertaste!' : 'Errado...'}</p>
                <p className="text-xs opacity-90">{feedback?.message}</p>
              </div>
            </div>
          )}

          {/* Details revealed */}
          {gameState === 'answered' && (
            <div className="mt-6 flex gap-4 items-center animate-fade-in p-4 bg-slate-900/40 rounded-xl border border-slate-800">
              <img
                src={currentTrack.album.cover_medium}
                alt={currentTrack.album.title}
                className="w-16 h-16 rounded-lg object-cover shadow-md"
              />
              <div>
                <h4 className="font-bold text-white text-base">{currentTrack.title}</h4>
                <p className="text-sm text-slate-400">{currentTrack.artist.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">{currentTrack.album.title} • {currentTrack.release_date}</p>
              </div>
            </div>
          )}
        </div>

        {/* Next button */}
        {gameState === 'answered' && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-500/20 transition-all duration-300"
          >
            {currentTrackIndex < tracks.length - 1 ? 'Próxima Música' : 'Ver Resultados'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
