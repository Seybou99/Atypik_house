import React from "react";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import { SafeReservation, SafeUser } from "@/app/types";

interface HistorysClientProps {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
}

const HistorysClient: React.FC<HistorysClientProps> = ({
  reservations,
  currentUser,
}) => {
  return (
    <Container>
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8">
        {reservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionLabel="Revoir l'historique"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
  );
};

export default HistorysClient;
