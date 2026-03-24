export type JobType = "cans" | "plastic" | "glass";
export type JobStatus = "pending" | "in_progress" | "done";
export type UserRole = "client" | "driver";

export interface Job {
  id: string;
  address: string;
  lat: number;
  lng: number;
  amount: number;
  type: JobType;
  depositOnly: boolean;
  status: JobStatus;
  assignedTo: string | null;
  createdAt: number;
}
