"use client";
import { SeekerForm } from "./SeekerForm";
export const Seeker = ({ phone, userId }) => {
  return (
  <>
  Hi! Seeker
  <SeekerForm phone={phone} userId={userId} />
  </>

);
}