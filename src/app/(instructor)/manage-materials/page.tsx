import { getMyCreatedSessions } from "@/lib/actions";
import { MaterialForm } from "@/components/(custom)/manage-materials/MaterialForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link as LinkIcon, File as FileIcon } from "lucide-react";
import { DeleteMaterialButton } from "@/components/(custom)/manage-materials/DeleteMaterialButton";
import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { SessionsTable } from "@/schema";
import { eq } from "drizzle-orm";

export default async function ManageMaterialsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const sessionsForForm = await getMyCreatedSessions();
  
  const sessionsWithMaterials = await db.query.SessionsTable.findMany({
      where: eq(SessionsTable.creatorId, userId),
      with: {
          materials: true
      }
  });

  const allMaterials = sessionsWithMaterials.flatMap(s => s.materials.map(m => ({...m, sessionTitle: s.title})));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manage Course Materials
          </h1>
          <p className="text-muted-foreground">
            Add, view, and remove materials for your sessions.
          </p>
        </div>
        <MaterialForm sessions={sessionsForForm} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Materials</CardTitle>
          <CardDescription>A list of all materials you have added to your sessions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {allMaterials.length > 0 ? (
              allMaterials.map((material) => (
                <div key={material.id} className="flex items-center justify-between rounded-md border p-4">
                  <div className="flex items-center gap-4">
                    {material.type === 'file' ? <FileIcon className="h-5 w-5 text-muted-foreground" /> : <LinkIcon className="h-5 w-5 text-muted-foreground" />}
                    <div>
                      {/* FIX: Add the 'download' attribute for file types to trigger download */}
                      <a 
                        href={material.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="font-semibold hover:underline"
                        download={material.type === 'file'}
                      >
                        {material.title}
                      </a>
                      <p className="text-sm text-muted-foreground">For: {material.sessionTitle}</p>
                    </div>
                  </div>
                  <DeleteMaterialButton materialId={material.id} />
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-muted-foreground py-8">
                You have not added any materials yet.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
