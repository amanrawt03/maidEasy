import { me } from "@/app/api/controllers/authController";

export async function GET(req) {
  return me(req);
}
