import { useState } from "react"
import { useRouter } from "next/router"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [artistName, setArtistName] = useState("")
  const [profilePhoto, setProfilePhoto] = useState(null)
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (profilePhoto) formData.append("profilePhoto", profilePhoto)

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, artistName }),
    })

    const data = await res.json()
    if (res.ok) {
      localStorage.setItem("token", data.token)
      router.push(`/user/${data.user.artistName}`)
    } else {
      alert(data.error)
    }
  }

  return (
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSignup}>
        <input type="text" placeholder="Artist Name" value={artistName} onChange={(e) => setArtistName(e.target.value)} required />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {/* <input type="file" onChange={(e) => setProfilePhoto(e.target.files[0])} /> */}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  )
}
