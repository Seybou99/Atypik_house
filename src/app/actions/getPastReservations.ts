import axios from 'axios';

const getPastReservations = async ({ userId }: { userId: string }) => {
  try {
    const response = await axios.get(`/api/pastReservations?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des réservations passées:', error);
    return [];
  }
};

export default getPastReservations;
