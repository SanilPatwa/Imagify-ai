import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import logo from "../assets/logo.png"

function Demo() {
  const navigate = useNavigate()
  const [status, setStatus] = useState("Signing you in...")

  useEffect(() => {
    const loginAsDemo = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/demo`
        )
        localStorage.setItem("token", res.data.token)
        navigate("/dashboard", { replace: true })
      } catch {
        setStatus("Failed to load demo. Please try again.")
      }
    }

    loginAsDemo()
  }, [navigate])

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center gap-4">
      <img src={logo} alt="Imagify" className="h-16 w-16 animate-pulse" />
      <p className="text-muted-foreground text-sm">{status}</p>
    </div>
  )
}

export default Demo
