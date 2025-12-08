import Link from "next/link";
import styles from "../styles/NavBar.module.css";

export default function NavBar() {
  return (
    <div className={styles.nav} id="nav">
      <Link href="/who" className={styles.navbutton}>About</Link>
      <Link href="/gallery" className={styles.navbutton}>Tracks</Link>
      <Link href="/upload" className={styles.navbutton}>Upload</Link>

      {/* <div className="drop">
        <div className="navbutton" id="shrines">
          Shrines ▾
          <div className="drop-content">
            <Link href="/shrines/blueexec">Blue Exec (Super Doomspire)</Link>
          </div>
        </div>
      </div> */}

      <Link href="/links" className={styles.navbutton}>Links</Link>
      <Link href="/archives" className={styles.navbutton}>Archives</Link>
    </div>
  );
}
