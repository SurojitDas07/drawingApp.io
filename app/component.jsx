"use client"
import React, { useEffect, useRef, useState } from 'react'

const Component = () => {
const canavasRef = useRef(null);
const [context , setContext] = useState(null);
const [drawing , setDrawing] = useState(false);
const [currentColor , setCurrentColor] = useState('black');
const [lineWidth , setLineWidth] = useState(3);
const [drawingActions , setDrawingActions ] = useState([]);
const [currentPath , setCurrentPath] = useState([]);
const [currentStyle , setCurrentStyle] = useState({color:'black' , lineWidth: 3});
 
  // ...
useEffect(() => {
  if (canavasRef.current) {
    const canvas = canavasRef.current;
    canvas.width = 900;
    canvas.height = 500;
    const cxt = canvas.getContext('2d');
    setContext(cxt);
    reDrawingPreviousData(cxt); // Fix the typo here
  }
}, []);
// ...


  const startDrawing = (e)=>{
    if(context){
        context.beginPath();
        context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setDrawing(true);

    }
  }
  const draw = (e)=>{
    if(!drawing) return;
    if(context){
        context.strokeStyle = currentStyle.color;
        context.lineWidth = currentStyle.lineWidth;
        context.lineTo(e.nativeEvent.offsetX , e.nativeEvent.offsetY);
        context.stroke();
        setCurrentPath([...currentPath , {x: e.nativeEvent.offsetX , y: e.nativeEvent.offsetY}])
    }
  }


  const endDrawing = ()=>{
    setDrawing(false);
    context && context.closePath();
    if(currentPath.length > 0){
        setDrawingActions([...drawingActions, {path : currentPath , style : currentStyle} ]);
    }
    setCurrentPath([]);
  }
  const changeColor = (color )=>{
    setCurrentColor(color);
    setCurrentStyle({...currentStyle,color});

  }
  const changeWidth = (width)=>{
    setLineWidth(width);
    setCurrentStyle({...currentStyle, lineWidth: width});
  }
  
  const undoDrawing = ()=>{
    if(drawingActions.length > 0 ){
      drawingActions.pop();
      const newContext = canavasRef.current.getContext('2d');
      newContext.clearRect(0,0, canavasRef.current.width , canavasRef.current.height);

        drawingActions.forEach(({path , style})=>{
          newContext.beginPath();
          newContext.strokeStyle = style.color;
          newContext.lineWidth = style.lineWidth;
          newContext.moveTo(path[0].x , path[0].y);
          path.forEach((point)=>{
            newContext.lineTo(point.x , point.y);
          })
            newContext.stroke();
        })
    }
  }
  const clearDrawing = ()=>{
    setDrawingActions([]);
    setCurrentPath([]);
    const newContext = canavasRef.current.getContext('2d');
    newContext.clearRect(0,0, canavasRef.current.width , canavasRef.current.height);

  }
   
  const reDrawingPreviousData = (cxt)=>{
    drawingActions.forEach(({path , style})=>{
      cxt.beginPath();
      cxt.strokeStyle = style.color;
      cxt.lineWidth = style.lineWidth;
      cxt.moveTo(path[0].x , path[0].y);
      path.forEach((point)=>{
        cxt.lineTo(point.x , point.y);

      })
      cxt.stroke();
    })
  }
   





  return (
    <div>
    <canvas ref={canavasRef}
    onMouseDown={setDrawing}
    onMouseMove={draw}
    onMouseUp={endDrawing}
    onMouseOut={endDrawing}
    className='border border-gray-400'
    />
    <div className='flex my-4'>
    <div className='flex justify-center space-x-4'>
  {['red', 'blue', 'yellow', 'green', 'pink', 'black', 'orange'].map((color) => (
    <div
      key={color}
      className={`w-8 h-8 rounded-full cursor-pointer ${
        currentColor === color ? (color === 'black' ? 'bg-white' : `bg-${color}-700`) : (color === 'black' ? 'bg-black' : `bg-${color}-500`)
      }`}
      onClick={() => changeColor(color)}
    />
  ))}
</div>

      <div className='flex-grow'/>
      <input 
      type='range'
      min='1'
      max='10'
      value={lineWidth}
      onChange={(e)=>changeWidth(e.target.value)}
      />
    </div>
    <div className='flex justify-center my-4'>
      <button className='bg-blue-500 text-white px-4 py-2 mr-2'
      onClick={undoDrawing}
      >
        Undo
      </button>
      <button className='bg-red-500 text-white px-4 py-2'
       onClick={clearDrawing}
      >
        Clear
      </button>
    </div>
    </div>
  )
}

export default Component 