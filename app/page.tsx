import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Leaf, Satellite, Brain, Bell } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      <nav className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Leaf className="h-6 w-6 text-primary" />
            <span>Land ReGen</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            AI-Powered Soil Health Monitoring for a Greener Planet
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-pretty">
            Monitor land degradation in real-time, detect soil erosion early, and get AI-driven recommendations for
            sustainable land management.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up">
              <Button size="lg" className="text-lg px-8">
                Start Monitoring
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
                View Demo
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="bg-card p-6 rounded-lg border">
            <Satellite className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Satellite Imagery</h3>
            <p className="text-sm text-muted-foreground">
              Analyze land health using real-time satellite data and remote sensing technology.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <Brain className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm text-muted-foreground">
              Get intelligent insights on soil degradation, vegetation loss, and erosion risks.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <Bell className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-Time Alerts</h3>
            <p className="text-sm text-muted-foreground">
              Receive instant notifications when critical degradation is detected in your land areas.
            </p>
          </div>
          <div className="bg-card p-6 rounded-lg border">
            <Leaf className="h-10 w-10 text-primary mb-4" />
            <h3 className="text-lg font-semibold mb-2">Recommendations</h3>
            <p className="text-sm text-muted-foreground">
              Get data-driven suggestions for reforestation, soil conservation, and sustainable practices.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
