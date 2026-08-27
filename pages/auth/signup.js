import { useState } from "react"
import { useRouter } from "next/router"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [artistName, setArtistName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, artistName }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } else {
      setError(data.error || "Signup failed")
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
        <h1>Account created!</h1>
        <p>Check your email to verify your account. You'll be redirected to login shortly.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
      <h1 style={{ marginBottom: 8 }}>Create an account</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Join the music platform</p>

      <form onSubmit={handleSignup}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Email</label>
          <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Artist Name</label>
          <input type="text" placeholder="Your artist name" value={artistName} onChange={(e) => setArtistName(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Password</label>
          <input type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#111827', color: 'white', borderRadius: 6, border: 'none' }}>{loading ? 'Creating account...' : 'Sign up'}</button>
      </form>

      <div style={{ marginTop: 12 }}>
        <p>Already have an account? <a href="/auth/login">Log in</a></p>
      </div>
    </div>
  )
}
