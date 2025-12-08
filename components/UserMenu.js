"use client";
import styles from "../styles/UserMenu.module.css";

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
    <div className={styles.userMenu} ref={menuRef}>
      {user ? (
        <div>
          <button
            className={styles.avatarBtn}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <img
              src={user.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              className={styles.avatar}
            />
          </button>
          {menuOpen && (
            <div className={styles.dropdown}>
              <Link href={`/user/${user.artistName}`} className={styles.dropdownItem}>
                Profile
              </Link>
              <button onClick={handleSignOut} className={styles.dropdownItem}>
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className={styles.authLinks}>
          <Link href="/signup" className={styles.authLink}>
            Sign Up
          </Link>
          <Link href="/login" className={styles.authLink}>
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
