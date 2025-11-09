"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Main } from "./ui/components/main/Main";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tokenValue, setTokenValue] = useState(null);

  useEffect(() => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; token=`);
    const tokenValue = parts.length === 2 ? parts.pop().split(";").shift() : null;

    if (!tokenValue) {
      router.push("/auth/login");
    } else {
      setTokenValue(tokenValue);
      setLoading(false);
    }
  }, [router]);

  if (loading) return null;

  return <Main userId={tokenValue} />;
}
