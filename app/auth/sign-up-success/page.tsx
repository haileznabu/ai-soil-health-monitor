import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Leaf } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Leaf className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Land ReGen</span>
        </div>
        <Card>
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Check Your Email</CardTitle>
            <CardDescription className="text-center">
              We've sent you a confirmation email. Please check your inbox and click the link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground text-center">
                After confirming your email, you'll be able to sign in and start monitoring land health.
              </p>
              <Link href="/auth/login" className="block">
                <Button className="w-full">Go to Sign In</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
