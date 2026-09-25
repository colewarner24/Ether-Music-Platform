import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/tracks", label: "Tracks" },
  { href: "/upload", label: "Upload" },
  { href: "/about", label: "About" },
  { href: "/users", label: "Users" },
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
    href === "/"
      ? router.pathname === "/"
      : router.pathname === href || router.pathname.startsWith(`${href}/`);

  return (
    <>
      <button
        type="button"
        className="ether-button fixed left-3 top-3 z-50 inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold md:hidden"
        aria-controls="primary-sidebar"
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setIsOpen((open) => !open)}
      >
        <svg aria-hidden="true" className="mr-2 h-4 w-4" viewBox="0 0 16 16" fill="none">
          {isOpen ? (
            <path d="m3 3 10 10M13 3 3 13" stroke="currentColor" strokeWidth="1.8" />
          ) : (
            <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.8" />
          )}
        </svg>
        Menu
      </button>

      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-30 cursor-default bg-black/70 md:hidden"
          aria-label="Close navigation menu"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        id="primary-sidebar"
        className={`ether-sidebar fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col border-r p-4 transition-transform duration-200 md:relative md:inset-auto md:z-auto md:w-60 md:translate-x-0 md:border ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        aria-label="Primary navigation"
      >
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="ether-button flex min-h-11 items-center px-3 text-lg font-bold tracking-wide no-underline"
          >
            Ether
          </Link>
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center border border-transparent text-2xl text-white hover:border-white hover:bg-white/10 md:hidden"
            aria-label="Close navigation menu"
            onClick={() => setIsOpen(false)}
          >
            <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 20 20" fill="none">
              <path d="m4 4 12 12M16 4 4 16" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col gap-2" aria-label="Primary navigation links">
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="ether-nav-link flex min-h-11 items-center border px-3 font-semibold no-underline transition-colors"
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
