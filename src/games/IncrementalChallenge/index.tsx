import React, { useState, useEffect } from 'react';
import { getRandomTracks } from '../../services/deezer';
import type { Track } from '../../types';
import { AudioPlayer } from '../../components/AudioPlayer';
import { ScoreDisplay } from '../../components/ScoreDisplay';
import { useStats } from '../../contexts/StatsContext';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, Eye, Hourglass } from 'lucide-react';

const ATTEMPTS_CONFIG = [
  { attempt: 1, duration: 1, points: 20, label: '1 segundo' },
  { attempt: 2, duration: 3, points: 15, label: '3 segundos' },
  { attempt: 3, duration: 5, points: 10, label: '5 segundos' },
  { attempt: 4, duration: 10, points: 5, label: '10 segundos (Última Oportunidade!)' }
];

export const IncrementalChallenge: React.FC = () => {
  const { recordGameResult } = useStats();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [guess, setGuess] = useState('');
  const [hintsUsed, setHintsUsed] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'answered' | 'ended'>('playing');
  const [currentAttemptIdx, setCurrentAttemptIdx] = useState(0); // Index in ATTEMPTS_CONFIG
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [audioError, setAudioError] = useState(false);

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
    setCurrentAttemptIdx(0);
    setScore(0);
    setStreak(0);
    setHintsUsed([]);
    setFeedback(null);
    setGuess('');
    setSeconds(0);
    setAudioError(false);
    setTimerActive(true);
    setLoading(false);
  };

  const handleReplaceTrack = async () => {
    setLoading(true);
    try {
      const newTracks = await getRandomTracks(1);
      if (newTracks && newTracks.length > 0) {
        const updated = [...tracks];
        updated[currentTrackIndex] = newTracks[0];
        setTracks(updated);
        setGuess('');
        setHintsUsed([]);
        setFeedback(null);
        setCurrentAttemptIdx(0);
        setSeconds(0);
        setAudioError(false);
        setTimerActive(true);
      }
    } catch (err) {
      console.error("Failed to replace track:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentTrack = tracks[currentTrackIndex];
  const activeAttempt = ATTEMPTS_CONFIG[currentAttemptIdx];

  if (!currentTrack && !loading) {
    return (
      <div className="text-center text-slate-400 py-12 animate-fade-in">
        Nenhuma música disponível. Tente voltar ao menu ou reiniciar.
      </div>
    );
  }

  const handleRevealHint = (type: 'artist' | 'year' | 'album') => {
    if (!hintsUsed.includes(type)) {
      setHintsUsed([...hintsUsed, type]);
    }
  };

  const normalizeString = (str: string) => {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^\w\s]/gi, '') // Remove symbols
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

    const correctTitle = currentTrack.title_short || currentTrack.title;
    const isCorrect = isGuessCorrect(guess, correctTitle);

    if (isCorrect) {
      setTimerActive(false);
      // Correct guess: Player wins this track round
      const hintDeduction = hintsUsed.length * 2;
      const pointsGained = Math.max(1, activeAttempt.points - hintDeduction);
      
      setScore(prev => prev + pointsGained);
      setStreak(prev => prev + 1);
      setFeedback({
        correct: true,
        message: `Correto! Acertaste na tentativa de ${activeAttempt.label} e ganhaste ${pointsGained} pontos!`
      });
      setGameState('answered');
    } else {
      // Incorrect guess
      if (currentAttemptIdx < ATTEMPTS_CONFIG.length - 1) {
        // Increment attempt
        const nextAttempt = ATTEMPTS_CONFIG[currentAttemptIdx + 1];
        setCurrentAttemptIdx(prev => prev + 1);
        setGuess('');
        // Show temporary feedback and let them play again
        setFeedback({
          correct: false,
          message: `Incorreto! O áudio foi aumentado para ${nextAttempt.label}. Tenta de novo!`
        });
      } else {
        // Failed the final attempt (10s)
        setTimerActive(false);
        setStreak(0);
        setFeedback({
          correct: false,
          message: `Errado na tentativa final! Não conseguiste adivinhar. O nome da música era: "${correctTitle}".`
        });
        setGameState('answered');
      }
    }
  };

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      setCurrentTrackIndex(prev => prev + 1);
      setGuess('');
      setHintsUsed([]);
      setFeedback(null);
      setCurrentAttemptIdx(0);
      setSeconds(0);
      setAudioError(false);
      setGameState('playing');
      setTimerActive(true);
    } else {
      setGameState('ended');
      // Save stats
      recordGameResult(
        'incremental_challenge',
        score >= 40, // Win threshold of 40 pts
        score,
        streak,
        seconds
      );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl animate-spin" style={{ animationDuration: '3s' }}>
          <div className="w-8 h-8 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-900" />
          </div>
          <div className="absolute inset-2 rounded-full border border-dashed border-slate-700/40" />
          <div className="absolute inset-4 rounded-full border border-dashed border-slate-700/30" />
          <div className="absolute inset-6 rounded-full border border-dashed border-slate-700/20" />
        </div>
        <p className="text-slate-400 font-semibold animate-pulse text-sm">A carregar músicas...</p>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <ScoreDisplay
        score={score}
        maxScore={100}
        won={score >= 40}
        onRestart={loadGameData}
        message={`Terminaste o Desafio Incremental! Conseguiste somar ${score} pontos adivinhando músicas pelos seus trechos mais curtos.`}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400">Modo de Jogo</span>
          <h1 className="text-2xl font-extrabold text-indigo-400 flex items-center gap-1.5">
            <Hourglass className="w-6 h-6 animate-pulse text-indigo-400" />
            Desafio Incremental
          </h1>
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
        {/* We use key={currentTrack.id + '-' + activeAttempt.duration} to force a reload when the duration increases */}
        <AudioPlayer
          key={`${currentTrack.id}-${activeAttempt.duration}`}
          src={currentTrack.preview}
          autoPlay={true}
          maxDuration={activeAttempt.duration}
          onAudioError={() => setAudioError(true)}
        />

        {/* Step indicator */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 flex justify-between items-center bg-slate-950/40">
          <div className="flex flex-col">
            <span className="text-xs text-slate-400">Trecho Atual</span>
            <span className="text-base font-bold text-white uppercase tracking-wider">
              {activeAttempt.label}
            </span>
          </div>
          <div className="flex gap-2">
            {ATTEMPTS_CONFIG.map((conf, idx) => (
              <div
                key={conf.attempt}
                className={`w-8 h-8 rounded-full border flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  idx === currentAttemptIdx && gameState === 'playing'
                    ? 'bg-indigo-600 border-indigo-400 text-white scale-110 shadow-lg shadow-indigo-900/30'
                    : idx < currentAttemptIdx
                    ? 'bg-slate-800 border-slate-700 text-slate-500 line-through'
                    : 'bg-slate-900/60 border-slate-850 text-slate-400'
                }`}
                title={`Tentativa ${conf.attempt}: ${conf.duration}s`}
              >
                {conf.duration}s
              </div>
            ))}
          </div>
        </div>

        {audioError && gameState === 'playing' && (
          <div className="flex justify-center -mt-2">
            <button
              onClick={handleReplaceTrack}
              className="px-4 py-2 text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-850 text-yellow-400 font-semibold rounded-xl transition-all duration-250 active:scale-95 flex items-center gap-1.5 shadow-md"
            >
              ⚠️ Áudio com erro? Substituir Música
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          {gameState === 'playing' ? (
            <form onSubmit={handleGuessSubmit} className="flex flex-col gap-4">
              <label htmlFor="song-guess" className="text-sm font-semibold text-slate-300">
                Qual é o nome desta música?
              </label>
              
              {feedback && !feedback.correct && (
                <div className="p-3 bg-orange-950/35 border border-orange-500/10 text-orange-300 rounded-xl text-xs flex items-center gap-2">
                  <span className="text-base">❌</span>
                  <span>{feedback.message}</span>
                </div>
              )}

              <div className="flex gap-3">
                <input
                  id="song-guess"
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Digita a tua resposta..."
                  className="flex-1 px-4 py-3 bg-slate-900/90 rounded-xl border border-slate-850 focus:border-indigo-500 focus:outline-none transition text-white"
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!guess.trim()}
                  className="px-6 py-3 bg-indigo-650 hover:bg-indigo-550 disabled:bg-slate-800 disabled:text-slate-500 transition rounded-xl font-bold active:scale-95 text-white"
                >
                  Enviar
                </button>
              </div>
            </form>
          ) : (
            <div className={`p-4 rounded-xl flex items-start gap-3 border ${feedback?.correct ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-300' : 'bg-rose-950/40 border-rose-500/20 text-rose-300'}`}>
              {feedback?.correct ? <CheckCircle className="w-6 h-6 flex-shrink-0" /> : <XCircle className="w-6 h-6 flex-shrink-0" />}
              <div>
                <p className="font-bold text-lg mb-1">{feedback?.correct ? 'Acertaste!' : 'Fim das Tentativas'}</p>
                <p className="text-sm opacity-90">{feedback?.message}</p>
              </div>
            </div>
          )}

          {/* Reveal info once answered */}
          {gameState === 'answered' && (
            <div className="mt-6 flex gap-4 items-center animate-fade-in p-4 bg-slate-900/40 rounded-xl border border-slate-800">
              <img
                src={currentTrack.album.cover_medium || "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e293b'/><circle cx='50' cy='50' r='40' fill='%230f172a' stroke='%23334155' stroke-width='2'/><circle cx='50' cy='50' r='15' fill='%236366f1'/><circle cx='50' cy='50' r='4' fill='%230f172a'/></svg>"}
                alt={currentTrack.album.title}
                className="w-16 h-16 rounded-lg object-cover shadow-md"
                onError={(e) => {
                  e.currentTarget.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'><rect width='100' height='100' fill='%231e293b'/><circle cx='50' cy='50' r='40' fill='%230f172a' stroke='%23334155' stroke-width='2'/><circle cx='50' cy='50' r='15' fill='%236366f1'/><circle cx='50' cy='50' r='4' fill='%230f172a'/></svg>";
                }}
              />
              <div>
                <h4 className="font-bold text-white text-base">{currentTrack.title}</h4>
                <p className="text-sm text-slate-400">{currentTrack.artist.name}</p>
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
              Dicas Disponíveis <span className="text-[11px] font-normal text-slate-500">(Cada dica reduz 2 pontos do valor final do acerto)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleRevealHint('artist')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('artist') ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
              >
                <span>Artista:</span>
                {hintsUsed.includes('artist') ? <span className="font-semibold">{currentTrack.artist.name}</span> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleRevealHint('year')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('year') ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
              >
                <span>Ano de Lançamento:</span>
                {hintsUsed.includes('year') ? <span className="font-semibold">{currentTrack.release_date?.split('-')[0]}</span> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleRevealHint('album')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('album') ? 'bg-slate-900 border-slate-800 text-indigo-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
              >
                <span>Álbum:</span>
                {hintsUsed.includes('album') ? <span className="font-semibold">{currentTrack.album.title}</span> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        )}

        {/* Next button */}
        {gameState === 'answered' && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 animate-bounce"
          >
            {currentTrackIndex < tracks.length - 1 ? 'Próxima Música' : 'Ver Resultados'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
