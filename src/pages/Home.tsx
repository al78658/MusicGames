import React from 'react';
import { Link } from 'react-router-dom';
import { useStats } from '../contexts/StatsContext';
import { Music, Trophy, Play, Star, List, Calendar, Flame, Zap, RefreshCw, BarChart2, Hourglass } from 'lucide-react';

const GAME_MODES = [
  {
    id: 'guess_song',
    title: 'Guess the Song',
    description: 'Ouve a música e adivinha o título o mais rápido possível!',
    color: 'from-blue-600 to-indigo-600 text-blue-400 border-blue-500/20',
    icon: Music,
    path: '/game/guess-song'
  },
  {
    id: 'incremental_challenge',
    title: 'Desafio Incremental',
    description: 'Adivinha com trechos progressivos: 1s, 3s, 5s e 10s. Falhar a última significa perder!',
    color: 'from-indigo-600 via-purple-600 to-pink-600 text-purple-400 border-purple-500/20',
    icon: Hourglass,
    path: '/game/incremental-challenge'
  },
  {
    id: 'guess_artist',
    title: 'Guess the Artist',
    description: 'Sabes quem canta? Ouve o preview e identifica o artista.',
    color: 'from-indigo-600 to-purple-600 text-indigo-400 border-indigo-500/20',
    icon: Star,
    path: '/game/guess-artist'
  },
  {
    id: 'music_connections',
    title: 'Music Connections',
    description: 'Agrupa 16 elementos em 4 categorias de ligações comuns.',
    color: 'from-purple-600 to-pink-600 text-purple-400 border-purple-500/20',
    icon: List,
    path: '/game/music-connections'
  },
  {
    id: 'timeline_challenge',
    title: 'Timeline Challenge',
    description: 'Ordena as músicas cronologicamente pela data de lançamento.',
    color: 'from-amber-500 to-orange-600 text-amber-400 border-amber-500/20',
    icon: Calendar,
    path: '/game/timeline-challenge'
  },
  {
    id: 'popularity_ranking',
    title: 'Popularity Ranking',
    description: 'Ordena as músicas ou artistas por popularidade na Deezer.',
    color: 'from-rose-500 to-red-600 text-rose-400 border-rose-500/20',
    icon: Flame,
    path: '/game/popularity-ranking'
  },
  {
    id: 'guess_decade',
    title: 'Guess the Decade',
    description: 'Ouve a faixa e descobre se é dos anos 70, 80, 90, 2000...',
    color: 'from-teal-500 to-emerald-600 text-teal-400 border-teal-500/20',
    icon: BarChart2,
    path: '/game/guess-decade'
  },
  {
    id: 'music_dna',
    title: 'Music DNA',
    description: 'Avalia faixas aleatórias e descobre o teu perfil musical!',
    color: 'from-sky-500 to-blue-600 text-sky-400 border-sky-500/20',
    icon: Zap,
    path: '/game/music-dna'
  }
];

export const Home: React.FC = () => {
  const { stats, resetStats } = useStats();

  const handleReset = () => {
    if (window.confirm("Tens a certeza que queres redefinir todas as tuas estatísticas?")) {
      resetStats();
    }
  };

  const avgResponseTime = stats.overall.totalAnswers > 0
    ? (stats.overall.totalResponseTime / stats.overall.totalAnswers).toFixed(1)
    : '0';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fade-in">
      {/* Header section with Logo */}
      <div className="flex flex-col items-center text-center mb-12 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-2xl shadow-indigo-500/20 mb-4 scale-100 hover:scale-105 transition duration-300">
          <Music className="w-10 h-10 text-white fill-white/10" />
        </div>
        
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
          Sinfonia <span className="text-gradient">Musical</span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-md">
          Desafia os teus conhecimentos e descobre o teu DNA musical com jogos dinâmicos baseados na API Deezer.
        </p>

        <Link
          to="/game/guess-song"
          className="mt-6 px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-bold flex items-center gap-2.5 shadow-xl hover:shadow-indigo-500/20 transition-all duration-300 hover:scale-103 active:scale-98"
        >
          <Play className="w-5 h-5 fill-white" />
          Começar a Jogar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Game Modes List */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-400" />
            Modos de Jogo
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GAME_MODES.map(mode => {
              const Icon = mode.icon;
              return (
                <Link
                  key={mode.id}
                  to={mode.path}
                  className="glass-panel glass-panel-hover p-5 rounded-2xl border flex flex-col items-start text-left group"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${mode.color.split(' ')[0]} ${mode.color.split(' ')[1]} flex items-center justify-center text-white mb-4 shadow-md group-hover:scale-110 transition duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-white text-base mb-1.5">{mode.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed flex-1">{mode.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Stats Panel */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-400" />
              Estatísticas
            </h2>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-rose-400 flex items-center gap-1.5 transition"
              title="Redefinir todas as estatísticas"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Limpar
            </button>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col gap-5">
            {/* Main Counters */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl text-center">
                <span className="text-[10px] uppercase text-slate-500 block mb-1">Jogados</span>
                <span className="font-extrabold text-2xl text-white">{stats.overall.played}</span>
              </div>
              <div className="bg-slate-900/60 border border-slate-850 p-4 rounded-xl text-center">
                <span className="text-[10px] uppercase text-slate-500 block mb-1">Vitórias</span>
                <span className="font-extrabold text-2xl text-emerald-400">{stats.overall.won}</span>
              </div>
            </div>

            {/* Overall stats list */}
            <div className="flex flex-col gap-3.5 text-sm border-t border-slate-800/80 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Recorde de Pontos:</span>
                <span className="font-bold text-white">{stats.overall.bestScore} pts</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Sequência Máxima:</span>
                <span className="font-bold text-teal-400">{stats.overall.maxStreak} 🔥</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Tempo de Resp. Médio:</span>
                <span className="font-bold text-blue-400">{avgResponseTime}s</span>
              </div>
            </div>

            {/* Music DNA Quick Summary */}
            {stats.dnaProfile ? (
              <div className="border-t border-slate-800/80 pt-4 mt-2">
                <span className="text-xs font-bold text-indigo-400 block mb-2">DNA Musical Encontrado</span>
                <div className="bg-slate-900/40 border border-slate-850 p-3 rounded-xl flex flex-col gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Gosto Principal:</span>
                    <span className="font-semibold text-white">{stats.dnaProfile.favoriteGenre}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Década Favorita:</span>
                    <span className="font-semibold text-white">{stats.dnaProfile.favoriteDecade}</span>
                  </div>
                  <Link
                    to="/game/music-dna"
                    className="text-center text-xs text-indigo-400 hover:text-indigo-300 font-semibold mt-1 block"
                  >
                    Ver Perfil Completo →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-800/80 pt-4 mt-2 text-center text-xs text-slate-500">
                Joga o modo <Link to="/game/music-dna" className="text-indigo-400 hover:underline">Music DNA</Link> para gerar o teu perfil musical.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
