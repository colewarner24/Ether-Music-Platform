import { useRouter } from "next/router"
import Tracks from "@components/Tracks"
import { use, useEffect, useState } from "react"
import { jwtDecode } from 'jwt-decode';


export default function UserPage() {
  const [tracks, setTracks] = useState([]);
  const router = useRouter();
  const [isValidUser, setIsValidUser] = useState(false);
  const { artistName } = router.query;

  useEffect(() => {

    if (!artistName) return;

    const token = localStorage.getItem("token");
    
    const validUser = async () => {
      let r;
      try {
        r = await fetch("/api/auth/validUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ artistName }),
        });
      } 
      catch (error) {
        console.error("Error validating user:", error);
        return false;
      }
      return r.json().valid;
    };

    if (!token) {
      console.error("No user token found in localStorage");
      return;
    }
    else if (validUser()) {
      console.log("Valid user accessing their own profile");
      setIsValidUser(true);
    }

    (async () => {
      let r;
      try {
        r = await fetch("/api/tracks/" + artistName, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!r.ok) {
          // non-2xx status
          const text = await r.text();
          console.error("Fetch failed:", r.status, r.statusText, text);
          return;
        }

        const data = await r.json();

        console.log("Fetched tracks for", artistName, data);

        setTracks(data);
      } catch (err) {
        // network / parsing error
        console.error("Unexpected error while fetching tracks:", err);
      }
    })();

  }, [artistName]);

  return (
    <div>
      <h1>{artistName}'s Profile</h1>
      <p>Welcome {artistName}! This is your page.</p>
      <Tracks tracks={tracks} />
      {/* TODO: later add profile photo, upload form, user’s tracks */}
    </div>
  )
}
