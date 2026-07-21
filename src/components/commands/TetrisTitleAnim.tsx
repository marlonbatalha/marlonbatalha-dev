'use client';

import React from 'react';

// Configurações do grid
const UNIT = 14;
const BOARD_WIDTH = 7;
const BOARD_HEIGHT = 7;

type ShapeType = 'I' | 'O' | 'T' | 'S' | 'L';

const SHAPES: Record<ShapeType, { x: number; y: number }[]> = {
  I: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }],
  O: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  T: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }],
  S: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
  L: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
};

const COLORS: Record<ShapeType, string> = {
  I: '#00cfff',
  O: '#ffeb3b',
  T: '#a78bfa',
  S: '#00ff88',
  L: '#ff5f57',
};

// Constantes de tempo (segundos) — únicas fontes de verdade
const FALL_DURATION = 0.8;
const FADE_DURATION = 1.0;
const GAP_BETWEEN_SEQUENCES = 1.0;

interface PieceDef {
  shape: ShapeType;
  col: number;
  row: number;
  offset: number; // tempo relativo ao INÍCIO da própria sequência, não do ciclo inteiro
}

interface Sequence {
  pieces: PieceDef[];
  holdBeforeFade: number; // segundos que a montagem fica parada e visível antes de sumir
}

// ---- "Level design": adicione/remova sequências livremente aqui. ----
// Nada abaixo precisa ser recalculado à mão — offset é sempre relativo,
// e o total (CYCLE) é derivado automaticamente logo depois.
const SEQUENCES: Sequence[] = [
  {
    holdBeforeFade: 2.1,
    pieces: [
      { shape: 'I', col: 0, row: 3, offset: 0 },
      { shape: 'L', col: 3, row: 4, offset: 0.6 },
      { shape: 'O', col: 1, row: 5, offset: 1.2 },
      { shape: 'S', col: 4, row: 4, offset: 1.8 },
      { shape: 'T', col: 1, row: 3, offset: 2.4 },
    ],
  },
  {
    holdBeforeFade: 2.1,
    pieces: [
      { shape: 'I', col: 0, row: 3, offset: 0 },
      { shape: 'L', col: 1, row: 4, offset: 0.6 },
      { shape: 'S', col: 3, row: 5, offset: 1.2 },
      { shape: 'O', col: 2, row: 4, offset: 1.8 },
      { shape: 'T', col: 3, row: 3, offset: 2.4 },
    ],
  },
  {
    holdBeforeFade: 2.1,
    pieces: [
      { shape: 'S', col: 0, row: 5, offset: 0 },
      { shape: 'L', col: 3, row: 4, offset: 0.6 },
      { shape: 'I', col: 6, row: 3, offset: 1.2 },
      { shape: 'O', col: 4, row: 4, offset: 1.8 },
      { shape: 'T', col: 1, row: 3, offset: 2.4 },
    ],
  },
  {
    holdBeforeFade: 2.1,
    pieces: [
      { shape: 'I', col: 0, row: 3, offset: 0 },
      { shape: 'L', col: 1, row: 3, offset: 0.6 },
      { shape: 'T', col: 3, row: 3, offset: 1.2 },
      { shape: 'O', col: 5, row: 5, offset: 1.8 },
      { shape: 'S', col: 2, row: 5, offset: 2.4 },
    ],
  },
  {
    holdBeforeFade: 2.1,
    pieces: [
      { shape: 'T', col: 0, row: 3, offset: 0 },
      { shape: 'I', col: 3, row: 3, offset: 0.6 },
      { shape: 'O', col: 5, row: 3, offset: 1.2 },
      { shape: 'L', col: 0, row: 4, offset: 1.8 },
      { shape: 'S', col: 4, row: 5, offset: 2.4 },
    ],
  },
];

// ---- Cálculo automático do timing — é isso que corrige o bug ----
// Para cada sequência: quando ela pousa (última peça) + hold + fade = duração da sequência.
// startOffset[i] = soma das durações anteriores + gap. CYCLE = soma de tudo + gap final.
function computeTimeline() {
  const sequenceDurations = SEQUENCES.map((seq) => {
    const lastPieceOffset = Math.max(...seq.pieces.map((p) => p.offset));
    return lastPieceOffset + FALL_DURATION + seq.holdBeforeFade + FADE_DURATION;
  });

  const startOffsets: number[] = [];
  let cursor = 0;
  sequenceDurations.forEach((duration) => {
    startOffsets.push(cursor);
    cursor += duration + GAP_BETWEEN_SEQUENCES;
  });

  const cycle = cursor; // já inclui o gap final antes do loop reiniciar

  return { startOffsets, sequenceDurations, cycle };
}

const { startOffsets, cycle: CYCLE } = computeTimeline();

// Achata SEQUENCES em uma lista de peças com delay/fadeAt absolutos,
// já garantidamente dentro de [0, CYCLE] e sem colisão entre elas.
const PIECES = SEQUENCES.flatMap((seq, seqIndex) => {
  const seqStart = startOffsets[seqIndex];
  return seq.pieces.map((piece) => ({
    ...piece,
    delay: seqStart + piece.offset,
    fadeAt:
      seqStart +
      Math.max(...seq.pieces.map((p) => p.offset)) +
      FALL_DURATION +
      seq.holdBeforeFade,
  }));
});

const generateCSS = () => {
  const piecesCSS = PIECES.map((piece, i) => {
    const pStart = (piece.delay / CYCLE) * 100;
    const pDropEnd = ((piece.delay + FALL_DURATION) / CYCLE) * 100;
    const pFadeStart = (piece.fadeAt / CYCLE) * 100;
    const pFadeEnd = ((piece.fadeAt + FADE_DURATION) / CYCLE) * 100;

    let css = `
      .piece-${i} {
        animation: fall-${i} ${CYCLE}s infinite linear;
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
