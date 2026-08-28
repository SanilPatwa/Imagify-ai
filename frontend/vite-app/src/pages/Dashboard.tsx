import { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { Plus, Mic, ChevronDown } from "lucide-react"
import logo from "../assets/logo.png"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
}

function Dashboard() {
  const navigate = useNavigate()
  const [prompt, setPrompt] = useState("")
  const [images, setImages] = useState<GeneratedImage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setError("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const res = await axios.post(
        "http://localhost:3000/api/images/generate",
        { prompt },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const newImage: GeneratedImage = {
        id: crypto.randomUUID(),
        url: res.data.imageUrl,
        prompt,
      }

      setImages((prev) => [newImage, ...prev])
      setPrompt("")
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to generate image")
      } else {
        setError("Something went wrong")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  const latestImage = images[0]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-7 w-7" />
          <span className="text-lg font-bold tracking-tight">Imagify</span>
        </div>
        <button
          onClick={handleLogout}
          className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10"
        >
          Log out
        </button>
      </header>

      {/* Main image display */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto p-6">
        {loading ? (
          <div className="flex h-80 w-full max-w-xl items-center justify-center rounded-2xl bg-white/5">
            <span className="text-sm text-white/50">Generating...</span>
          </div>
        ) : latestImage ? (
          <div className="flex w-full max-w-xl flex-col items-center gap-3">
            <img
              src={latestImage.url}
              alt={latestImage.prompt}
              className="max-h-[55vh] w-full rounded-2xl object-cover"
            />
            <p className="text-center text-sm text-white/60">
              Here's your image for:{" "}
              <span className="text-white/90 italic">
                "{latestImage.prompt}"
              </span>
            </p>
          </div>
        ) : (
          <div className="flex h-80 w-full max-w-xl items-center justify-center rounded-2xl border border-dashed border-white/20 text-sm text-white/40">
            Your generated image will appear here
          </div>
        )}
      </div>

      {error && (
        <p className="pb-2 text-center text-sm text-red-400">{error}</p>
      )}

      {/* Bottom input bar */}
      <form
        onSubmit={handleGenerate}
        className="mx-auto mb-6 flex w-full max-w-2xl items-center gap-2 rounded-full bg-white/10 px-4 py-2"
      >
        <button
          type="button"
          className="text-white/60 hover:text-white"
          aria-label="Add"
        >
          <Plus size={20} />
        </button>

        <input
          type="text"
          placeholder="Describe the image you want to create..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
        />

        <button
          type="button"
          className="flex items-center gap-1 rounded-full px-2 py-1 text-sm text-white/70 hover:bg-white/10"
        >
          Flash
          <ChevronDown size={14} />
        </button>

        <button
          type="button"
          className="text-white/60 hover:text-white"
          aria-label="Voice input"
        >
          <Mic size={18} />
        </button>
      </form>

      <p className="pb-4 text-center text-xs text-white/30">
        AI generated images may not always be accurate.
      </p>
    </div>
  )
}

export default Dashboard
