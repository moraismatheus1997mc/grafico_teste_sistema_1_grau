
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="text-center text-white mb-8 animate-fade-in-down">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
        Surf Math
      </h1>
      <h2 className="text-xl md:text-2xl font-light text-cyan-200">
        Encontre o Pico da Onda Perfeita
      </h2>
    </header>
  );
};

export default Header;
