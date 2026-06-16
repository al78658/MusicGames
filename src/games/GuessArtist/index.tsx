import React, { useState, useEffect } from 'react';
import { getRandomTracks } from '../../services/deezer';
import type { Track } from '../../types';
import { AudioPlayer } from '../../components/AudioPlayer';
import { ScoreDisplay } from '../../components/ScoreDisplay';
import { useStats } from '../../contexts/StatsContext';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, Eye } from 'lucide-react';

export const GuessArtist: React.FC = () => {
  const { recordGameResult } = useStats();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState('');
  const [hintsUsed, setHintsUsed] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'answered' | 'ended'>('playing');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
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
    setHintsUsed([]);
    setFeedback(null);
    setGuess('');
    setSeconds(0);
    setTimerActive(true);
    setLoading(false);
  };

  const currentTrack = tracks[currentTrackIndex];

  const handleRevealHint = (type: 'title' | 'year' | 'genre') => {
    if (!hintsUsed.includes(type)) {
      setHintsUsed([...hintsUsed, type]);
    }
  };

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const isGuessCorrect = (userInput: string, answer: string): boolean => {
    const normGuess = normalizeString(userInput);
    const normAnswer = normalizeString(answer);
    
    if (normGuess === normAnswer) return true;
    
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'o', 'os', 'as', 'de', 'do', 'da', 'em', 'um', 'uma', 'to', 'for', 'of', 'in', 'on', 'with', 'by']);
    
    const guessWords = normGuess.split(' ').filter(w => w.length > 1 && !stopWords.has(w));
    const answerWords = normAnswer.split(' ').filter(w => w.length > 1 && !stopWords.has(w));
    
    if (guessWords.length === 0 || answerWords.length === 0) return false;
    
    return guessWords.some(gWord => answerWords.includes(gWord)) || 
           answerWords.some(aWord => guessWords.includes(aWord));
  };

  const handleGuessSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!guess.trim() || gameState !== 'playing') return;

    setTimerActive(false);
    const correctArtist = currentTrack.artist.name;
    const isCorrect = isGuessCorrect(guess, correctArtist);

    let pointsGained = 0;
    if (isCorrect) {
      const timeDeduction = Math.min(seconds * 0.4, 10);
      const hintDeduction = hintsUsed.length * 4;
      pointsGained = Math.max(2, Math.round(20 - timeDeduction - hintDeduction));
      
      setScore(prev => prev + pointsGained);
      setStreak(prev => prev + 1);
      setFeedback({
        correct: true,
        message: `Correto! Ganhaste ${pointsGained} pontos.`
      });
    } else {
      setStreak(0);
      setFeedback({
        correct: false,
        message: `Errado! O artista era: "${correctArtist}".`
      });
    }

    setGameState('answered');
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setGuess('');
      setHintsUsed([]);
      setFeedback(null);
      setSeconds(0);
      setGameState('playing');
      setTimerActive(true);
    } else {
      setGameState('ended');
      recordGameResult(
        'guess_artist',
        score >= 50,
        score,
        streak,
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
        message={`Terminaste o desafio Adivinha o Artista! Sabes mesmo quem canta as tuas músicas favoritas.`}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400">Modo de Jogo</span>
          <h1 className="text-2xl font-extrabold text-indigo-400">Guess the Artist</h1>
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
            <span className="text-[10px] uppercase text-slate-500 block">Tempo</span>
            <span className="font-bold text-sm text-blue-400">{seconds}s</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <AudioPlayer src={currentTrack.preview} autoPlay={true} />

        {/* Input area */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          {gameState === 'playing' ? (
            <form onSubmit={handleGuessSubmit} className="flex flex-col gap-4">
              <label htmlFor="artist-guess" className="text-sm font-semibold text-slate-300">
                Quem canta ou interpreta esta música?
              </label>
              <div className="flex gap-3">
                <input
                  id="artist-guess"
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Digita o nome do artista..."
                  className="flex-1 px-4 py-3 bg-slate-900/90 rounded-xl border border-slate-850 focus:border-indigo-500 focus:outline-none transition text-white"
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!guess.trim()}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 transition rounded-xl font-bold active:scale-95"
                >
                  Enviar
                </button>
              </div>
            </form>
          ) : (
            <div className={`p-4 rounded-xl flex items-start gap-3 border ${feedback?.correct ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300' : 'bg-rose-950/40 border-rose-500/20 text-rose-300'}`}>
              {feedback?.correct ? <CheckCircle className="w-6 h-6 flex-shrink-0" /> : <XCircle className="w-6 h-6 flex-shrink-0" />}
              <div>
                <p className="font-bold text-lg mb-1">{feedback?.correct ? 'Acertaste!' : 'Quase lá...'}</p>
                <p className="text-sm opacity-90">{feedback?.message}</p>
              </div>
            </div>
          )}

          {/* Reveal info once answered */}
          {gameState === 'answered' && (
            <div className="mt-6 flex gap-4 items-center animate-fade-in p-4 bg-slate-900/40 rounded-xl border border-slate-800">
              <img
                src={currentTrack.album.cover_medium}
                alt={currentTrack.album.title}
                className="w-16 h-16 rounded-lg object-cover shadow-md"
              />
              <div>
                <h4 className="font-bold text-white text-base">{currentTrack.artist.name}</h4>
                <p className="text-sm text-slate-400">Música: {currentTrack.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{currentTrack.album.title} • {currentTrack.release_date?.split('-')[0]}</p>
              </div>
            </div>
          )}
        </div>

        {/* Hints panel */}
        {gameState === 'playing' && (
          <div className="glass-panel p-6 rounded-2xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-slate-400 mb-4 flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-indigo-400" />
              Dicas Disponíveis <span className="text-[11px] font-normal text-slate-500">(Cada dica custa 20 pontos)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleRevealHint('title')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('title') ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
              >
                <span>Título da Música:</span>
                {hintsUsed.includes('title') ? <span className="font-semibold">{currentTrack.title}</span> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleRevealHint('year')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('year') ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
              >
                <span>Ano de Lançamento:</span>
                {hintsUsed.includes('year') ? <span className="font-semibold">{currentTrack.release_date?.split('-')[0]}</span> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleRevealHint('genre')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('genre') ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
              >
                <span>Género:</span>
                {hintsUsed.includes('genre') ? <span className="font-semibold">{currentTrack.genres?.[0] || 'Pop'}</span> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Next button */}
        {gameState === 'answered' && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
          >
            {currentTrackIndex < tracks.length - 1 ? 'Próxima Música' : 'Ver Resultados'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
