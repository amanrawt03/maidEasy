import { supabase } from "@/app/api/config/supabaseClient";
import bcrypt from "bcrypt";

export const login = async (req) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: "Email and password required" }),
        { status: 400 }
      );
    }

    // Get user
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email);

    if (error || users.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
      });
    }

    const user = users[0];

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 400,
      });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};

export const register = async (req) => {
  try {
    const { username, email, password, role } = await req.json();

    if (!username || !email || !password || !role) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert into DB
    const { data, error } = await supabase
      .from("users")
      .insert([{ username, email, password: hashedPassword, role }])
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    }
    const user = data[0];
    if (role === "seeker") {
      await supabase.from("seekers").insert([{ seeker_id: user.user_id }]);
    } else if (role === "helper") {
      await supabase.from("helpers").insert([{ helper_id: user.user_id }]);
    } else if (role === "admin") {
      await supabase.from("admins").insert([{ admin_id: user.user_id }]);
    }

    return new Response(JSON.stringify({ user }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
    });
  }
};

export const me = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(JSON.stringify({ error: "UserId is required" }), {
        status: 400,
      });
    }

    const { data: userData, error } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", userId)
      .single(); // ✅ Automatically get one record

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    if (!userData) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    // ✅ Remove password before sending
    const { password, ...userInfoWithoutPass } = userData;

    return new Response(JSON.stringify(userInfoWithoutPass), { status: 200 });
  } catch (err) {
    console.error("Error fetching user:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
};
