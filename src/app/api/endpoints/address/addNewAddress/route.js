import { addNewAddress } from "@/app/api/controllers/addressController";
export const POST = async (req) => {
  return await addNewAddress(req);
}