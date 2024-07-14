import React, { useRef, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBrush, faEraser, faCircle, faTrash } from '@fortawesome/free-solid-svg-icons';

function Canvas(props) {
  const socket = props.socket;
  
  const [isLeftPlayer, setIsLeftPlayer] = useState(props.left); // Change this to test left/right player logic
  const [isRightPlayer, setIsRightPlayer] = useState(props.right); // Change this to test left/right player logic
  const canDraw = true;
  const canvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const contextRef = useRef(null);
  const offscreenContextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(null);
  const [lastY, setLastY] = useState(null);
  const [mode, setMode] = useState('draw'); // 'draw' or 'erase'
  const [brushColor, setBrushColor] = useState('black');
  const [brushSize, setBrushSize] = useState(8);
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

        drawMiddleLine();
      }
    };

    const drawMiddleLine = () => {
      const middleX = canvas.width / 2; // Middle of the scaled canvas
      context.save();
      context.scale(0.5, 0.5); // Adjust for the scaling
      context.beginPath();
      context.moveTo(middleX, 0);
      context.lineTo(middleX, canvas.height);
      context.strokeStyle = 'gray';
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
      context.restore();
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

    // socket.on('clear', () => {
    //   clearCanvas(false);
    // });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [socket]);

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
    if(!canDraw) return;
    const { offsetX } = event.nativeEvent;
    if ((isLeftPlayer && offsetX > canvasRef.current.width / 4) || 
        (isRightPlayer && offsetX <= canvasRef.current.width / 4)) return;

    setIsDrawing(true);
    const { offsetX: x, offsetY: y } = event.nativeEvent;
    setLastX(x);
    setLastY(y);
  };

  const handleMouseMove = (event) => {
    if(!canDraw) return;
    if (!isDrawing) return;
    const { offsetX, offsetY } = event.nativeEvent;
    if ((isLeftPlayer && offsetX > canvasRef.current.width / 4) || 
        (isRightPlayer && offsetX <= canvasRef.current.width / 4)) {
      setIsDrawing(false);
      return;
    }
    drawLine(lastX, lastY, offsetX, offsetY, true, mode);
    setLastX(offsetX);
    setLastY(offsetY);
  };

  const handleMouseUp = () => {
    if(!canDraw) return;
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

//   const clearCanvas = (emit = true) => {
//     const context = contextRef.current;
//     const offscreenContext = offscreenContextRef.current;
//     context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//     offscreenContext.clearRect(0, 0, offscreenCanvasRef.current.width, offscreenCanvasRef.current.height);	
//     if (emit) {
//       socket.emit('clear');
//     }
//   };

  return (
    <div ref={containerRef} className='h-full w-full relative'>
      <div className='z-10 absolute top-0 left-0 p-2 bg-white'>
        <div style={{ display: 'flex', gap: '10px' }} className='pb-2'>
          <button className={`pt-2 h-8 w-8 rounded-full ${mode === 'draw' ? 'outline' : ''}`} onClick={() => setMode('draw')}>
            <FontAwesomeIcon icon={faBrush} style={{ fontSize: '24px' }} />
          </button>
          <button className={`h-8 w-8 rounded-full ${mode === 'erase' ? 'outline' : ''}`} onClick={() => setMode('erase')}>
            <FontAwesomeIcon icon={faEraser} style={{ color: 'pink', fontSize: '24px' }}/>
            </button>
          {/* <button className='hover:font-bold' onClick={() => clearCanvas()}>
            <FontAwesomeIcon icon={faTrash} style={{ fontSize: '24px' }} />
          </button> */}
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => handleBrushColorChange('black')}>
            {/* <FontAwesomeIcon icon={faCircle} style={{ color: 'black' }}  /> */}
            <div className={`bg-black ${brushColor === 'black' ? 'outline' : '' } rounded-full h-6 w-6`}></div>
          </button>
          <button onClick={() => handleBrushColorChange('red')}>
            <div className={`bg-red-500 ${brushColor === 'red' ? 'outline' : '' } rounded-full h-6 w-6`}></div>
          </button>
          <button onClick={() => handleBrushColorChange('blue')}>
            <div className={`bg-blue-500 ${brushColor === 'blue' ? 'outline' : '' } rounded-full h-6 w-6`}></div>
          </button>
          <button onClick={() => handleBrushColorChange('green')}>
            <div className={`bg-green-500 ${brushColor === 'green' ? 'outline' : '' } rounded-full h-6 w-6`}></div>
          </button>
          <button onClick={() => handleBrushSizeChange(8)} >
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '10px' }} className={`rounded-full ${brushSize === 8 ? 'outline-gray-800 outline-offset-2 outline' : ''}`}/>
          </button>
          <button onClick={() => handleBrushSizeChange(12)} >
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '15px' }} className={`rounded-full ${brushSize === 12 ? 'outline-gray-800 outline-offset-2 outline' : ''}`}/>
          </button>
          <button onClick={() => handleBrushSizeChange(25)} >
            <FontAwesomeIcon icon={faCircle} style={{ fontSize: '25px' }} className={`rounded-full ${brushSize === 25 ? 'outline-gray-800 outline-offset-2 outline' : ''}`}/>
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