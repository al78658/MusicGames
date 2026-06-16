import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  onPlayStateChange?: (isPlaying: boolean) => void;
  autoPlay?: boolean;
  onAudioError?: () => void;
  maxDuration?: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  src,
  onPlayStateChange,
  autoPlay = false,
  onAudioError,
  maxDuration = 15 // Default to 15 seconds snippet
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Reset state when source changes
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setHasError(false);

    if (audioRef.current) {
      audioRef.current.src = src;
      audioRef.current.load();
      if (autoPlay) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch(err => console.log("Auto-play prevented by browser:", err));
      }
    }
  }, [src, autoPlay]);

  useEffect(() => {
    if (onPlayStateChange) {
      onPlayStateChange(isPlaying);
    }
  }, [isPlaying, onPlayStateChange]);

  const togglePlay = () => {
    if (!audioRef.current || hasError) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // If we are at the end of the snippet, restart before playing
      if (maxDuration && audioRef.current.currentTime >= maxDuration) {
        audioRef.current.currentTime = 0;
      }
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.error(err));
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const restart = () => {
    if (!audioRef.current || hasError) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch(err => console.error(err));
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    if (maxDuration && current >= maxDuration) {
      audioRef.current.pause();
      audioRef.current.currentTime = maxDuration;
      setCurrentTime(maxDuration);
      setIsPlaying(false);
    } else {
      setCurrentTime(current);
    }
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;
    const audioDuration = audioRef.current.duration || 30;
    setDuration(maxDuration ? Math.min(audioDuration, maxDuration) : audioDuration);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioError = () => {
    setHasError(true);
    setIsPlaying(false);
    if (onAudioError) {
      onAudioError();
    }
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col items-center justify-center w-full max-w-md mx-auto shadow-2xl relative overflow-hidden">
      {/* Background glowing design */}
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        onError={handleAudioError}
      />

      {/* Rotating Disc visual representation */}
      <div className="relative mb-6">
        <div className={`w-36 h-36 rounded-full bg-slate-900 border-4 ${hasError ? 'border-red-500/50' : 'border-slate-800'} flex items-center justify-center shadow-lg relative overflow-hidden ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }}>
          {/* Record center */}
          <div className={`w-10 h-10 rounded-full ${hasError ? 'bg-red-500' : 'bg-blue-500'} border-2 border-slate-900 flex items-center justify-center z-10`}>
            <div className="w-2 h-2 rounded-full bg-slate-900" />
          </div>
          {/* Groove lines */}
          <div className="absolute inset-4 rounded-full border border-dashed border-slate-700/50" />
          <div className="absolute inset-8 rounded-full border border-dashed border-slate-700/30" />
          <div className="absolute inset-12 rounded-full border border-dashed border-slate-700/20" />
        </div>
        
        {/* Play/Pause Button Overlaid at bottom-right or center */}
        <button
          onClick={togglePlay}
          disabled={hasError}
          className={`absolute -bottom-2 right-1/2 translate-x-1/2 ${hasError ? 'bg-red-650 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-500'} text-white rounded-full p-4 shadow-xl hover:scale-105 active:scale-95 transition-all duration-200`}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-0.5" />}
        </button>
      </div>

      {hasError && (
        <div className="w-full mb-2 p-2.5 bg-red-950/40 border border-red-500/20 text-red-300 rounded-xl text-center text-xs animate-pulse">
          ⚠️ Não foi possível carregar a música.
        </div>
      )}

      {/* Track progress timeline */}
      <div className="w-full mt-4 flex flex-col gap-1.5">
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-100 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400">
          <span>{Math.floor(currentTime)}s</span>
          <span>{Math.floor(duration || 30)}s</span>
        </div>
      </div>

      {/* Extra Controls */}
      <div className="flex gap-6 mt-4 items-center">
        <button
          onClick={restart}
          className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800/40 transition"
          title="Restart"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={toggleMute}
          className="text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800/40 transition"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
