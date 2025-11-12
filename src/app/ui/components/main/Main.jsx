"use client";

import { useEffect, useState } from "react";
import {Seeker} from "../seeker/Seeker";
import { Helper } from "../helper/Helper";

export const Main = ({ userId }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/endpoints/auth/me?userId=${userId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to fetch user");

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user:", error.message);
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) return <div>Loading...</div>;

  if (userData.role === "seeker") {
    return <Seeker phone={userData.contact_number} userId={userId} />;
  }

  if (userData.role === "helper") {
    return <Helper helperId={userId} uName={userData.username} />;
  }

  return <div>Hello, Welcome</div>;
};
