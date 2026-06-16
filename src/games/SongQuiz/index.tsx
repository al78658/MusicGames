import React, { useState, useEffect } from 'react';
import { getRandomTracks, searchTracks, filterUniqueArtists } from '../../services/deezer';
import type { Track } from '../../types';
import { AudioPlayer } from '../../components/AudioPlayer';
import { ScoreDisplay } from '../../components/ScoreDisplay';
import { useStats } from '../../contexts/StatsContext';
import { HelpCircle, CheckCircle, XCircle, ArrowRight, Eye, Music, Radio, Flame, Sparkles } from 'lucide-react';

const CATEGORIES = [
  { id: 'all_time', name: 'All Time Bests', desc: 'Os maiores êxitos de sempre a nível global.', icon: Sparkles, query: 'hits' },
  { id: 'rock', name: 'Rock & Metal', desc: 'Clássicos da guitarra, grunge, heavy metal e rock alternativo.', icon: Flame, query: 'rock' },
  { id: 'pop', name: 'Pop & Dance', desc: 'As músicas pop mais cativantes e ritmos de pista de dança.', icon: Music, query: 'pop' },
  { id: 'hiphop', name: 'Hip-Hop & Rap', desc: 'Grandes batidas, flow marcante e rimas clássicas.', icon: Radio, query: 'rap' }
];

const CATEGORY_ARTISTS: Record<string, string[]> = {
  all_time: ["Michael Jackson", "Queen", "Nirvana", "Adele", "Coldplay", "The Weeknd", "Harry Styles", "Taylor Swift", "Bruno Mars", "Ed Sheeran", "David Bowie", "Led Zeppelin", "AC/DC", "Beatles", "Pink Floyd"],
  rock: ["AC/DC", "Metallica", "Queen", "Nirvana", "Guns N' Roses", "Linkin Park", "Led Zeppelin", "Pink Floyd", "Bon Jovi", "Red Hot Chili Peppers", "Green Day", "Gorillaz", "Scorpions"],
  pop: ["Katy Perry", "Taylor Swift", "Ed Sheeran", "Lady Gaga", "Harry Styles", "Billie Eilish", "Bruno Mars", "Dua Lipa", "The Weeknd", "Miley Cyrus", "Rihanna", "Shakira", "Beyonce", "Britney Spears"],
  hiphop: ["Eminem", "Dr. Dre", "Drake", "Kanye West", "Travis Scott", "Kendrick Lamar", "Post Malone", "Jay-Z", "Snoop Dogg", "Lil Wayne"]
};

