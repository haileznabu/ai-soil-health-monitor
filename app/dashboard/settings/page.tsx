import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/dashboard/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  const { count: unreadAlerts } = await supabase
    .from("alerts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("is_read", false)

  return (
    <>
      <Header title="Settings" unreadAlerts={unreadAlerts || 0} />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Account Settings</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and information</p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details and role</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {profile?.full_name && (
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{profile.full_name}</p>
                  </div>
                )}
                {profile?.role && (
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground">Role</p>
                    <p className="font-medium capitalize">{profile.role}</p>
                  </div>
                )}
                {profile?.organization && (
                  <div className="grid gap-2">
                    <p className="text-sm text-muted-foreground">Organization</p>
                    <p className="font-medium">{profile.organization}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Land ReGen</CardTitle>
                <CardDescription>AI-powered soil health monitoring platform</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Land ReGen uses advanced AI and satellite imagery analysis to monitor land degradation, detect soil
                  erosion, and provide actionable recommendations for sustainable land management and restoration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
