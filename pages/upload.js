import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Dropzone from "react-dropzone";
import Loading from "@/components/Loading";

export default function UploadPage() {
  const router = useRouter();

  const [file, setFile] = useState(null);
  const [artwork, setArtwork] = useState(null);
  const [title, setTitle] = useState("");
  const [visibility, setVisibility] = useState("public");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const r = await fetch("/api/auth/me", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!r.ok) router.push("/login");
    }

    setLoading(true);
    checkAuth();
    setLoading(false);
  }, [router]);

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) return alert("Choose an audio file");

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      // ============================================================
      //  DEVELOPMENT → LOCAL API UPLOAD
      // ============================================================
      if (process.env.NODE_ENV === "development" && false) {
        console.log("Uploading via local API");
        const form = new FormData();
        form.append("file", file);
        if (artwork) form.append("artwork", artwork);
        form.append("title", title);
        form.append("visibility", visibility);

        const r = await fetch("/api/upload", {
          method: "POST",
          body: form,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!r.ok) throw new Error(await r.text());
        router.push("/tracks");
        return;
      }

      // ============================================================
      //  PRODUCTION → DIRECT R2 UPLOAD
      // ============================================================
      console.log("Uploading via direct R2 upload");
      const r = await fetch("/api/upload/sign", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          visibility,
          audioType: file.type,
          artworkType: artwork?.type,
          size: file.size,
        }),
      });

      if (!r.ok) throw new Error(await r.text());

      const { audioUploadUrl, artworkUploadUrl } = await r.json();

      if (!audioUploadUrl) throw new Error("Missing audio upload URL");

      await fetch(audioUploadUrl, {
        method: "PUT",
        body: file,
      });

      if (artwork && artworkUploadUrl) {
        await fetch(artworkUploadUrl, {
          method: "PUT",
          body: artwork,
        });
      }

      router.push("/tracks");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <Loading />;
  } else {
    return (
      <div style={{ 
        maxWidth: 720, 
        margin: "36px auto", 
        fontFamily: "Trubec",
        padding: "0 10px"
      }}>
        <h1 style={{ fontSize: "clamp(24px, 5vw, 32px)", margin: "0 0 20px 0" }}>Upload a Track</h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
          <label>
            <div style={{ marginBottom: "6px", fontSize: "clamp(12px, 2vw, 14px)" }}>Track title</div>
            <input 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              style={{ minHeight: "44px", padding: "8px", boxSizing: "border-box" }}
            />
          </label>

          <Dropzone onDrop={(files) => setFile(files[0])}>
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                style={{ 
                  border: "1px dashed #aaa", 
                  padding: "clamp(12px, 4vw, 20px)",
                  cursor: "pointer",
                  minHeight: "100px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center"
                }}
              >
                <input {...getInputProps()} />
                <p>Drag & drop audio, or click to select</p>
                {file && <div>Selected: {file.name}</div>}
              </div>
            )}
          </Dropzone>

          <label>
            <div style={{ marginBottom: "6px", fontSize: "clamp(12px, 2vw, 14px)" }}>Artwork (optional)</div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setArtwork(e.target.files?.[0] || null)}
              style={{ minHeight: "44px", padding: "8px", boxSizing: "border-box" }}
            />
          </label>

          <label>
            <div style={{ marginBottom: "6px", fontSize: "clamp(12px, 2vw, 14px)" }}>Visibility</div>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              style={{ minHeight: "44px", padding: "8px", fontSize: "clamp(12px, 2vw, 14px)" }}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>

          <button 
            disabled={loading || !file}
            style={{ 
              minHeight: "44px", 
              padding: "8px",
              fontSize: "clamp(12px, 2vw, 14px)"
            }}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>

          <a href="/tracks" style={{ 
            padding: "8px",
            textAlign: "center",
            minHeight: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>Back to tracks</a>
        </form>
      </div>
    );
  }
}
