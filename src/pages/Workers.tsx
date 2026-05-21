"use client";

import { useState, useEffect } from "react";
import { Server, Activity } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { EmptyState, Card, CardContent, Button, Skeleton } from "@/components/ui";

interface WorkerData {
  id: string;
  status: string;
  load: number;
  uptime: string;
}

export default function Workers() {
  const [workers, setWorkers] = useState<WorkerData[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      setWorkers([]);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="px-2 sm:px-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-2">
              Workers
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Manage background analysis workers
            </p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Server className="h-4 w-4 mr-2" />
            Provision Worker
          </Button>
        </div>

        {/* Content */}
        <Card className="glass">
          <CardContent className="pt-6">
            {loading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/50 glass">
                    <div className="flex items-center gap-4 flex-1">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/4" />
                        <Skeleton className="h-3 w-1/3" />
                      </div>
                    </div>
                    <div className="flex gap-8">
                      <div className="hidden sm:block space-y-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <div className="hidden sm:block space-y-2">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-8 w-20 rounded-md" />
                    </div>
                  </div>
                ))}
              </div>
            ) : workers.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="No Workers Active"
                description="There are currently no background workers running. Provision a new worker to speed up repository analysis."
                actionLabel="Start First Worker"
                onAction={() => alert("Worker provisioning would start here!")}
              />
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Workers list would render here.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
