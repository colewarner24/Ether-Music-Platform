import Link from "next/link";

export default function NavBar() {
  return (
    <div id="nav">
      <Link href="/who" className="navbutton">About</Link>
      <Link href="/gallery" className="navbutton">Tracks</Link>
      <Link href="/upload" className="navbutton">Upload</Link>

      {/* <div className="drop">
        <div className="navbutton" id="shrines">
          Shrines ▾
          <div className="drop-content">
            <Link href="/shrines/blueexec">Blue Exec (Super Doomspire)</Link>
          </div>
        </div>
      </div> */}

      <Link href="/links" className="navbutton">Links</Link>
      <Link href="/archives" className="navbutton">Archives</Link>
    </div>
  );
}
