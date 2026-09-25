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
        router.push("/auth/login")
      }, 2000)
    } else {
      setError(data.error || "Verification failed")
    }
  }

  if (!token) {
    return (
      <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
        <p>Loading verification...</p>
      </div>
    )
  }

  if (success) {
    return (
      <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
        <h1>Email verified!</h1>
        <p>Your email has been verified. Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
      <h1 className="mb-2 text-2xl font-bold">Verify your email</h1>
      <p className="mt-0 text-slate-300">Click the button below to verify your email address.</p>

      {error && <div className="mb-3 text-red-400" role="alert">{error}</div>}

      <button onClick={handleVerify} disabled={loading} className="ether-button w-full">
        {loading ? 'Verifying...' : 'Verify email'}
      </button>
    </div>
  )
}
