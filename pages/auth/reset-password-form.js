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
    return <div className="mx-auto my-10 max-w-[420px]">Loading...</div>
  }

  if (success) {
    return (
      <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
        <h1>Password reset</h1>
        <p>Your password has been reset. Redirecting to login...</p>
      </div>
    )
  }

  return (
    <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
      <h1 className="mb-2 text-2xl font-bold">Set new password</h1>
      <p className="mt-0 text-slate-300">Enter your new password below.</p>

      <form onSubmit={handleReset}>
        <div className="mb-3">
          <label className="mb-1.5 block text-xs">New password</label>
          <input type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="ether-field" />
        </div>

        {error && <div className="mb-3 text-red-400" role="alert">{error}</div>}

        <button type="submit" disabled={loading} className="ether-button w-full">{loading ? 'Resetting...' : 'Reset password'}</button>
      </form>
    </div>
  )
}
