import React from 'react';
import './FormLayout.css';
import LogoUCA from '../../assets/logo/06logotipo-60-aniversario-horizontalblanco-3762.png';

function FormLayout({ children }) {
  return (
    <div className="FormLayout page-background--radial"> 
      <header className="FormLayout__header">
        <img src={LogoUCA} alt="Logo Universidad" className="logo" />
      </header>
      <main className="FormLayout__content">
        {children}
      </main>
    </div>
  );
}

export default FormLayout;