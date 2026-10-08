import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styles from "@/styles/Sidebar.module.css";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/tracks", label: "Tracks" },
  { href: "/upload", label: "Upload" },
  { href: "/links", label: "Links" },
  { href: "/archives", label: "Archives" },
];

export default function Sidebar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [router.asPath]);

  const isActive = (href) =>
    router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <>
      <button
        type="button"
        className={styles.menuToggle}
        aria-controls="primary-sidebar"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg aria-hidden="true" viewBox="0 0 16 16">
          {isOpen ? (
            <path d="m3 3 10 10M13 3 3 13" />
          ) : (
            <path d="M2 4h12M2 8h12M2 12h12" />
          )}
        </svg>
        Menu
      </button>

      {isOpen && (
        <button
          type="button"
          className={styles.scrim}
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        id="primary-sidebar"
        className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}
        aria-label="Primary navigation"
      >
        <div className={styles.sidebarHeading}>
          <span>Navigation</span>
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
          >
            <svg aria-hidden="true" viewBox="0 0 20 20">
              <path d="m4 4 12 12M16 4 4 16" />
            </svg>
          </button>
        </div>

        <nav className={styles.links} aria-label="Primary navigation links">
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={styles.link}
              aria-current={isActive(href) ? "page" : undefined}
              onClick={() => setIsOpen(false)}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
