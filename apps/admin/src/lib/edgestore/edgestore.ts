"use client";
import { EdgeStoreRouter } from "@/app/api/edgestore/[...edgestore]/route";
import { createEdgeStoreProvider } from "@edgestore/react";

const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>({
    maxConcurrentUploads: 3,
    baseUrl: process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000", // Add this line
  });

export { EdgeStoreProvider, useEdgeStore };
