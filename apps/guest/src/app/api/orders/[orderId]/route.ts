// app/api/orders/[orderId]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';
import { headers } from "next/headers";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Add this line
export const preferredRegion = "auto"; // Add this line

// Add CORS headers helper
function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  request: any,
 context: { params: Promise<{ orderId: string }> },
) {
  try {
      const { orderId } = await context.params;
    console.log("API Route Hit - GET /api/orders/[orderId]", orderId);

    if (!orderId) {
      return new NextResponse("Order ID is required", { 
        status: 400,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json",
        }
      });
    }

    // First verify the order exists
    const orderExists = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!orderExists) {
      return new NextResponse(JSON.stringify({ error: "Order not found" }), {
        status: 404,
        headers: {
          ...corsHeaders(),
          "Content-Type": "application/json",
        }
      });
    }

    const headersList = await headers();
    const acceptHeader = headersList.get("accept");
    console.log("Accept header:", acceptHeader);

    // SSE Setup
    if (acceptHeader?.includes("text/event-stream")) {
      console.log("Setting up SSE stream for orderId:", orderId);
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          let previousOrderJson = "";

          const checkForUpdates = async () => {
            try {
              const order = await prisma.order.findUnique({
                where: { id: orderId },
                include: {
                  items: { include: { menuItem: true } },
                  user: true,
                  table: true,
                  review: true,
                },
              });

              if (!order) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ error: "Order not found" })}\n\n`)
                );
                return;
              }

              const currentOrderJson = JSON.stringify(order);
              if (currentOrderJson !== previousOrderJson) {
                controller.enqueue(
                  encoder.encode(`data: ${currentOrderJson}\n\n`)
                );
                previousOrderJson = currentOrderJson;
              }

              // Send a ping every 30 seconds to keep connection alive
              controller.enqueue(encoder.encode(": ping\n\n"));
            } catch (error) {
              console.error("Error in checkForUpdates:", error);
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ error: "Error fetching order" })}\n\n`)
              );
            }
          };

          // Initial data send
          await checkForUpdates();

          const interval = setInterval(checkForUpdates, 5000);

          // Cleanup on client disconnect
          request.signal.addEventListener("abort", () => {
            console.log("Client disconnected, cleaning up");
            clearInterval(interval);
          });
        }
      });

      return new NextResponse(stream, {
        headers: {
          ...corsHeaders(),
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache, no-transform",
          "Connection": "keep-alive",
          "X-Accel-Buffering": "no"
        },
      });
    }

    // Regular HTTP request
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { menuItem: true } },
        user: true,
        table: true,
        review: true,
      },
    });

    return NextResponse.json(order, {
      headers: corsHeaders(),
    });
  } catch (error) {
    console.error("API error:", error);
    return new NextResponse(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: {
        ...corsHeaders(),
        "Content-Type": "application/json",
      }
    });
  }
}