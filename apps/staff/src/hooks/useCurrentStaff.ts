"use client";

import { useEffect, useState } from "react";
import { getCurrentStaffAction } from "@/actions/staff-auth";
import type { StaffUser } from "@/utils/auth";

export function useCurrentStaff() {
  const [staff, setStaff] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStaff() {
      try {
        const currentStaff = await getCurrentStaffAction();
        setStaff(currentStaff);
      } catch (err) {
        setError("Failed to fetch staff details");
        console.error("Error fetching staff:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchStaff();
  }, []);

  return { staff, loading, error };
}
