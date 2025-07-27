import {
  getAllMyCreatedSessions,
  getAllMyCourseMaterials,
} from "@/lib/actions-manage";
import { MaterialForm } from "@/components/(custom)/manage-materials/MaterialForm";
import { DeleteMaterialButton } from "@/components/(custom)/manage-materials/DeleteMaterialButton";
import { DeleteAiMaterialButton } from "@/components/(custom)/manage-materials/DeleteAiMaterialButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { File as FileIcon, Link as LinkIcon, BookText, BrainCircuit } from "lucide-react";

export default async function ManageMaterialsPage() {
  // Fetch all necessary data in parallel for efficiency
  const { englishSessions, aiSessions } = await getAllMyCreatedSessions();
  const { myEnglishMaterials, myAiMaterials } = await getAllMyCourseMaterials();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="grid gap-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manage Course Materials
          </h1>
          <p className="text-muted-foreground">
            Add, view, or delete materials for your English and AI sessions.
          </p>
        </div>
        {/* The unified form receives both sets of sessions */}
        <MaterialForm
          englishSessions={englishSessions}
          aiSessions={aiSessions}
        />
      </div>

      {/* Unified Materials List */}
      <Card>
        <CardHeader>
          <CardTitle>All Uploaded Materials</CardTitle>
          <CardDescription>
            A list of all materials you've added to your sessions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* English Materials Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <BookText className="mr-2 h-5 w-5 text-blue-500" /> English Course Materials
              </h3>
              {myEnglishMaterials.length > 0 ? (
                <ul className="divide-y divide-border">
                  {myEnglishMaterials.map((material) => (
                    <li key={material.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-4">
                        {material.type === "file" ? (
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{material.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Session:{" "}
                            <span className="font-semibold">
                              {material.session?.title || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <DeleteMaterialButton materialId={material.id} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No materials added for English sessions yet.
                </p>
              )}
            </div>

            {/* AI Materials Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <BrainCircuit className="mr-2 h-5 w-5 text-purple-500" /> AI Course Materials
              </h3>
              {myAiMaterials.length > 0 ? (
                <ul className="divide-y divide-border">
                  {myAiMaterials.map((material) => (
                    <li key={material.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-4">
                        {material.type === "file" ? (
                          <FileIcon className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <LinkIcon className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <p className="font-medium">{material.title}</p>
                          <p className="text-sm text-muted-foreground">
                            Session:{" "}
                            <span className="font-semibold">
                              {material.session?.title || "N/A"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <DeleteAiMaterialButton materialId={material.id} />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No materials added for AI sessions yet.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
