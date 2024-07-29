"use client";

import React, { useEffect, useState } from 'react';

interface Card {
  id: string;
  title: string;
  description: string;
  imageSrc: string;
  locationValue: string;
  category: string;
  price: number;
}

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/card');
      const data: Card[] = await response.json();
      setCards(data);
    } catch (error) {
      setError('Failed to fetch cards');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/card/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCards(cards.filter((card) => card.id !== id));
      } else {
        setError('Failed to delete card');
      }
    } catch (error) {
      setError('Failed to delete card');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Les Annonces</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.id} className="bg-white p-6 rounded-lg shadow-md">
            <img src={card.imageSrc} alt={card.title} className="w-full h-48 object-cover mb-4 rounded-md"/>
            {/* <h2 className="text-xl font-bold mb-2">{card.title}</h2> */}
            {/* <p className="text-gray-700 mb-2">{card.description}</p> */}
            <p className="text-gray-500 mb-2">{card.locationValue}</p>
            <p className="text-gray-500 mb-2">{card.category}</p>
            <p className="text-gray-900 font-bold mb-4">Prix:{card.price}€</p>
            <button
              onClick={() => handleDelete(card.id)}
              className="py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
