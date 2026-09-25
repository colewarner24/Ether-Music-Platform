import { useEffect, useState } from "react";

const BASE_ART = [
  "         )   )           ",
  "   (  ( /(( /(   (  (    ",
  "  ))\\ )\\())\\()) ))\\ )(   ",
  " /((_|_))((_ ) /((_|()\\  ",
  "(_)) | |_| |(_|_))  ((_) ",
  "/ -_)|  _| ' \\/ -_)| '_| ",
  "\\___| \\__|_||_\\___||_|   ",
];

// function randomizeFlames(line) {
//   return line.replace(/[( )]/g, (char) => {
//     const r = Math.random();
//     if (r < 0.33) return " ";
//     if (r < 0.66) return "(";
//     return ")";
//   });
// }

function randomizeFlames(line) {
  return line.replace(/[()]/g, (char) => {
    const r = Math.random();
    if (r < 0.5) return "(";
    return ")";
  });
}

export default function Loading() {
  const [art, setArt] = useState(BASE_ART);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const interval = setInterval(() => {
      setArt((prev) =>
        prev.map((line, i) =>
          i < 3 ? randomizeFlames(line) : line
        )
      );
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ether-loading flex h-[60vh] flex-col items-center justify-center font-mono">
      <pre className="animate-[ether-flame-flicker_0.12s_infinite_alternate] whitespace-pre text-center text-sm leading-tight text-ether-700">
{art.join("\n")}
      </pre>
      <div className="mt-3 animate-[ether-pulse_1.4s_infinite_ease-in-out] text-xs tracking-[2px] text-ether-900">
        loading…
      </div>
    </div>
  );
}
