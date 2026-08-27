import { useState } from "react"
import { useRouter } from "next/router"

export default function ResetPasswordFormPage() {
  const router = useRouter()
  const { token } = router.query
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/auth/login")
      }, 2000)
    } else {
      setError(data.error || "Failed to reset password")
    }
  }

  if (!token) {
    return <div style={{ margin: '40px auto', maxWidth: 420 }}>Loading...</div>
  }

  if (success) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
        <h1>Password reset</h1>
        <p>Your password has been reset. Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
      <h1 style={{ marginBottom: 8 }}>Set new password</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Enter your new password below.</p>

      <form onSubmit={handleReset}>
        <div style={{ marginBottom: 12 }}>
          <label style={{ display: 'block', fontSize: 12, marginBottom: 6 }}>New password</label>
          <input type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>

        {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#111827', color: 'white', borderRadius: 6, border: 'none' }}>{loading ? 'Resetting...' : 'Reset password'}</button>
      </form>
    </div>
  )
}
