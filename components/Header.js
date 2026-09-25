import { useState, useEffect } from "react";
import Link from "next/link";
import UserMenu from "./UserMenu";

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
    <header
      className="ether-header relative mb-1 min-h-32 border p-2.5 text-xl font-bold sm:p-1.5 sm:text-base md:p-2 md:text-lg"
      id="header"
    >
      <UserMenu user={user} setUser={setUser} />
      {/* <div className="icon-section">
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
              href="/auth/signup"
              className="auth-link"
            >
              Sign Up
            </Link>
            <Link
              href="/auth/login"
              className="auth-link"
            >
              Login
            </Link>
          </div>
        )}
      </div> */}
      <Link
        href="/"
        className="absolute left-5 top-1/4 -translate-y-1/2 text-white no-underline hover:text-ether-signal sm:left-2.5 md:left-4"
      >
        <pre className="m-0 font-mono leading-none text-[10px] sm:text-[8px] md:text-[6px]">
          {`_________________________ ________________________
\\_   _____/\\__    ___/   |   \\_   _____/\\______   \\
 |    __)_   |    | /    ~    \\    __)_  |       _/
 |        \\  |    | \\    Y    /        \\ |    |   \\
/_______  /  |____|  \\___|_  /_______  / |____|_  /
        \\/                 \\/        \\/         \\/`}
        </pre>
      </Link>
      <p className="mb-0 mt-[4.5rem] text-right text-xs text-white sm:mt-16 sm:text-sm md:mt-[5.5rem]">
        a music platform
      </p>
      {/* <p>music from the beyond</p> */}
    </header>
  );
}
