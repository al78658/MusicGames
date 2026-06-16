import React from 'react';
import { HashRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { StatsProvider } from './contexts/StatsContext';
import { Home } from './pages/Home';
import { GuessSong } from './games/GuessSong';
import { GuessArtist } from './games/GuessArtist';
import { MusicConnections } from './games/MusicConnections';
import { TimelineChallenge } from './games/TimelineChallenge';
import { PopularityRanking } from './games/PopularityRanking';
import { GuessDecade } from './games/GuessDecade';
import { MusicDNA } from './games/MusicDNA';
import { Music, ArrowLeft } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-slate-900/50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white group-hover:scale-105 transition">
            <Music className="w-4 h-4 fill-white/10" />
          </div>
          <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300">
            Sinfonia Musical
          </span>
        </Link>

        <Routes>
          <Route path="/" element={
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest hidden sm:inline">
              Estúdio de Jogos
            </span>
          } />
          <Route path="*" element={
            <Link
              to="/"
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Voltar ao Menu
            </Link>
          } />
        </Routes>
      </div>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-900/50 py-6 mt-16 text-center text-xs text-slate-600">
      <div className="max-w-6xl mx-auto px-4">
        <p>© 2026 Sinfonia Musical. Todos os direitos reservados.</p>
        <p className="mt-1">Alimentado por Deezer API. 100% Estático e Livre de Servidor.</p>
      </div>
    </footer>
  );
};

function App() {
  return (
    <StatsProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow flex items-center justify-center py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/game/guess-song" element={<GuessSong />} />
              <Route path="/game/guess-artist" element={<GuessArtist />} />
              <Route path="/game/music-connections" element={<MusicConnections />} />
              <Route path="/game/timeline-challenge" element={<TimelineChallenge />} />
              <Route path="/game/popularity-ranking" element={<PopularityRanking />} />
              <Route path="/game/guess-decade" element={<GuessDecade />} />
              <Route path="/game/music-dna" element={<MusicDNA />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </StatsProvider>
  );
}

export default App;
