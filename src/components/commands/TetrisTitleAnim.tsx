'use client';

import React from 'react';

// Configurações do grid
const UNIT = 14; 
const BOARD_WIDTH = 7; 
const BOARD_HEIGHT = 7; 

type ShapeType = 'I' | 'O' | 'T' | 'S' | 'L';

// Coordenadas relativas (x, y) de cada bloco que forma a peça
const SHAPES: Record<ShapeType, { x: number; y: number }[]> = {
  I: [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:0, y:3}],
  O: [{x:0, y:0}, {x:1, y:0}, {x:0, y:1}, {x:1, y:1}],
  T: [{x:0, y:0}, {x:1, y:0}, {x:2, y:0}, {x:1, y:1}],
  S: [{x:1, y:0}, {x:2, y:0}, {x:0, y:1}, {x:1, y:1}],
  L: [{x:0, y:0}, {x:0, y:1}, {x:0, y:2}, {x:1, y:2}]
};

// Cores neon do tema
const COLORS: Record<ShapeType, string> = {
  I: '#00cfff', // Cyan
  O: '#ffeb3b', // Amarelo
  T: '#a78bfa', // Roxo
  S: '#00ff88', // Verde (brand)
  L: '#ff5f57'  // Vermelho
};

interface PieceConfig {
  shape: ShapeType;
  col: number; 
  row: number; 
  delay: number; 
  fadeAt: number; // Momento (em segundos) que a peça desaparece para a próxima montagem
}

// O "level design" com 3 variações de montagem que se alternam
const PIECES: PieceConfig[] = [
  // Montagem 1 (0s a 6s)
  { shape: 'I', col: 0, row: 3, delay: 0, fadeAt: 5.0 },
  { shape: 'L', col: 3, row: 4, delay: 0.6, fadeAt: 5.0 },
  { shape: 'O', col: 1, row: 5, delay: 1.2, fadeAt: 5.0 },
  { shape: 'S', col: 4, row: 4, delay: 1.8, fadeAt: 5.0 },
  { shape: 'T', col: 1, row: 3, delay: 2.4, fadeAt: 5.0 },

  // Montagem 2 (6s a 12s)
  { shape: 'I', col: 0, row: 3, delay: 6.0, fadeAt: 11.0 },
  { shape: 'L', col: 1, row: 4, delay: 6.6, fadeAt: 11.0 },
  { shape: 'S', col: 3, row: 5, delay: 7.2, fadeAt: 11.0 },
  { shape: 'O', col: 2, row: 4, delay: 7.8, fadeAt: 11.0 },
  { shape: 'T', col: 3, row: 3, delay: 8.4, fadeAt: 11.0 },

  // Montagem 3 (12s a 18s)
  { shape: 'S', col: 0, row: 5, delay: 12.0, fadeAt: 17.0 },
  { shape: 'L', col: 3, row: 4, delay: 12.6, fadeAt: 17.0 },
  { shape: 'I', col: 6, row: 3, delay: 13.2, fadeAt: 17.0 },
  { shape: 'O', col: 4, row: 4, delay: 13.8, fadeAt: 17.0 },
  { shape: 'T', col: 1, row: 3, delay: 14.4, fadeAt: 17.0 },
];

const CYCLE = 18; // Tempo total do loop em segundos (3 ciclos de 6s)
const FALL_DURATION = 0.8; // Tempo de queda de cada peça

const generateCSS = () => {
  const piecesCSS = PIECES.map((piece, i) => {
    const pStart = (piece.delay / CYCLE) * 100;
    const pDropEnd = ((piece.delay + FALL_DURATION) / CYCLE) * 100;
    const pFadeStart = (piece.fadeAt / CYCLE) * 100;
    const pFadeEnd = ((piece.fadeAt + 0.5) / CYCLE) * 100;

    let css = `
      .piece-${i} {
        animation: fall-${i} ${CYCLE}s infinite ease-in;
      }

      @keyframes fall-${i} {
        0% {
          transform: translateY(-${BOARD_HEIGHT * UNIT * 1.5}px);
          opacity: ${piece.delay === 0 ? 1 : 0};
        }
    `;

    if (piece.delay > 0) {
      css += `
        ${(pStart - 0.1).toFixed(2)}% {
          transform: translateY(-${BOARD_HEIGHT * UNIT * 1.5}px);
          opacity: 0;
        }
        ${pStart.toFixed(2)}% {
          transform: translateY(-${BOARD_HEIGHT * UNIT * 1.5}px);
          opacity: 1;
        }
      `;
    }

    css += `
        ${pDropEnd.toFixed(2)}% {
          transform: translateY(0);
          opacity: 1;
        }
        ${pFadeStart.toFixed(2)}% {
          transform: translateY(0);
          opacity: 1;
        }
        ${pFadeEnd.toFixed(2)}% {
          transform: translateY(0);
          opacity: 0;
        }
        100% {
          transform: translateY(0);
          opacity: 0;
        }
      }
    `;

    return css;
  }).join('\n');

  return `
    .tetris-wrapper {
      position: relative;
      width: ${BOARD_WIDTH * UNIT}px;
      height: ${BOARD_HEIGHT * UNIT}px;
    }

    .tetris-piece {
      position: absolute;
    }

    .tetris-block {
      position: absolute;
      width: ${UNIT - 1}px;
      height: ${UNIT - 1}px;
      box-shadow: inset 0 0 4px rgba(0,0,0,0.4);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 2px;
      opacity: 0;
    }

    ${piecesCSS}

    @media (prefers-reduced-motion: reduce) {
      .tetris-block {
        animation: none !important;
        opacity: 1 !important;
        transform: none !important;
      }
    }
  `;
};

export default function TetrisTitleAnim() {
  return (
    <div className="tetris-wrapper" aria-hidden="true">
      {PIECES.map((piece, i) => (
        <div 
          key={i} 
          className="tetris-piece"
          style={{
            left: piece.col * UNIT,
            top: piece.row * UNIT,
          }}
        >
          {SHAPES[piece.shape].map((block, j) => (
            <i
              key={j}
              className={`tetris-block piece-${i}`}
              style={{
                left: block.x * UNIT,
                top: block.y * UNIT,
                backgroundColor: COLORS[piece.shape],
              }}
            />
          ))}
        </div>
      ))}

      <style dangerouslySetInnerHTML={{ __html: generateCSS() }} />
    </div>
  );
}
