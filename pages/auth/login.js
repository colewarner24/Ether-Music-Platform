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
    <div className="ether-panel mx-auto my-10 max-w-[420px] p-6 text-left">
      <h1 className="mb-2 text-2xl font-bold">Welcome back</h1>
      <p className="mt-0 text-slate-300">Log in to access your dashboard.</p>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="login-email" className="mb-1.5 block text-xs">Email</label>
          <input id="login-email" type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="ether-field" />
        </div>

        <div className="mb-3">
          <label htmlFor="login-password" className="mb-1.5 block text-xs">Password</label>
          <input id="login-password" type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} required className="ether-field" />
        </div>

        {error && <div className="mb-3 text-red-400" role="alert">{error}</div>}

        <button type="submit" disabled={loading} className="ether-button w-full">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>

      <div className="mt-3 flex justify-between gap-3 text-sm">
        <a href="/auth/signup">Create account</a>
        <a href="/auth/reset-password">Forgot password?</a>
      </div>
    </div>
  )
}
