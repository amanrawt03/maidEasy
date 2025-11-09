import { createJob } from "@/app/api/controllers/jobController";

export const POST = async (req) => {
  return createJob(req);
};