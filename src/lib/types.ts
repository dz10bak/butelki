export type JobType = "cans" | "plastic" | "glass";
export type JobStatus = "pending" | "in_progress" | "done" | "cancelled";
export type UserRole = "client" | "driver";
export type Locale = "en" | "pl";

export interface Job {
  id: string;
  address: string;
  lat: number;
  lng: number;
  amount: number;
  type: JobType | JobType[];
  depositOnly: boolean;
  status: JobStatus;
  assignedTo: string | null;
  createdAt: number;
  rating?: number;
}
