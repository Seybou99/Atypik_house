import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    console.error("User not authenticated");
    return new Response("User not authenticated", { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    console.error("Failed to parse request body", error);
    return new Response("Invalid JSON body", { status: 400 });
  }

  const { 
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  } = body;

  // Log the received data
  console.log("Received data:", { 
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
  });

  // Validate received data
  for (const [key, value] of Object.entries(body)) {
    if (!value) {
      console.error(`Missing value for ${key}`);
      return new Response(`Missing value for ${key}`, { status: 400 });
    }
  }

  try {
    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        roomCount,
        bathroomCount,
        guestCount,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: currentUser.id
      }
    });

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
