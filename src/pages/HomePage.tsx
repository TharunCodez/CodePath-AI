import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Terminal, Cpu } from 'lucide-react';
import data from '../data.json';
import { Data } from '../types';

const typedData = data as Data;

const HomePage: React.FC = () => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'python': return <Terminal size={24} />;
      case 'java': return <Coffee size={24} />;
      case 'c': return <Cpu size={24} />;
      case 'cpp': return <Terminal size={24} />;
      default: return <Terminal size={24} />;
    }
  };

  return (
    <div className="home-page">
      <h1 className="hero-title">Choose Your Path</h1>
      <p className="hero-subtitle">Select a role to start your coding journey with AI-powered guidance.</p>
      
      <div className="role-grid">
        {typedData.roles.map(role => (
          <div key={role.id} className="role-card">
            <div className="role-icon" style={{ backgroundColor: `${role.color}20`, color: role.color }}>
              {getIcon(role.id)}
            </div>
            <h2 className="role-name">{role.name}</h2>
            <p className="role-desc">{role.description}</p>
            <Link to={`/role/${role.id}`} className="btn-start">
              View Roadmap
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
