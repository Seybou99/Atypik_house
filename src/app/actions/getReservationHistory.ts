import prisma from "@/app/libs/prismadb";
const getReservationHistory = async (userId: string) => {
  try {
    const reservationHistory = await prisma.reservation.findMany({
      where: {
        userId,
        startDate: {
          lt: new Date(), // Sélectionne les réservations dont la date de début est passée
        },
      },
      include: {
        listing: true, // Inclus les détails du listing dans la réservation
      },
    });

    return reservationHistory;
  } catch (error) {
    console.error("Error fetching reservation history:", error);
    return [];
  }
};

export default getReservationHistory;
