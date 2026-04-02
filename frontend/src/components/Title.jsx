import React from 'react';

const Title = ({ text1, text2 }) => {
  return (
    <div className="title-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');

        .title-wrapper {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }

        .title-eyebrow {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .title-eyebrow-line {
          width: 32px;
          height: 1px;
          background: #c4a064;
          opacity: 0.6;
        }

        .title-eyebrow-text {
          font-family: 'Montserrat', sans-serif;
          font-size: 9px;
          font-weight: 500;
          letter-spacing: 0.28em;
          color: #c4a064;
          text-transform: uppercase;
        }

        .title-main {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: clamp(32px, 4vw, 52px);
          color: #1a1612;
          line-height: 1;
          letter-spacing: -0.01em;
          margin: 0;
        }

        .title-main em {
          font-style: italic;
          color: #c4a064;
        }
      `}</style>

      <div className="title-eyebrow">
        <span className="title-eyebrow-line" />
        <span className="title-eyebrow-text">Curated For You</span>
        <span className="title-eyebrow-line" />
      </div>

      <h2 className="title-main">
        {text1} <em>{text2}</em>
      </h2>
    </div>
  );
};

export default Title;