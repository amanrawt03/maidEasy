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

export const updateJobStatus = async (request) => {
  try {
    const { jobId, helperId, status } = await request.json();

    if (!jobId || !helperId || !status) {
      return Response.json(
        { error: "Missing required fields: jobId, helperId, status" },
        { status: 400 }
      );
    }
    console.log(`Updating job ${jobId} to status ${status} for helper ${helperId}`);
    // Update job status in database
    const { data, error } = await supabase
      .from("job")
      .update({
        helper_id: helperId,
        job_status: status,
      })
      .eq("job_id", jobId)
      .select();

    if (error) {
      console.error("Database error:", error);
      return Response.json(
        { error: "Failed to update job status" },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    console.log(
      `Job ${jobId} status updated to ${status} for helper ${helperId}`
    );

    return Response.json({
      message: "Job status updated successfully",
      job: data[0],
    });
  } catch (error) {
    console.error("Error updating job status:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const getUpcomingJobs = async (req) => {
  try {
    const { helperId } = await req.json();

    if (!helperId) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    const { data: jobs, error } = await supabase
      .from("job")
      .select()
      .in("job_status", ["accepted", "in_progress"])  // 👈 multiple match
      .eq("helper_id", helperId);


    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to fetch jobs" }),
        { status: 500 }
      );
    }

    if (!jobs || jobs.length === 0) {
      return new Response(
        JSON.stringify({ error: "No jobs found" }),
        { status: 404 }
      );
    }

    // Fetch address for each job
    const jobsWithAddress = await Promise.all(
      jobs.map(async (job) => {
        const { data: addressData, error: addressError } = await supabase
          .from("address")
          .select()
          .eq("address_id", job.address_id)
          .single();

        if (addressError) {
          console.error("Error fetching address:", addressError);
          return { ...job, address: null }; // fallback
        }

        const { address_id, ...rest } = job; // remove address_id
        return { ...rest, address: addressData };
      })
    );

    return new Response(
      JSON.stringify({
        message: "All upcoming jobs fetched successfully",
        jobs: jobsWithAddress,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500 }
    );
  }
};