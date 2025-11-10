import { updateJobStatus } from "@/app/api/controllers/jobController";

export const POST = async (req) => {
  return updateJobStatus(req);
};