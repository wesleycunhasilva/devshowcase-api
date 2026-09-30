const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3333';

export const api = {
  getProfiles: async () => {
    const res = await fetch(`${API_URL}/profiles`);
    if (!res.ok) throw new Error('Erro ao buscar perfis');
    return res.json();
  },
  createProfile: async (data) => {
    const res = await fetch(`${API_URL}/profiles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar perfil');
    return res.json();
  },
  createProject: async (data) => {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Erro ao criar projeto');
    return res.json();
  }
};
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function Portfolio() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProfiles()
      .then(data => setProfiles(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando dados da API...</p>;

  return (
    <div>
      {profiles.map(profile => (
        <div key={profile.id} className="profile-card">
          <h2>{profile.name}</h2>
          <p>{profile.bio}</p>
          
          <h3>Projetos</h3>
          {profile.projects?.map(project => (
            <div key={project.id} className="project-card">
              <h4>{project.title}</h4>
              <p>{project.description}</p>
              <small>Techs: {project.techStack}</small>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}