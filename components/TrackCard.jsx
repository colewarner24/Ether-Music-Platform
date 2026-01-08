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
      console.log("NODE_ENV:", process.env.NODE_ENV);
      if (process.env.NODE_ENV === "development") {
        console.log("Using local audio source:", localSrc);
        setSrc(localSrc);
        return;
      }

      if (!srcKey) return;

      try {
        const res = await fetch(
          `/api/audio-url?key=${encodeURIComponent(srcKey)}`
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
    <div className="sc-card">
      <div
        className="artwork"
        style={{ backgroundImage: artwork ? `url(${artwork})` : "none" }}
      >
        <div className="overlay" />

        <div className="header">
          <div className="play-wrap">
            <button className="play" onClick={toggle}>
              {playing ? "▮▮" : "▶"}
            </button>
          </div>

          <div className="titles">
            <div className="artist">{artist || "unknown"}</div>
            <div className="title">{title || "untitled"}</div>
          </div>

          <div className="meta-right">
            <div className="duration">{fmt(duration)}</div>
            {src && (
              <div className="dl">
                <a href={src} download>
                  download
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="wave-row">
          <canvas ref={canvasRef} className="wave-canvas" height="44" />
        </div>

        {editable && (
          <div className="actions" ref={menuRef}>
            <button
              className="more"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Track actions"
            >
              ⋯
            </button>

            {menuOpen && (
              <div className="menu">
                <button onClick={onEdit}>Edit Track</button>
                <button className="danger" onClick={onDelete}>
                  Delete Track
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <audio ref={audioRef} src={src} preload="metadata" />

      <style jsx>{`
        .sc-card {
          width: 100%;
          max-width: 900px;
          margin: 8px auto;
          font-family: var(--ui-font, system-ui);
        }
        .artwork {
          position: relative;
          background-color: #222;
          background-size: cover;
          background-position: center;
          border: 3px solid rgba(255, 255, 255, 0.2);
          overflow: hidden;
        }
        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.45),
            rgba(0, 0, 0, 0.25)
          );
        }
        .header {
          display: flex;
          gap: 12px;
          padding: 16px;
          color: #fff;
          align-items: center;
          position: relative;
          z-index: 2;
        }
        .play-wrap {
          width: 56px;
          display: flex;
          justify-content: center;
        }
        .play {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #fff;
          padding: 10px 12px;
          border-radius: 999px;
          cursor: pointer;
        }
        .titles {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .artist {
          font-size: 13px;
          opacity: 0.9;
        }
        .title {
          font-size: 18px;
          font-weight: 700;
        }
        .meta-right {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .duration {
          font-size: 12px;
        }
        .dl a {
          color: #fff;
          text-decoration: underline;
        }
        .wave-row {
          padding: 0px 12px 0px;
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.12),
            rgba(0, 0, 0, 0.08)
          );
          z-index: 2;
        }
        .wave-canvas {
          width: 100%;
          height: 44px;
        }
      `}</style>
    </div>
  );
}
