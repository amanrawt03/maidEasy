import { supabase } from "@/app/api/config/supabaseClient";

export const createJob = async (req) => {
  try {
    const { seekerId, addressId, jobType, slot } = await req.json();

    if (!seekerId || !addressId || !jobType || !slot) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Create job
    const { data: job, error } = await supabase
      .from("job")
      .insert([
        {
          seeker_id: seekerId,
          address_id: addressId,
          job_type: jobType,
          scheduled_date: slot, // Changed from scheduled_date to scheduled_date
          job_status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      throw new Error(error.message);
    }

    if (!job) {
      throw new Error("Job creation failed - no data returned");
    }

    console.log("Created job:", job);

    // Note: Socket emission will be handled by the client-side
    return new Response(
      JSON.stringify({
        message: "Job created",
        job: job,
        jobId: job.job_id, // Use job_id instead of id
      }),
      {
        status: 201,
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500 }
    );
  }
};
