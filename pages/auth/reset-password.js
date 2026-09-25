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
      <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
        <h1>Check your email</h1>
        <p>If an account exists with that email, a password reset link has been sent.</p>
      </div>
    )
  }

  return (
    <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
      <h1 className="mb-2 text-2xl font-bold">Reset password</h1>
      <p className="mt-0 text-slate-300">Enter your email address and we'll send you a link to reset your password.</p>

      <form onSubmit={handleRequest}>
        <div className="mb-3">
          <label className="mb-1.5 block text-xs">Email</label>
          <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="ether-field" />
        </div>

        {error && <div className="mb-3 text-red-400" role="alert">{error}</div>}

        <button type="submit" disabled={loading} className="ether-button w-full">{loading ? 'Sending...' : 'Send reset link'}</button>
      </form>

      <div className="mt-3">
        <p><a href="/auth/login">Back to login</a></p>
      </div>
    </div>
  )
}
