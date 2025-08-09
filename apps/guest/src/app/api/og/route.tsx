// app/api/og/route.tsx

import db from "@platter/db";
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Extract the domain from the URL parameters
    const { searchParams } = new URL(req.url);
    const domain = searchParams.get("domain");

    if (!domain) {
      return new Response("Missing domain parameter", { status: 400 });
    }

    // Fetch restaurant data
    const restaurantData = await db.user.findUnique({
      where: {
        subdomain: domain,
      },
      select: {
        name: true,
        image: true,
        icon: true,
      },
    });

    if (!restaurantData) {
      return new Response("Restaurant not found", { status: 404 });
    }

    // Use icon if available, otherwise use the main image
    const logoUrl = restaurantData.icon || restaurantData.image;

    // Load the logo if available
    let logoImage = null;
    if (logoUrl) {
      try {
        const logoResponse = await fetch(new URL(logoUrl));
        const arrayBuffer = await logoResponse.arrayBuffer();
        const base64 = Buffer.from(arrayBuffer).toString("base64");
        logoImage = `data:image/png;base64,${base64}`;
      } catch (error) {
        console.error("Error loading logo:", error);
      }
    }

    // Define the title text
    const titleText = `${restaurantData.name} | PlatterNG`;

    // Generate the OG image
    return new ImageResponse(
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#f8f9fa",
          position: "relative",
        }}
      >
        {/* Background Image */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "linear-gradient(to bottom right, #4a5568, #2d3748)",
            opacity: 1.9,
            zIndex: 0,
          }}
        />

        {/* Header Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#000",
            padding: "16px 32px",
            width: "100%",
            zIndex: 10,
          }}
        >
          {logoImage && (
            <img
              src={logoImage}
              width={48}
              height={48}
              style={{
                borderRadius: "50%",
                marginRight: "16px",
              }}
              alt="Restaurant Logo"
            />
          )}
          <h1
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {titleText}
          </h1>
        </div>

        {/* Main Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "64px 32px",
            flexGrow: 1,
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            {logoImage && (
              <img
                src={logoImage}
                width={120}
                height={120}
                style={{
                  borderRadius: "16px",
                  marginRight: "32px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
                alt="Restaurant Logo"
              />
            )}
            <h2
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                color: "#fff",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {restaurantData.name}
            </h2>
          </div>

          <p
            style={{
              fontSize: "24px",
              color: "#fff",
              textAlign: "center",
              maxWidth: "600px",
              textShadow: "0 1px 2px rgba(0,0,0,0.2)",
            }}
          >
            Order food, track your meal, and leave reviews
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 10,
          }}
        >
          <p
            style={{
              fontSize: "18px",
              color: "#fff",
              opacity: 0.8,
            }}
          >
            Powered by PlatterNG
          </p>
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (error) {
    console.error("Error generating OG image:", error);
    return new Response("Error generating image", { status: 500 });
  }
}
