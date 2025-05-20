"use client";

import {
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const CustomVideoPlayer: React.FC<{ src: string; poster?: string }> = ({
  src,
  poster,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  const isDirectVideo = src && src.startsWith("http");

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch((err) => {
          setError("Failed to play video: " + err.message);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newVolume = parseFloat(e.target.value);
      videoRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      setVolume(isMuted ? 1 : 0);
    }
  };

  const seekForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        videoRef.current.duration
      );
    }
  };

  const seekBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      const newTime = parseFloat(e.target.value);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleError = () => {
    setError("Unable to load the video. Please check the source or try again later.");
  };

  useEffect(() => {
    const video = videoRef.current;
    if (video && isDirectVideo) {
      video.addEventListener("loadedmetadata", () => {
        setDuration(video.duration);
        setError(null);
      });
      video.addEventListener("timeupdate", handleProgress);
      video.addEventListener("error", handleError);
      return () => {
        video.removeEventListener("loadedmetadata", () => {});
        video.removeEventListener("timeupdate", handleProgress);
        video.removeEventListener("error", handleError);
      };
    }
  }, [isDirectVideo]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div
      ref={playerRef}
      className="relative aspect-video bg-themeBlack rounded-lg overflow-hidden shadow-lg group"
    >
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center text-themeTextWhite bg-themeBlack/80 p-4">
          <p className="text-center">{error}</p>
        </div>
      ) : isDirectVideo ? (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            className="w-full h-full object-cover"
            onClick={togglePlay}
          />

          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={seekBackward}
              className="absolute left-4 text-themeTextWhite bg-sidebar-accent/50 p-2 rounded-full hover:bg-sidebar-primary transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={togglePlay}
              className="text-themeTextWhite bg-sidebar-primary/50 p-4 rounded-full hover:bg-sidebar-primary transition-colors"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
            <button
              onClick={seekForward}
              className="absolute right-4 text-themeTextWhite bg-sidebar-accent/50 p-2 rounded-full hover:bg-sidebar-primary transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-themeBlack/80 to-transparent p-4">
            <div className="flex items-center mb-2">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-themeTextGray/30 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                    (currentTime / duration) * 100
                  }%, #B4B0AE ${(currentTime / duration) * 100}%, #B4B0AE 100%)`,
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-themeTextWhite">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <div className="flex items-center space-x-2">
                <button onClick={toggleMute} className="text-themeTextWhite hover:text-primary">
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-5 h-5" />
                  ) : (
                    <Volume2 className="w-5 h-5" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-themeTextGray/30 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #ffffff 0%, #ffffff ${
                      volume * 100
                    }%, #B4B0AE ${volume * 100}%, #B4B0AE 100%)`,
                  }}
                />
              </div>
              <button onClick={toggleFullscreen} className="text-themeTextWhite hover:text-primary">
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </>
      ) : (
        <iframe
          className="w-full h-full"
          src={`https://www.youtube.com/embed/${src}?rel=0&modestbranding=1&autoplay=0`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};

export default CustomVideoPlayer;
