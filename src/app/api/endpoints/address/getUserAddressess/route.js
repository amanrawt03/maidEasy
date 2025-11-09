import { getUserAddresses } from "@/app/api/controllers/addressController";

export const GET = async (req) => {
  return await getUserAddresses(req);
};
