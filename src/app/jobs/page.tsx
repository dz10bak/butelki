"use client";

import { useState, useEffect } from "react";
import { getJobs, updateJob, getRole } from "@/lib/storage";
import type { Job, UserRole } from "@/lib/types";
import JobCard from "@/components/JobCard";
import BottomNav from "@/components/BottomNav";

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [role, setRoleState] = useState<UserRole | null>(null);

  useEffect(() => {
    setRoleState(getRole());
    setJobs(getJobs());
  }, []);

  const handleAccept = (id: string) => {
    updateJob(id, { status: "in_progress", assignedTo: "driver-1" });
    setJobs(getJobs());
  };

  const isDriver = role === "driver";
  const filtered = isDriver
    ? jobs.filter((j) => j.status === "pending" || j.assignedTo === "driver-1")
    : jobs;

  return (
    <div className="min-h-dvh pb-20">
      <div className="max-w-md mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isDriver ? "Available Jobs" : "My Requests"}
        </h1>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No jobs yet</p>
            {!isDriver && (
              <p className="text-gray-400 text-sm mt-1">Create your first request</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                showAccept={isDriver}
                onAccept={handleAccept}
              />
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
