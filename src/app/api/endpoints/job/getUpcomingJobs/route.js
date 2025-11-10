import { getUpcomingJobs } from "@/app/api/controllers/jobController";

export const POST = async (req) => {
  return getUpcomingJobs(req);
};