import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Dropzone from "react-dropzone";

export default function UploadPage() {
  let defaultTitle = "";
  let defaultFile = null;
  let defaultArtwork = null;
  // if (process.env.NODE_ENV === "development") {
  //   console.log("Environment variable:", process.env.NODE_ENV);
  //   defaultTitle = "testTrack";
  //   defaultFile =
  //     "C:\\Users\\cole2\\Desktop\\ether music platorm\\public\\defaults\\FISHER - STAY [Official Visualizer].mp3";
  //   defaultArtwork =
  //     "C:\\Users\\cole2\\Desktop\\ether music platorm\\public\\defaults\\r6y3fl9gwqqdxagw9ff3ti1ms.jpg";
  // }

  const router = useRouter();
  const [file, setFile] = useState(defaultFile);
  const [artwork, setArtwork] = useState(defaultArtwork);
  const [title, setTitle] = useState(defaultTitle);
  //const [artist, setArtist] = useState("");
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState("public");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    (async () => {
      const audio = await urlToFile(
        "/defaults/FISHER - STAY.mp3",
        "FISHER - STAY.mp3",
        "audio/mpeg"
      );

      const image = await urlToFile(
        "/defaults/artwork.jpg",
        "artwork.jpg",
        "image/jpeg"
      );

      setTitle("testTrack");
      setFile(audio);
      setArtwork(image);
    })();
  }, []);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const r = await fetch("/api/auth/me", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!r.ok) {
        router.push("/login");
      }
    }

    checkAuth();
  }, [router]);

  async function onSubmit(e) {
    console.log("file", file);
    e.preventDefault();
    if (!file) return alert("Choose an audio file");
    setLoading(true);
    const form = new FormData();
    form.append("file", file);
    if (artwork) form.append("artwork", artwork);
    form.append("title", title);
    form.append("visibility", visibility);
    try {
      const r = await fetch("/api/upload", {
        method: "POST",
        body: form,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // attach token
        },
      });
      if (!r.ok) throw new Error(await r.text());
      await router.push("/tracks");
    } catch (e) {
      console.error(e);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: "36px auto", fontFamily: "Trubec" }}>
      <h1>Upload a Track</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 14 }}>
        <label>
          <div>Track title</div>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        {/* <label>
          <div>Audio file</div>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </label> */}
        <Dropzone
          onDrop={(acceptedFiles) => {
            setFile(acceptedFiles[0]); // support single file only
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag 'n' drop some files here, or click to select files</p>
                {file && <div>Selected file: {file.name}</div>}
              </div>
            </section>
          )}
        </Dropzone>
        <label>
          <div>Artwork (optional)</div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setArtwork(e.target.files?.[0] || null)}
          />
        </label>
        <label>
          <div>Visibility</div>
          <select
            name="visibility"
            id="visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </label>
        <button disabled={loading || !file} style={{ padding: "10px 14px" }}>
          {loading ? "Uploading..." : "Upload"}
        </button>
        <div>
          <a href="/tracks">Back to tracks</a>
        </div>
      </form>
    </div>
  );
}

async function urlToFile(url, filename, mime) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new File([blob], filename, { type: mime });
}
