import { useState } from "react"

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleRequest = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
    } else {
      setError(data.error || "Failed to send reset email")
    }
  }

  if (success) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
        <h1>Check your email</h1>
        <p>If an account exists with that email, a password reset link has been sent.</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
      <h1 style={{ marginBottom: 8 }}>Reset password</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Enter your email address and we'll send you a link to reset your password.</p>

      <form onSubmit={handleRequest}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>Email</label>
          <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#111827', color: 'white', borderRadius: 6, border: 'none' }}>{loading ? 'Sending...' : 'Send reset link'}</button>
      </form>

      <div style={{ marginTop: 12 }}>
        <p><a href="/auth/login">Back to login</a></p>
      </div>
    </div>
  )
}
