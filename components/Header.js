import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Header() {

  const [user, setUser] = useState(null);

  useEffect(() => {

    // Check if there's a saved token
    const token = localStorage.getItem("token");
    if (!token) return;

    // Fetch user profile from backend
    fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, []);


  return (
    <div id="header">
      <div className="icon-section">
        {user ? (
          <Link href={`/user/${user.artistName}`}>
            <Image
              // src={user.profilePhoto || "/public/images/default-avatar.jpg"}
              src={"/images/default-avatar.jpg"}
              alt="Profile"
              width={40}
              height={40}
              className="profile-icon"
            />
          </Link>
        ) : (
          <div className="auth-links">
            <Link
              href="/signup"
              className="auth-link"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="auth-link"
            >
              Login
            </Link>
          </div>
        )}
      </div>
      <Link href="/" className="page-title">the ether</Link>
      <p className = "page-description">a music platform</p>
      {/* <p>music from the beyond</p> */}
    </div>
  );
}