"use client";
import { SeekerForm } from "./SeekerForm";
export const Seeker = ({userId}) => {
  return (
  <>
  Hi! Seeker
  <SeekerForm userId={userId} />
  </>

);
}