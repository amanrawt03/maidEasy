import { register } from "@/app/api/controllers/authController";

export async function POST(req) {
  return register(req);
}
