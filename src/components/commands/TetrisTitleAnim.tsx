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
}

// O "level design" do nosso hero: onde cada peça cai e descansa
const PIECES: PieceConfig[] = [
  { shape: 'L', col: 0, row: 4, delay: 0 },
  { shape: 'O', col: 2, row: 5, delay: 0.5 },
  { shape: 'I', col: 4, row: 3, delay: 1.0 },
  { shape: 'T', col: 1, row: 3, delay: 1.5 },
  { shape: 'S', col: 2, row: 3, delay: 2.0 },
];

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
              className="tetris-block"
              style={{
                left: block.x * UNIT,
                top: block.y * UNIT,
                backgroundColor: COLORS[piece.shape],
                animationDelay: `${piece.delay}s`
              }}
            />
          ))}
        </div>
      ))}

      <style jsx>{`
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
          animation: tetrisFall 4s infinite ease-in;
        }

        @keyframes tetrisFall {
          0% {
            transform: translateY(-${BOARD_HEIGHT * UNIT * 1.5}px);
            opacity: 0;
          }
          5% {
            opacity: 1;
          }
          15% {
            transform: translateY(0);
            opacity: 1;
          }
          85% {
            transform: translateY(0);
            opacity: 1;
          }
          95% {
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .tetris-block {
            animation: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
