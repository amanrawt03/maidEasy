"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {  Container, Header, Title, Subtitle, Form, FormTitle, Input, Button, ErrorText } from "./login.styles";
export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/endpoints/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      document.cookie = `token=${data.user.user_id}; path=/; max-age=3600`;
      router.push("/");
    } catch (err) {
      setError("Something went wrong");
      console.log("error", err);
    }
  };

  return (
    <Container>
      <Header>
        <Title>Maid Easy</Title>
        <Subtitle>Maid for Each Other</Subtitle>
      </Header>

      <Form onSubmit={handleSubmit}>
        <FormTitle>Login</FormTitle>

        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />

        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          required
        />

        {error && <ErrorText>{error}</ErrorText>}

        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
    </Container>
  );
}
