import React, { useRef, useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3001');

function Canvas() {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [mode, setMode] = useState('draw'); // 'draw' or 'erase'
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    contextRef.current = context;

    const handleResize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth * 2;
        canvas.height = containerRef.current.offsetHeight * 2;
        canvas.style.width = `${containerRef.current.offsetWidth}px`;
        canvas.style.height = `${containerRef.current.offsetHeight}px`;

        context.scale(2, 2);
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    socket.on('currentDrawing', (drawingData) => {
      drawingData.forEach(({ x0, y0, x1, y1, mode }) => {
        drawLine(x0, y0, x1, y1, false, mode);
      });
    });

    socket.on('drawing', ({ x0, y0, x1, y1, mode }) => {
      drawLine(x0, y0, x1, y1, false, mode);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const drawLine = (x0, y0, x1, y1, emit, mode) => {
    const context = contextRef.current;
    context.globalCompositeOperation = mode === 'erase' ? 'destination-out' : 'source-over';
    context.strokeStyle = mode === 'erase' ? 'rgba(0,0,0,1)' : 'black';
    context.lineWidth = mode === 'erase' ? 20 : 5;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();

    if (!emit) return;
    socket.emit('drawing', { x0, y0, x1, y1, mode });
  };

  const handleMouseDown = (event) => {
    setIsDrawing(true);
    const { offsetX, offsetY } = event.nativeEvent;
    setLastX(offsetX);
    setLastY(offsetY);
  };

  const handleMouseMove = (event) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    drawLine(lastX, lastY, offsetX, offsetY, true, mode);
    setLastX(offsetX);
    setLastY(offsetY);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setLastX(null);
    setLastY(null);
  };

  return (
    <div ref={containerRef} className='h-full w-full relative'>
      <div className='z-10 absolute'>
        <button onClick={() => setMode('draw')}>Draw</button>
        <button onClick={() => setMode('erase')}>Erase</button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
}

export default Canvas;
