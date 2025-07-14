import Link from "next/link";
import { getMyCreatedSessions } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlusCircle, Users, Clock, MoreHorizontal } from "lucide-react";
import { DeleteSessionButton } from "@/components/(custom)/manage-sessions/DeleteSessionButton";

export default async function ManageSessionsPage() {
  const sessions = await getMyCreatedSessions();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manage Your Sessions
          </h1>
          <p className="text-muted-foreground">
            Here you can create, view, and manage your sessions.
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
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="grid gap-0.5">
                  <CardTitle>{session.title}</CardTitle>
                  <CardDescription>
                    {new Date(session.startTime).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </CardDescription>
                </div>
                {/* --- NEW: Dropdown Menu for Actions --- */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {/* We can add an "Edit" link/item here in the future */}
                    <DeleteSessionButton sessionId={session.id} />
                  </DropdownMenuContent>
                </DropdownMenu>
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
