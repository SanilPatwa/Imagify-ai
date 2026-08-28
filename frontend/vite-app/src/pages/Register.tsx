import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import logo from "../assets/logo.png"

function Register() {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await axios.post("http://localhost:3000/api/user/register", {
        name,
        email,
        password,
      })

      // backend returns 200 even on failure (e.g. "Credentials missing"),
      // so check for the token instead of relying on status/catch
      if (!res.data.token) {
        setError(res.data.message || "Registration failed")
        return
      }

      localStorage.setItem("token", res.data.token)
      navigate("/dashboard")
    } catch (err) {
      // this only fires for actual HTTP error codes, e.g. "User already exists" (400)
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
            Create an account
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Sign up to get started
          </p>
        </div>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-muted-foreground text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
