import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "../assets/logo.png"

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/login`,
        { email, password }
      )

      // backend returns 200 even on failure (e.g. "Invalid Credentials"),
      // so check for the token instead of relying on status/catch
      if (!res.data.token) {
        setError(res.data.message || "Login failed")
        return
      }

      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong")
      } else {
        setError("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <img src={logo} alt="Logo" className="h-20 w-20" />
        </div>
        <div className="text-center">
          <h1 className="text-foreground text-3xl font-extrabold tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Log in to continue
          </p>
        </div>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">or</span>
          </div>
        </div>

        {/* Demo access for interviewers */}
        <Link
          to="/demo"
          className="flex w-full items-center justify-center rounded-md border border-dashed border-blue-500/50 py-2.5 text-sm font-medium text-blue-400 transition hover:border-blue-400 hover:bg-blue-500/10"
        >
          ⚡ View Live Demo — no sign-up needed
        </Link>

        <p className="text-muted-foreground text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
