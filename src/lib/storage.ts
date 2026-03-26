import { Job, UserRole, Locale } from "./types";

const JOBS_KEY = "bottlecollect_jobs";
const ROLE_KEY = "bottlecollect_role";
const LOCALE_KEY = "bottlecollect_locale";

export function getJobs(): Job[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem(JOBS_KEY);
  return data ? JSON.parse(data) : [];
}

export function addJob(job: Job): void {
  const jobs = getJobs();
  jobs.push(job);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function updateJob(id: string, updates: Partial<Job>): void {
  const jobs = getJobs();
  const index = jobs.findIndex((j) => j.id === id);
  if (index !== -1) {
    jobs[index] = { ...jobs[index], ...updates };
    localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  }
}

export function deleteJob(id: string): void {
  const jobs = getJobs().filter((j) => j.id !== id);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
}

export function getJob(id: string): Job | undefined {
  return getJobs().find((j) => j.id === id);
}

export function getRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ROLE_KEY) as UserRole | null;
}

export function setRole(role: UserRole): void {
  localStorage.setItem(ROLE_KEY, role);
}

export function getLocale(): Locale {
  if (typeof window === "undefined") return "en";
  return (localStorage.getItem(LOCALE_KEY) as Locale) || "en";
}

export function setLocale(locale: Locale): void {
  localStorage.setItem(LOCALE_KEY, locale);
}
