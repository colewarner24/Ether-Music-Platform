import { useEffect, useState } from "react";
import styles from "@styles/Loading.module.css";

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
    <div className={styles.loadingWrapper}>
      <pre className={styles.asciiFire}>
{art.join("\n")}
      </pre>
      <div className={styles.loadingText}>loading…</div>
    </div>
  );
}
