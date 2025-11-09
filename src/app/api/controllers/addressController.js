import { supabase } from "@/app/api/config/supabaseClient";

export const addNewAddress = async (req) => {
  try {
    const { userId, address_line, city, state, country, pincode, landmark } =
      await req.json();
    console.log(userId, address_line, city, state, country, pincode, landmark);
    if (!userId || !address_line || !city || !state || !country || !pincode) {
      return new Response(
        JSON.stringify({ error: "All required fields must be provided" }),
        { status: 400 }
      );
    }

    // Add new address
    const { data, error } = await supabase
      .from("address")
      .insert([
        {
          user_id: userId,
          address_line,
          city,
          state,
          country,
          pincode,
          landmark,
        },
      ])
      .select()
      .single();
    if (error) throw new Error(error.message);

    return new Response(JSON.stringify({ newAddress: data }), { status: 201 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500 }
    );
  }
};

export const getUserAddresses = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "UserId is required" }), {
        status: 400,
      });
    }

    // Fetch user addresses
    const { data: addresses, error } = await supabase
      .from("address")
      .select("*")
      .eq("user_id", userId);

    if (error) throw new Error(error.message);

    return new Response(JSON.stringify({ addresses }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message || "Server error" }),
      { status: 500 }
    );
  }
};
