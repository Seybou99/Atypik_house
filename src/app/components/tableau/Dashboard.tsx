import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: string;
}

function Dashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch('/api/users/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex flex-col py-10 lg:px-16 md:px-10 px-6 h-screen overflow-y-auto w-full">
      <h2 className="lg:text-3xl md:text-2xl text-xl">Tableau de bord</h2>

      <div className="mt-8">
        <h3 className="lg:text-2xl md:text-xl text-lg mb-4">Utilisateurs</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2">ID</th>
              <th className="py-2">Nom</th>
              <th className="py-2">Email</th>
              <th className="py-2">Date de création</th>
              <th className="py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="py-2 border">{user.id}</td>
                <td className="py-2 border">{user.name || 'N/A'}</td>
                <td className="py-2 border">{user.email || 'N/A'}</td>
                <td className="py-2 border">{new Date(user.createdAt).toLocaleString()}</td>
                <td className="py-2 border">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded"
                    onClick={() => deleteUser(user.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;
