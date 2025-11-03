import React from 'react';
import './Footer.css';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          © {year} Zapetrol ·{' '}
          <a
            href="https://api.precioil.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            API oficial
          </a>
        </p>
      </div>
    </footer>
  );
}
