import { supabase } from "@/app/api/config/supabaseClient";
import otpGenerator from "otp-generator";
import client from "@/app/api/config/twilioClient";
import bcrypt from "bcrypt";

export const POST = async (req) => {
  try {
    const { seekerId, phone } = await req.json();
    if (!phone || !seekerId) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        {
          status: 400,
        }
      );
    }
    // Generate 4-digit OTP
    const otp = otpGenerator.generate(4, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,             
    });

    // Send OTP via Twilio
    await client.messages.create({
      body: `Your MaidEasy verification code is  ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to:  `+91${phone}`,
    });

    // Hash token
    const hashedToken = await bcrypt.hash(otp, 10);

    // Store hashed token in DB
    const { error } = await supabase
      .from("seekers")
      .update({
        token: hashedToken,
        token_created_at: new Date().toISOString(),
      })
      .eq("seeker_id", seekerId);

    if (error) throw error;
    return new Response(
      JSON.stringify({ success: true, message: "OTP sent successfully" }),
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
