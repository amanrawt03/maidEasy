import { login } from "@/app/api/controllers/authController";

export async function POST(req) {
  return login(req);
}
