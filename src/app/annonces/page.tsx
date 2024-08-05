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

interface Comment {
  id: string;
  content: string;
  timestamp: string;
  userId: string;
  listingId: string;
  user: {
    name: string;
  };
}

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [comments, setComments] = useState<{ [key: string]: Comment[] }>({});
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const response = await fetch('/api/card');
      const data: Card[] = await response.json();
      setCards(data);

      // Fetch comments for each card
      data.forEach((card) => fetchComments(card.id));
    } catch (error) {
      setError('Failed to fetch cards');
    }
  };

  const fetchComments = async (listingId: string) => {
    try {
      const response = await fetch(`/api/comments?listingId=${listingId}`);
      const data: Comment[] = await response.json();
      setComments((prev) => ({ ...prev, [listingId]: data }));
    } catch (error) {
      setError('Failed to fetch comments');
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

  const handleAddComment = async (listingId: string) => {
    try {
      const response = await fetch('/api/comments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment[listingId],
          userId: 'user-id', // Remplacez par l'ID de l'utilisateur actuel
          listingId,
        }),
      });

      if (response.ok) {
        const addedComment = await response.json();
        setComments((prev) => ({
          ...prev,
          [listingId]: [...(prev[listingId] || []), addedComment],
        }));
        setNewComment((prev) => ({ ...prev, [listingId]: '' }));
      } else {
        setError('Failed to add comment');
      }
    } catch (error) {
      setError('Failed to add comment');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.id} className="bg-white p-6 rounded-lg shadow-md">
            <img src={card.imageSrc} alt={card.title} className="w-full h-48 object-cover mb-4 rounded-md" />
            <h2 className="text-xl font-bold mb-2">{card.title}</h2>
            <p className="text-gray-700 mb-2">{card.description}</p>
            <p className="text-gray-500 mb-2">Location: {card.locationValue}</p>
            <p className="text-gray-500 mb-2">Category: {card.category}</p>
            <p className="text-gray-900 font-bold mb-4">Price: ${card.price}</p>
            <button
              onClick={() => handleDelete(card.id)}
              className="py-2 px-4 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Delete
            </button>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Comments</h3>
              {comments[card.id]?.map((comment) => (
                <div key={comment.id} className="mb-2">
                  <p className="text-gray-700"><strong>{comment.user.name}:</strong> {comment.content}</p>
                  <p className="text-gray-500 text-sm">{new Date(comment.timestamp).toLocaleString()}</p>
                </div>
              ))}
              <input
                type="text"
                value={newComment[card.id] || ''}
                onChange={(e) => setNewComment({ ...newComment, [card.id]: e.target.value })}
                placeholder="Add a comment"
                className="w-full p-2 border border-gray-300 rounded-md mb-2"
              />
              <button
                onClick={() => handleAddComment(card.id)}
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Add Comment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
