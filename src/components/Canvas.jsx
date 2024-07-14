import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush, faEraser, faCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

function Canvas(props) {
  const socket = props.socket;

  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const contextRef = useRef(null);
  const offscreenContextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [mode, setMode] = useState('draw'); // 'draw' or 'erase'
  const [brushColor, setBrushColor] = useState('black');
  const [brushSize, setBrushSize] = useState(5);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const offscreenCanvas = offscreenCanvasRef.current;
    const context = canvas.getContext('2d');
    const offscreenContext = offscreenCanvas.getContext('2d');
    
    contextRef.current = context;
    offscreenContextRef.current = offscreenContext;

    const handleResize = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth * 2;
        canvas.height = containerRef.current.offsetHeight * 2;
        canvas.style.width = `${containerRef.current.offsetWidth}px`;
        canvas.style.height = `${containerRef.current.offsetHeight}px`;

        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;

        context.scale(2, 2);
        offscreenContext.scale(2, 2);
        context.lineCap = 'round';
        offscreenContext.lineCap = 'round';
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    socket.on('currentDrawing', (drawingData) => {
      drawingData.forEach(({ x0, y0, x1, y1, mode, color, size }) => {
        drawLine(x0, y0, x1, y1, false, mode, color, size);
      });
    });

    socket.on('drawing', ({ x0, y0, x1, y1, mode, color, size }) => {
      drawLine(x0, y0, x1, y1, false, mode, color, size);
    });

    socket.on('clear', () => {
      clearCanvas(false);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const drawLine = (x0, y0, x1, y1, emit, mode, color = brushColor, size = brushSize) => {
    const context = contextRef.current;
    const offscreenContext = offscreenContextRef.current;

    context.globalCompositeOperation = mode === 'erase' ? 'destination-out' : 'source-over';
    offscreenContext.globalCompositeOperation = mode === 'erase' ? 'destination-out' : 'source-over';

    context.strokeStyle = mode === 'erase' ? 'rgba(0,0,0,1)' : color;
    offscreenContext.strokeStyle = mode === 'erase' ? 'rgba(0,0,0,1)' : color;

    context.lineWidth = size;
    offscreenContext.lineWidth = size;

    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.stroke();
    context.closePath();

    offscreenContext.beginPath();
    offscreenContext.moveTo(x0, y0);
    offscreenContext.lineTo(x1, y1);
    offscreenContext.stroke();
    offscreenContext.closePath();

    if (!emit) return;
    socket.emit('drawing', { x0, y0, x1, y1, mode, color, size });
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
    // Draw a dot if mouse not moved
    if (!isDrawing) return;
    drawLine(lastX, lastY, lastX, lastY, true, mode);

    setIsDrawing(false);
    setLastX(null);
    setLastY(null);
  };

  const handleBrushColorChange = (color) => {
    setBrushColor(color);
    setMode('draw');
  };

  const handleBrushSizeChange = (size) => {
    setBrushSize(size);
  };

  1	
  const clearCanvas = (emit = true) => {
    const context = contextRef.current;
    const offscreenContext = offscreenContextRef.current;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    offscreenContext.clearRect(0, 0, offscreenCanvasRef.current.width, offscreenCanvasRef.current.height);	
    if (emit) {
      socket.emit('clear');
    }
  };

  return (
    <div ref={containerRef} className='h-full w-full relative'>
      <div className='z-10 absolute top-0 left-0 p-2 bg-white'>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className='hover:font-bold' onClick={() => setMode('draw')}>
            <FontAwesomeIcon icon={faBrush} style={{ fontSize: '24px' }} />
          </button>
          <button className='hover:font-bold' onClick={() => setMode('erase')}>
            <FontAwesomeIcon icon={faEraser} style={{ color: 'pink', fontSize: '24px' }}/>
            </button>
          <button className='hover:font-bold' onClick={() => clearCanvas()}>
            <FontAwesomeIcon icon={faTrash} style={{ fontSize: '24px' }} />
          </button>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleBrushColorChange('black')}>
            <FontAwesomeIcon icon={faCircle} style={{ color: 'black' }} />
          </button>
          <button onClick={() => handleBrushColorChange('red')}>
            <FontAwesomeIcon icon={faCircle} style={{ color: 'red' }} />
          </button>
          <button onClick={() => handleBrushColorChange('blue')}>
            <FontAwesomeIcon icon={faCircle} style={{ color: 'blue' }} />
          </button>
          <button onClick={() => handleBrushColorChange('green')}>
            <FontAwesomeIcon icon={faCircle} style={{ color: 'green' }} />
          </button>
          <button onClick={() => handleBrushSizeChange(5)}>
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '5px' }} />
          </button>
          <button onClick={() => handleBrushSizeChange(10)}>
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '10px' }} />
          </button>
          <button onClick={() => handleBrushSizeChange(20)}>
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '20px' }} />
          </button>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseOut={handleMouseUp}
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
      <canvas ref={offscreenCanvasRef} style={{ display: 'none' }} />
    </div>
  );
}

export default Canvas;