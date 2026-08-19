import { useState } from "react"
import { useRouter } from "next/router"

export default function VerifyEmailPage() {
  const router = useRouter()
  const { token } = router.query
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handleVerify = async () => {
    if (!token) return
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })

    const data = await res.json()
    setLoading(false)

    if (res.ok) {
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } else {
      setError(data.error || "Verification failed")
    }
  }

  if (!token) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
        <p>Loading verification...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
        <h1>Email verified!</h1>
        <p>Your email has been verified. Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 420, margin: '40px auto', padding: 24, border: '1px solid #e6e6e6', borderRadius: 8 }}>
      <h1 style={{ marginBottom: 8 }}>Verify your email</h1>
      <p style={{ marginTop: 0, color: '#666' }}>Click the button below to verify your email address.</p>

      {error && <div style={{ color: 'crimson', marginBottom: 12 }}>{error}</div>}

      <button onClick={handleVerify} disabled={loading} style={{ width: '100%', padding: 10, background: '#111827', color: 'white', borderRadius: 6, border: 'none' }}>
        {loading ? 'Verifying...' : 'Verify email'}
      </button>
    </div>
  )
}
