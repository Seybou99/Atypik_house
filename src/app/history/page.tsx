import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";

import getCurrentUser from "@/app/actions/getCurrentUser";
import getReservations from "@/app/actions/getReservations";
import getReservationHistory from "@/app/actions/getReservationHistory"; // Importe la fonction pour récupérer l'historique des réservations

import HistorysClient from "./HistorysClient"; // Importe le composant pour afficher l'historique des réservations
import TripsClient from "../trips/TripsClient";

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly> 
        <EmptyState
          title="Non autorisé"
          subtitle="Veuillez vous connecter"
        />
      </ClientOnly>
    )
  }

  // Récupère les réservations actuelles de l'utilisateur
  const reservations = await getReservations({ authorId: currentUser.id });

  // Récupère l'historique des réservations de l'utilisateur
  const reservationHistory = await getReservationHistory(currentUser.id);

  if (reservations.length === 0 && reservationHistory.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="Aucune réservation trouvée"
          subtitle="Vous n'avez aucune réservation active ou passée."
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <div>
        {reservations.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Réservations actuelles</h2>
            <TripsClient
              reservations={reservations}
              currentUser={currentUser}
            />
          </div>
        )}

        {reservationHistory.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-center">Historique des réservations</h2>
            <HistorysClient
              reservations={reservationHistory}
              currentUser={currentUser}
            />
          </div>
        )}
      </div>
    </ClientOnly>
  );
}
 
export default ReservationsPage;
