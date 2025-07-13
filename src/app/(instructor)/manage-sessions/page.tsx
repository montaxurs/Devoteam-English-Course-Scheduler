import Link from "next/link";
// FIX: Import the new, correct server action
import { getMyCreatedSessions } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PlusCircle, Users, Clock } from "lucide-react";

export default async function ManageSessionsPage() {
  // FIX: Call the new, correct server action
  const sessions = await getMyCreatedSessions();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manage Your Sessions
          </h1>
          <p className="text-muted-foreground">
            Here you can create new sessions and view your existing ones.
          </p>
        </div>
        <Link href="/manage-sessions/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Session
          </Button>
        </Link>
      </div>

      {sessions.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardHeader>
                <CardTitle>{session.title}</CardTitle>
                <CardDescription>
                  {new Date(session.startTime).toLocaleDateString('en-US', { dateStyle: 'long' })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(session.startTime).toLocaleTimeString('en-US', { timeStyle: 'short' })}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{session.participants.length} / {session.capacity} booked</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border-2 border-dashed bg-card p-12 text-center">
          <h3 className="text-lg font-semibold">No Sessions Created</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Click the button above to create your first session.
          </p>
        </div>
      )}
    </div>
  );
}
