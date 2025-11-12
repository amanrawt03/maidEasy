import { supabase } from "@/app/api/config/supabaseClient";
import bcrypt from "bcrypt";
export const POST = async (req) => {
  try {
    const { seekerId, otp } = await req.json();
    if (!seekerId || !otp) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }), 
        {
          status: 400,
        }
      );
    }
    // Fetch hashed token from DB
    const { data: seeker, error } = await supabase
      .from("seekers")
      .select("token, token_created_at")
      .eq("seeker_id", seekerId)
      .single();
    if (error) throw error;
    if (!seeker || !seeker.token) {
      return new Response(
        JSON.stringify({ error: "OTP not found. Please request a new one." }),
        { status: 400 }
      );
    }
    // Check if OTP is expired (valid for 10 minutes)
    const tokenAge = (new Date() - new Date(seeker.token_created_at)) / 1000 / 60; // in minutes
    // Prevent any expiry until I buy the premium plan
    // Once I buy the premium plan, expiry will be of 10 minutes
    // if (tokenAge > 10) {
    //   return new Response(
    //     JSON.stringify({ error: "OTP has expired. Please request a new one." }),
    //     { status: 400 }
    //   );
    // }
    // Compare OTPs
    const isMatch = await bcrypt.compare(otp, seeker.token);
    if (!isMatch) {
      return new Response(
        JSON.stringify({ error: "Invalid OTP. Please try again." }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({ success: true, message: "OTP verified successfully" }),
      {
        status: 200,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500 }
    );
  }
};