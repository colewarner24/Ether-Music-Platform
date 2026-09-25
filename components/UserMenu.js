import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <div className="absolute right-2.5 top-2.5 z-20 inline-block" ref={menuRef}>
      {user ? (
        <div>
          <button
            className="cursor-pointer rounded-full border-2 border-white/80 bg-white/45 p-0 shadow-md"
            aria-label="Open user menu"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <img
              src={user.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
          </button>
          {menuOpen && (
            <div className="ether-panel absolute right-0 top-full z-50 mt-1 min-w-36 overflow-hidden rounded-xl">
              <Link href={`/user/${user.artistName}`} className="block min-h-11 w-full px-3 py-2.5 text-left text-white no-underline hover:bg-white/10">
                Profile
              </Link>
              <button onClick={handleSignOut} className="block min-h-11 w-full border-0 bg-transparent px-3 py-2.5 text-left text-white hover:bg-white/10">
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2.5">
          <Link href="/auth/signup" className="mt-2 text-sm font-medium text-white no-underline hover:text-ether-200">
            Sign Up
          </Link>
          <Link href="/auth/login" className="mt-2 text-sm font-medium text-white no-underline hover:text-ether-200">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
