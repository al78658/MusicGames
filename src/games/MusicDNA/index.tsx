import React, { useState, useEffect } from 'react';
import { getRandomTracks } from '../../services/deezer';
import type { Track, MusicDNAProfile } from '../../types';
import { AudioPlayer } from '../../components/AudioPlayer';
import { useStats } from '../../contexts/StatsContext';
import { Link } from 'react-router-dom';
import { Disc, Flame, Zap, Award, Calendar } from 'lucide-react';

const RESPONSE_OPTIONS = [
  { value: 'adore', label: 'Adoro', score: 2, color: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/20 text-white' },
  { value: 'like', label: 'Gosto', score: 1, color: 'bg-teal-600 hover:bg-teal-500 shadow-teal-900/20 text-white' },
  { value: 'neutral', label: 'Neutro', score: 0, color: 'bg-slate-700 hover:bg-slate-655 text-slate-100' },
  { value: 'dislike', label: 'Não gosto', score: -1, color: 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20 text-white' },
  { value: 'hate', label: 'Odeio', score: -2, color: 'bg-rose-600 hover:bg-rose-500 shadow-rose-900/20 text-white' }
];

export const MusicDNA: React.FC = () => {
  const { saveDNA } = useStats();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Array<{ track: Track; rating: string; score: number }>>([]);
  const [profile, setProfile] = useState<MusicDNAProfile | null>(null);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    setLoading(true);
    setAnswers([]);
    setProfile(null);
    setCurrentIndex(0);
    // Fetch 25 tracks of varying genres/decades
    const fetched = await getRandomTracks(25);
    setTracks(fetched);
    setLoading(false);
  };

  const handleRateTrack = (ratingValue: string, ratingScore: number) => {
    const nextAnswers = [...answers, { track: tracks[currentIndex], rating: ratingValue, score: ratingScore }];
    setAnswers(nextAnswers);

    if (currentIndex < tracks.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      generateProfile(nextAnswers);
    }
  };

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

  const generateProfile = (finalAnswers: typeof answers) => {
    const genresWeight: Record<string, number> = {};
    const decadesWeight: Record<string, number> = {};
    const artistScores: Record<string, number> = {};

    let totalEnergyScore = 0;

    finalAnswers.forEach(({ track, score }) => {
      // Calculate genres
      const trackGenres = track.genres || ['Pop'];
      trackGenres.forEach(g => {
        genresWeight[g] = (genresWeight[g] || 0) + (score + 3); // Shift offset by 3 to keep positive weights
      });

      // Calculate decades
      const decade = getDecadeFromYear(track.release_date);
      decadesWeight[decade] = (decadesWeight[decade] || 0) + (score + 3);

      // Artist preferences
      const artist = track.artist.name;
      artistScores[artist] = (artistScores[artist] || 0) + score;

      // Energy estimation (based on genres & rank & user response)
      let baseTrackEnergy = 50; // out of 100
      if (trackGenres.includes('Metal') || trackGenres.includes('Rock') || trackGenres.includes('EDM') || trackGenres.includes('Dance')) {
        baseTrackEnergy = 80;
      } else if (trackGenres.includes('Jazz') || trackGenres.includes('Soul')) {
        baseTrackEnergy = 30;
      }
      totalEnergyScore += baseTrackEnergy + (score * 10);
    });

    // Normalize weights to percentages
    const totalGenresWeight = Object.values(genresWeight).reduce((a, b) => a + b, 0) || 1;
    const finalGenres: Record<string, number> = {};
    Object.keys(genresWeight).forEach(k => {
      finalGenres[k] = Math.round((genresWeight[k] / totalGenresWeight) * 100);
    });

    const totalDecadesWeight = Object.values(decadesWeight).reduce((a, b) => a + b, 0) || 1;
    const finalDecades: Record<string, number> = {};
    Object.keys(decadesWeight).forEach(k => {
      finalDecades[k] = Math.round((decadesWeight[k] / totalDecadesWeight) * 100);
    });

    // Find favorites
    let favoriteGenre = 'Pop';
    let maxGVal = -1;
    Object.keys(genresWeight).forEach(k => {
      if (genresWeight[k] > maxGVal) {
        maxGVal = genresWeight[k];
        favoriteGenre = k;
      }
    });

    let favoriteDecade = '2010s';
    let maxDVal = -1;
    Object.keys(decadesWeight).forEach(k => {
      if (decadesWeight[k] > maxDVal) {
        maxDVal = decadesWeight[k];
        favoriteDecade = k;
      }
    });

    let favoriteArtist = finalAnswers[0]?.track.artist.name || 'Artista';
    let maxAVal = -999;
    Object.keys(artistScores).forEach(k => {
      if (artistScores[k] > maxAVal) {
        maxAVal = artistScores[k];
        favoriteArtist = k;
      }
    });

    // Energy classification
    const avgEnergy = Math.min(100, Math.max(10, totalEnergyScore / finalAnswers.length));
    let estimatedEnergy = 'Equilibrada';
    if (avgEnergy > 75) estimatedEnergy = 'Alta Voltagem (Energética)';
    else if (avgEnergy < 40) estimatedEnergy = 'Relaxada / Chill';

    const resultProfile: MusicDNAProfile = {
      genres: finalGenres,
      decades: finalDecades,
      favoriteArtist,
      favoriteGenre,
      favoriteDecade,
      estimatedEnergy,
      timestamp: Date.now()
    };

    setProfile(resultProfile);
    saveDNA(resultProfile);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-400">A preparar sequenciador de DNA...</p>
      </div>
    );
  }

  if (profile) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
        <div className="text-center mb-8">
          <span className="text-xs uppercase tracking-wider text-slate-500">Resultado Final</span>
          <h1 className="text-3xl font-extrabold text-gradient">O Teu Perfil de DNA Musical</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/20 text-blue-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Género Favorito</span>
              <span className="font-bold text-lg text-white">{profile.favoriteGenre}</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Década Favorita</span>
              <span className="font-bold text-lg text-white">{profile.favoriteDecade}</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-2xl flex items-center gap-4 border border-slate-800">
            <div className="w-12 h-12 rounded-full bg-teal-600/20 flex items-center justify-center border border-teal-500/20 text-teal-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Energia Estimada</span>
              <span className="font-bold text-base text-white">{profile.estimatedEnergy}</span>
            </div>
          </div>
        </div>

        {/* Custom SVG / Div charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Genre Distribution */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Disc className="w-4 h-4 text-blue-400 animate-spin" style={{ animationDuration: '4s' }} />
              Distribuição por Género
            </h3>
            <div className="flex flex-col gap-3">
              {Object.entries(profile.genres).map(([genre, pct]) => (
                <div key={genre} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{genre}</span>
                    <span className="text-blue-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-850">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Decade Distribution */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <Flame className="w-4 h-4 text-indigo-400" />
              Afinidade por Décadas
            </h3>
            <div className="flex flex-col gap-3">
              {Object.entries(profile.decades).map(([decade, pct]) => (
                <div key={decade} className="flex flex-col gap-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">{decade}</span>
                    <span className="text-indigo-400">{pct}%</span>
                  </div>
                  <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-850">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={loadGameData}
            className="flex-1 py-4 bg-slate-900 hover:bg-slate-850 text-slate-300 font-bold rounded-xl border border-slate-800 transition shadow-md"
          >
            Refazer Teste
          </button>
          <Link
            to="/"
            className="flex-grow py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-xl flex items-center justify-center shadow-lg transition"
          >
            Voltar à Homepage
          </Link>
        </div>
      </div>
    );
  }

  const currentTrack = tracks[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <span className="text-xs uppercase tracking-wider text-slate-400">Modo de Jogo</span>
          <h1 className="text-2xl font-extrabold text-blue-400">Music DNA</h1>
        </div>
        <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 text-center">
          <span className="text-[10px] uppercase text-slate-500 block">Progresso</span>
          <span className="font-bold text-sm text-white">{currentIndex + 1}/{tracks.length}</span>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <AudioPlayer src={currentTrack.preview} autoPlay={true} />

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
          <h3 className="text-lg font-bold text-slate-200 mb-6 text-center">
            Gostas desta música?
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 w-full">
            {RESPONSE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleRateTrack(opt.value, opt.score)}
                className={`py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 shadow-md ${opt.color}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