export const SongQuiz: React.FC = () => {
  const { recordGameResult } = useStats();
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[0] | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [guess, setGuess] = useState('');
  const [hintsUsed, setHintsUsed] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'category_select' | 'playing' | 'answered' | 'ended'>('category_select');
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [audioError, setAudioError] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timerActive && gameState === 'playing') {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, gameState]);

  const handleSelectCategory = async (category: typeof CATEGORIES[0]) => {
    setSelectedCategory(category);
    setLoading(true);
    setGameState('playing');
    setScore(0);
    setStreak(0);
    setHintsUsed([]);
    setFeedback(null);
    setGuess('');
    setSeconds(0);
    setAudioError(false);

    try {
      // Pick 3 random artists from the category to avoid repeating or noisy results
      const artists = CATEGORY_ARTISTS[category.id] || CATEGORY_ARTISTS.all_time;
      const selected = [...artists].sort(() => Math.random() - 0.5).slice(0, 3);
      const query = selected.map(a => `"${a}"`).join(" OR ");

      // Fetch tracks based on the category's smart query
      const fetched = await searchTracks(query);
      
      // Shuffle and take 5 tracks with unique artists
      const shuffled = filterUniqueArtists([...fetched].sort(() => Math.random() - 0.5), 5);
      
      if (shuffled.length > 0) {
        setTracks(shuffled);
      } else {
        // Fallback
        const fallback = await getRandomTracks(5);
        setTracks(fallback);
      }
    } catch (error) {
      console.error("Failed to load category tracks", error);
      const fallback = await getRandomTracks(5);
      setTracks(fallback);
    }
    
    setTimerActive(true);
    setLoading(false);
  };

  const handleReplaceTrack = async () => {
    if (!selectedCategory) return;
    setLoading(true);
    try {
      const artists = CATEGORY_ARTISTS[selectedCategory.id] || CATEGORY_ARTISTS.all_time;
      const selected = [...artists].sort(() => Math.random() - 0.5).slice(0, 3);
      const query = selected.map(a => `"${a}"`).join(" OR ");

      const fetched = await searchTracks(query);
      if (fetched && fetched.length > 0) {
        const ids = new Set(tracks.map(t => t.id));
        const newTrack = fetched.find(t => !ids.has(t.id)) || fetched[Math.floor(Math.random() * fetched.length)];
        
        if (newTrack) {
          const updated = [...tracks];
          updated[currentTrackIndex] = newTrack;
          setTracks(updated);
          setGuess('');
          setHintsUsed([]);
          setFeedback(null);
          setSeconds(0);
          setAudioError(false);
          setTimerActive(true);
        }
      }
    } catch (err) {
      console.error("Failed to replace track:", err);
    } finally {
      setLoading(false);
    }
  };

  const currentTrack = tracks[currentTrackIndex];

  const handleRevealHint = (type: 'artist' | 'year' | 'album') => {
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
    const correctTitle = currentTrack.title_short || currentTrack.title;
    const isCorrect = isGuessCorrect(guess, correctTitle);

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
        message: `Errado! O nome da música era: "${correctTitle}".`
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
      setAudioError(false);
      setGameState('playing');
      setTimerActive(true);
    } else {
      setGameState('ended');
      recordGameResult(
        'song_quiz',
        score >= 50,
        score,
        streak,
        seconds
      );
    }
  };

  const handleRestartCategorySelect = () => {
    setSelectedCategory(null);
    setTracks([]);
    setCurrentTrackIndex(0);
    setGameState('category_select');
  };

  if (gameState === 'category_select') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-10">
          <span className="text-xs uppercase tracking-wider text-slate-500">Novo Modo Principal</span>
          <h1 className="text-3xl font-extrabold text-gradient mb-2">Desafio Temático</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Escolhe uma categoria ou estilo musical preferido e adivinha as faixas que vamos carregar diretamente da API.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category)}
                className="glass-panel glass-panel-hover p-6 rounded-2xl border border-slate-850 text-left flex flex-col items-start"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white mb-4">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white text-lg mb-1">{category.name}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{category.desc}</p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="relative w-24 h-24 rounded-full bg-slate-900 border-4 border-slate-800 flex items-center justify-center shadow-2xl animate-spin" style={{ animationDuration: '3s' }}>
          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-slate-900 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-900" />
          </div>
          <div className="absolute inset-2 rounded-full border border-dashed border-slate-700/40" />
          <div className="absolute inset-4 rounded-full border border-dashed border-slate-700/30" />
          <div className="absolute inset-6 rounded-full border border-dashed border-slate-700/20" />
        </div>
        <p className="text-slate-400 font-semibold animate-pulse text-sm">A carregar temas da categoria...</p>
      </div>
    );
  }

  if (gameState === 'ended') {
    return (
      <ScoreDisplay
        score={score}
        maxScore={100}
        won={score >= 50}
        onRestart={handleRestartCategorySelect}
        message={`Terminaste o Desafio Temático em "${selectedCategory?.name}"! Fizeste uma grande pontuação.`}
      />
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400">Categoria: {selectedCategory?.name}</span>
          <h1 className="text-2xl font-extrabold text-blue-400">Desafio Temático</h1>
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
        <AudioPlayer
          src={currentTrack.preview}
          autoPlay={true}
          onAudioError={() => setAudioError(true)}
        />

        {audioError && gameState === 'playing' && (
          <div className="flex justify-center -mt-2">
            <button
              onClick={handleReplaceTrack}
              className="px-4 py-2 text-xs bg-slate-900/80 hover:bg-slate-800 border border-slate-850 text-blue-400 font-semibold rounded-xl transition-all duration-250 active:scale-95 flex items-center gap-1.5 shadow-md"
            >
              ⚠️ Áudio com erro? Substituir Música
            </button>
          </div>
        )}

        {/* Input area */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800">
          {gameState === 'playing' ? (
            <form onSubmit={handleGuessSubmit} className="flex flex-col gap-4">
              <label htmlFor="quiz-guess" className="text-sm font-semibold text-slate-300">
                Qual é o nome desta música?
              </label>
              <div className="flex gap-3">
                <input
                  id="quiz-guess"
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  placeholder="Digita a tua resposta..."
                  className="flex-1 px-4 py-3 bg-slate-900/90 rounded-xl border border-slate-850 focus:border-blue-500 focus:outline-none transition text-white"
                  autoFocus
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!guess.trim()}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 transition rounded-xl font-bold active:scale-95"
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
              <HelpCircle className="w-4 h-4 text-blue-400" />
              Dicas Disponíveis <span className="text-[11px] font-normal text-slate-500">(Cada dica custa 4 pontos)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => handleRevealHint('artist')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('artist') ? 'bg-slate-900 border-slate-800 text-blue-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
              >
                <span>Artista:</span>
                {hintsUsed.includes('artist') ? <span className="font-semibold">{currentTrack.artist.name}</span> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleRevealHint('year')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('year') ? 'bg-slate-900 border-slate-800 text-blue-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
              >
                <span>Ano de Lançamento:</span>
                {hintsUsed.includes('year') ? <span className="font-semibold">{currentTrack.release_date?.split('-')[0]}</span> : <Eye className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => handleRevealHint('album')}
                className={`py-2 px-3 rounded-lg border text-left flex justify-between items-center text-xs transition ${hintsUsed.includes('album') ? 'bg-slate-900 border-slate-800 text-blue-300' : 'bg-slate-900/30 border-slate-850 hover:bg-slate-800/50 text-slate-400'}`}
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
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300"
          >
            {currentTrackIndex < tracks.length - 1 ? 'Próxima Música' : 'Ver Resultados'}
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};
