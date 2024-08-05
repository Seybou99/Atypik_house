'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/user/profile');
        const user = response.data;
        setName(user.name || '');
        setEmail(user.email || '');
      } catch (error) {
        setError('Échec de la récupération de l\'utilisateur');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put('/api/user/update', { name, email });
      setIsEditing(false);
      router.push('/profil');
    } catch (error) {
      setError('Échec de la mise à jour du profil');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete('/api/user/delete');
      router.push('/api/auth/signout');
    } catch (error) {
      setError('Échec de la suppression du compte');
    }
  };

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Page de profil</h1>
      {isEditing ? (
        <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white p-6 rounded shadow-md">
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Nom</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <div className="flex justify-between">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Enregistrer les modifications
            </button>
            <button type="button" onClick={handleCancel} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <div className="w-full max-w-sm bg-white p-6 rounded shadow-md text-center">
          <p className="mb-4"><strong>Nom :</strong> {name}</p>
          <p className="mb-4"><strong>Email :</strong> {email}</p>
          <div className="flex justify-between">
            <button onClick={handleEdit} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
              Modifier le profil
            </button>
            <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
              Supprimer le compte
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
