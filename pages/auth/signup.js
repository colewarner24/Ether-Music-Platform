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
      <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
        <h1>Account created!</h1>
        <p>Check your email to verify your account. You'll be redirected to login shortly.</p>
      </div>
    )
  }

  return (
    <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
      <h1 className="mb-2 text-2xl font-bold">Create an account</h1>
      <p className="mt-0 text-slate-300">Join the music platform</p>

      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="mb-1.5 block text-xs">Email</label>
          <input type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="ether-field" />
        </div>

        <div className="mb-3">
          <label className="mb-1.5 block text-xs">Artist Name</label>
          <input type="text" placeholder="Your artist name" value={artistName} onChange={(e) => setArtistName(e.target.value)} required className="ether-field" />
        </div>

        <div className="mb-3">
          <label className="mb-1.5 block text-xs">Password</label>
          <input type="password" placeholder="At least 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required className="ether-field" />
        </div>

        {error && <div className="mb-3 text-red-400" role="alert">{error}</div>}

        <button type="submit" disabled={loading} className="ether-button w-full">{loading ? 'Creating account...' : 'Sign up'}</button>
      </form>

      <div className="mt-3">
        <p>Already have an account? <a href="/auth/login">Log in</a></p>
      </div>
    </div>
  )
}
