import { supabase } from "@/app/api/config/supabaseClient";

export async function POST(request) {
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
