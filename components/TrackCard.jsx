import { useEffect, useRef, useState } from "react";

export default function TrackCard({
  title,
  artist,
  artwork,
  srcKey,
  localSrc,
  onDelete,
  onEdit,
  editable,
}) {
  const [src, setSrc] = useState(null);

  const audioRef = useRef(null);
  const canvasRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [peaks, setPeaks] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // ============================================================
  //  GET AUDIO SRC: Local uses direct URL, Prod uses signed URL
  // ============================================================
  useEffect(() => {
    async function loadSrc() {
      if (process.env.NEXT_PUBLIC_STORAGE_PROVIDER === "local" && localSrc) {
        console.log("Using local audio source:", localSrc);
        setSrc(localSrc);
        return;
      }

      if (!srcKey) return;

      try {
        const res = await fetch(
          `/api/audio/url?key=${encodeURIComponent(srcKey)}`
        );
        const data = await res.json();
        setSrc(data.signedUrl);
      } catch (err) {
        console.error("Failed to fetch signed URL:", err);
      }
    }

    loadSrc();
  }, [srcKey, localSrc]);

  // ============================================================
  //  AUDIO EVENTS
  // ============================================================
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onTime = () => setCurrentTime(a.currentTime || 0);
    const onLoaded = () => setDuration(a.duration || 0);
    const onEnd = () => setPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onLoaded);
    a.addEventListener("ended", onEnd);

    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onLoaded);
      a.removeEventListener("ended", onEnd);
    };
  }, []);

  // ============================================================
  //  WAVEFORM GENERATION (requires CORS-safe URL)
  // ============================================================
  useEffect(() => {
    let cancelled = false;

    async function genPeaks() {
      if (!src) return;

      try {
        const res = await fetch(src);
        const buf = await res.arrayBuffer();

        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuf = await ctx.decodeAudioData(buf);

        const ch = audioBuf.getChannelData(0);
        const bars = 160;
        const block = Math.floor(ch.length / bars);

        const out = new Array(bars).fill(0).map((_, i) => {
          let peak = 0;
          const start = i * block;
          const end = Math.min(start + block, ch.length);
          for (let j = start; j < end; j += 64) {
            const v = Math.abs(ch[j] || 0);
            if (v > peak) peak = v;
          }
          return peak;
        });

        if (!cancelled) setPeaks(out);

        ctx.close();
      } catch (err) {
        setPeaks(null);
      }
    }

    genPeaks();
    return () => {
      cancelled = true;
    };
  }, [src]);

  // ============================================================
  //  DRAW WAVEFORM
  // ============================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const DPR = window.devicePixelRatio || 1;

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.scale(DPR, DPR);

    ctx.clearRect(0, 0, w, h);

    const total = peaks?.length || 160;
    const gap = 2;
    const barW = Math.max(1, Math.floor((w - (total - 1) * gap) / total));

    const progress = duration ? currentTime / duration : 0;
    const played = Math.floor(progress * total);

    for (let i = 0; i < total; i++) {
      const amp = peaks ? peaks[i] : 0.25 + 0.1 * Math.sin(i * 0.2);
      const bh = Math.max(2, Math.floor(amp * (h - 4))) * 3;
      const x = i * (barW + gap);
      const y = Math.floor((h - bh) / 2);

      ctx.fillStyle = i <= played ? "#ffffff" : "rgba(255, 255, 255, 0.69)";
      ctx.fillRect(x, y, barW, bh);
    }
  }, [peaks, currentTime, duration]);

  // ============================================================
  //  MENU: Close when clicking outside
  // ============================================================
  {
    useEffect(() => {
      if (!editable) return;

      function onClick(e) {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setMenuOpen(false);
        }
      }

      document.addEventListener("mousedown", onClick);
      return () => document.removeEventListener("mousedown", onClick);
    }, []);
  }

  // ============================================================
  //  PLAY / PAUSE
  // ============================================================
  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;

    console.log("Toggling playback, currently paused:", a);
    if (a.paused) {
      a.play();
      setPlaying(true);
    } else {
      a.pause();
      setPlaying(false);
    }
  };

  const fmt = (s) => {
    if (!Number.isFinite(s)) return "0:00";
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${ss}`;
  };

  // ============================================================
  //  UI RENDER
  // ============================================================
  return (
    <div className="mx-auto my-2 w-full max-w-[900px] font-[var(--ui-font)] max-md:max-w-[calc(100%-10px)] max-sm:my-1 max-sm:max-w-[calc(100%-8px)]">
      <div
        className="ether-track-card relative overflow-hidden bg-[#2a2a27]"
      >
        {artwork && (
          <img
            src={artwork}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative z-2 flex flex-wrap items-center gap-3 p-4 text-white max-md:gap-2.5 max-md:p-3 max-sm:gap-2 max-sm:p-2 max-sm:text-xs">
          <div className="flex w-14 shrink-0 justify-center max-sm:w-11">
            <button
              className="ether-button flex min-h-11 min-w-11 cursor-pointer items-center justify-center px-3 py-2.5 max-sm:px-2.5 max-sm:py-2"
              onClick={toggle}
              aria-label={playing ? "Pause track" : "Play track"}
            >
              {playing ? (
                <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M3 2h3v12H3zM10 2h3v12h-3z" />
                </svg>
              ) : (
                <svg aria-hidden="true" className="ml-0.5 h-4 w-4" viewBox="0 0 16 16" fill="currentColor">
                  <path d="m4 2 9 6-9 6V2z" />
                </svg>
              )}
            </button>
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="truncate text-[13px] opacity-90 max-sm:text-[11px]">
              {artist || "unknown"}
            </div>
            <div className="truncate text-lg font-bold max-sm:text-sm">
              {title || "untitled"}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 max-sm:gap-2 max-sm:text-xs">
            <div className="text-xs max-sm:text-[10px]">{fmt(duration)}</div>
            {src && (
              <div>
                <a className="text-xs text-white underline hover:text-ether-signal max-sm:text-[10px]" href={src} download>
                  download
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="relative z-2 flex min-h-11 items-center bg-black/20 px-3 max-sm:min-h-9 max-sm:px-2">
          <canvas ref={canvasRef} className="h-11 w-full max-sm:h-9" height="44" />
        </div>

        {editable && (
          <div className="relative z-2 flex justify-end" ref={menuRef}>
            <button
              className="flex min-h-11 min-w-11 cursor-pointer items-center justify-center border-0 bg-black/45 px-3 py-2 text-xl text-white/80 hover:bg-black/75 hover:text-white"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Track actions"
            >
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <circle cx="4" cy="10" r="1.5" />
                <circle cx="10" cy="10" r="1.5" />
                <circle cx="16" cy="10" r="1.5" />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute bottom-9 right-0 z-50 min-w-40 overflow-hidden border border-white/60 bg-black shadow-xl max-sm:min-w-36 max-sm:text-xs">
                <button className="flex min-h-11 w-full cursor-pointer items-center border-0 bg-transparent px-3 py-2.5 text-left text-[13px] text-white hover:bg-white/10 max-sm:px-2.5 max-sm:py-2 max-sm:text-xs" onClick={onEdit}>
                  Edit Track
                </button>
                <button className="flex min-h-11 w-full cursor-pointer items-center border-0 bg-transparent px-3 py-2.5 text-left text-[13px] text-red-400 hover:bg-white/10 max-sm:px-2.5 max-sm:py-2 max-sm:text-xs" onClick={onDelete}>
                  Delete Track
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />
    </div>
  );
}
