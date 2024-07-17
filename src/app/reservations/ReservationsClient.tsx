'use client';

import { toast } from "react-hot-toast";
import axios from "axios";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { SafeReservation, SafeUser } from "@/app/types"
;
import Heading from "@/app/components/Heading";
import Container from "@/app/components/Container";
import ListingCard from "@/app/components/listings/ListingCard";
import React, { useEffect } from "react";

interface ReservationsClientProps {
  reservations: SafeReservation[],
  currentUser?: SafeUser | null,
}

const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState('');
  const [filteredReservations, setFilteredReservations] = useState<SafeReservation[]>([]);

  const onCancel = useCallback((id: string) => {
    setDeletingId(id);

    axios.delete(`/api/reservations/${id}`)
    .then(() => {
      toast.success('Réservation annulée');
      router.refresh();
    })
    .catch(() => {
      toast.error('Il y a eu une erreur')
    })
    .finally(() => {
      setDeletingId('');
    })
  }, [router]);

  useEffect(() => {
    const currentDate = new Date();
    const filtered = reservations.filter((reservation) => {
      const endDate = new Date(reservation.endDate);
      return endDate >= currentDate; // Garder les réservations dont la date de fin est postérieure ou égale à aujourd'hui
    });
    setFilteredReservations(filtered);
  }, [reservations]);

  return (
    <Container>
      <Heading
        title="Réservations"
        subtitle="Réservations sur vos propriétés"
      />
      <div 
        className="
          mt-10
          grid 
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          xl:grid-cols-5
          2xl:grid-cols-6
          gap-8
        "
      >
        {filteredReservations.map((reservation) => (
          <ListingCard
            key={reservation.id}
            data={reservation.listing}
            reservation={reservation}
            actionId={reservation.id}
            onAction={onCancel}
            disabled={deletingId === reservation.id}
            actionLabel="Annuler la réservation d'un invité"
            currentUser={currentUser}
          />
        ))}
      </div>
    </Container>
   );
}

 
export default ReservationsClient;