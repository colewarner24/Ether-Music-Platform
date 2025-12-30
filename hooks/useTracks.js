import { useState } from "react";

export function useTracks(initial = []) {
  const [tracks, setTracks] = useState(initial);

  const deleteTrack = async (trackId) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/tracks/${trackId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error("Failed to delete track");
    }

    setTracks((prev) => prev.filter((t) => t.id !== trackId));
  };

  const updateTrack = async (trackId, data) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/tracks/${trackId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update track");
    }

    const updated = await res.json();

    setTracks((prev) => prev.map((t) => (t.id === trackId ? updated : t)));
  };

  return { tracks, setTracks, deleteTrack, updateTrack };
}
