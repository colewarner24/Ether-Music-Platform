import { useEffect, useState, useRef, useCallback } from "react";
import Tracks from "@/components/Tracks";
import Loading from "@/components/Loading";
import { useTracks } from "@/hooks/useTracks";

export default function TracksPage() {
  const { tracks, setTracks, deleteTrack, updateTrack } = useTracks();
  const [loading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);

  const fetchTracks = useCallback(
    async (skipValue = 0) => {
      try {
        const isInitial = skipValue === 0;
        if (isInitial) setLoading(true);
        else setIsLoadingMore(true);

        const response = await fetch(`/api/tracks?skip=${skipValue}&take=10`);
        const data = await response.json();

        if (isInitial) {
          setTracks(data.tracks);
        } else {
          setTracks((prev) => [...prev, ...data.tracks]);
        }

        setSkip(skipValue + data.tracks.length);
        setHasMore(data.hasMore);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false);
        setIsLoadingMore(false);
      }
    },
    [setTracks],
  );

  useEffect(() => {
    fetchTracks(0);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !isLoadingMore &&
          !loading
        ) {
          fetchTracks(skip);
        }
      },
      { threshold: 0.1 },
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [skip, hasMore, isLoadingMore, loading, fetchTracks]);

  if (loading) {
    return (
      <div className="mx-auto my-9 max-w-5xl px-2.5 text-center">
        <h1 className="text-3xl font-bold">Tracks</h1>
        <div>
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto my-9 max-w-5xl px-2.5">
      <h1 className="mb-4 text-[clamp(24px,5vw,32px)] font-bold">
        Tracks
      </h1>
      <p className="mb-4 text-[clamp(12px,2vw,14px)]">
        <a href="/upload">Upload a new track →</a>
      </p>
      <Tracks tracks={tracks} onDelete={deleteTrack} onEdit={updateTrack} />

      {hasMore && (
        <div ref={observerTarget} className="mt-5 flex justify-center p-[clamp(12px,4vw,20px)]">
          {isLoadingMore && <Loading />}
        </div>
      )}

      {!hasMore && tracks.length > 0 && (
        <p className="mt-5 text-center text-[clamp(12px,2vw,14px)] text-slate-400">
          No more tracks to load
        </p>
      )}
    </div>
  );
}
