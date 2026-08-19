import { useState } from "react"
import { useRouter } from "next/router"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()
    setLoading(false)
    if (res.ok) {
      localStorage.setItem("token", data.token)
      if (!data.user.emailVerified) {
        alert('Email not verified. A verification email was sent. Please check your inbox.')
      }
      router.push(`/user/${data.user.artistName}`)
    } else {
      setError(data.error || 'Login failed')
    }
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
      <h1 style={{ marginBottom: 8 }}>Welcome back</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Log in to access your dashboard.</p>

      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Email</label>
          <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Password</label>
          <input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#111827', color: 'white', borderRadius: 6, border: 'none' }}>{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        <a href="/signup">Create account</a>
        <a href="/reset-password">Forgot password?</a>
      </div>
    </div>
  )
}
