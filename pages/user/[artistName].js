import { useRouter } from "next/router";
import Tracks from "@components/Tracks";
import { use, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useTracks } from "@/hooks/useTracks";
import Loading from "@/components/Loading";

export default function UserPage() {
  const { tracks, setTracks, deleteTrack, updateTrack } = useTracks();
  const router = useRouter();
  const [isValidUser, setIsValidUser] = useState(false);
  const { artistName } = router.query;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
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
      } catch (error) {
        console.error("Error validating user:", error);
        return setIsValidUser(false);
      }
      return setIsValidUser(true);
    };
    validUser();

    (async () => {
      let r;
      try {
        r = await fetch("/api/tracks/artist/" + artistName, {
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

        setTracks(data);
        setLoading(false);
      } catch (err) {
        // network / parsing error
        console.error("Unexpected error while fetching tracks:", err);
      }
    })();
  }, [artistName]);

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div>
        <h1>{artistName}'s Profile</h1>
        <p>Welcome {artistName}! This is your page.</p>
        <Tracks
          tracks={tracks}
          onDelete={deleteTrack}
          onEdit={updateTrack}
          editable={isValidUser}
        />
        {/* TODO: later add profile photo, upload form, user’s tracks */}
      </div>
    );
  }
}
