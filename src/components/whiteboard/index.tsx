import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import rough from "roughjs";
import { RoughCanvas } from 'roughjs/bin/canvas';

function Whiteboard() {

    // canvas reference state
    const canvasRef = useRef(null);
    // canvas context reference state
    const ctxRef = useRef(null);

    // draw tool type - pencil, line , rectangle
    const [drawType, setDrawType] = useState('pencil')
    // draw color
    const [drawColor, setDrawColor] = useState('black')
    const [allowDrawing, setAllowDrawing] = useState(false)

    const [elements, setElements] = useState([]) as any[]

    useEffect(() => {
        const canvas = canvasRef.current as any
        const ctx = canvas?.getContext('2d')

        ctxRef.current = ctx
    }, [])

    useLayoutEffect(() => {
        const roughCanvas = canvasRef.current !== null && rough.canvas(canvasRef.current)

        elements.forEach((element: any) => {
            if (element.type === "pencil") {
                (roughCanvas as RoughCanvas).linearPath(element.path)
            }

        })

    }, [elements])

    const handleMouseDown = (e: any) => {
        // console.log(e);
        setAllowDrawing(true)
        const { offsetX, offsetY } = e.nativeEvent
        allowDrawing && console.log(offsetX, offsetY);
        if (drawType === "pencil") {
            setElements((previousElements: any) => [
                ...previousElements,
                {
                    type: 'pencil',
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: 'black'
                }
            ])
        }

    }
    const handleMouseMove = (e: any) => {
        const { offsetX, offsetY } = e.nativeEvent
        allowDrawing && console.log(offsetX, offsetY);
        if (allowDrawing) {
            if (drawType === "pencil") {
                const { path } = elements[elements.length - 1]
                const newPath = [...path, [offsetX, offsetY]]

                setElements((previousElements: any[]) => previousElements.map((element: any, index: number) => {
                    if (index === elements.length - 1) {
                        return {
                            ...element,
                            path: newPath
                        }
                    } else {
                        return element
                    }
                }))
            }
        }

    }
    const handleMouseUp = (e: any) => {
        setAllowDrawing(false)
        const { offsetX, offsetY } = e.nativeEvent
        allowDrawing && console.log(offsetX, offsetY);


    }


    return (
        <div className='w-100 h-75'>
            <h1 className=''><ins>WhiteBoard</ins></h1>
            <div className=' mt-3 d-flex justify-content-between align-items-center '>
                <div>
                    <label htmlFor="drawType">Draw Type : </label>
                    <select name="drawType" id="drawType"
                        className='ms-2'
                        onChange={(e) => setDrawType(e.target.value)}
                    >
                        <option value="pencil">Pencil</option>
                        <option value="line">Line</option>
                        <option value="rectangle">Rectangle</option>
                    </select>
                </div>
                <div>
                    <Button variant="outline-danger"> Clear </Button>
                </div>
            </div>
            <div className='h-100 p-3'>
                <canvas
                    ref={canvasRef}
                    className='h-100 w-100 border border-black'
                    onMouseDown={(e) => handleMouseDown(e)}
                    onMouseUp={(e) => handleMouseUp(e)}
                    onMouseMove={(e) => handleMouseMove(e)}
                />
            </div>
        </div>
    )
}

export default Whiteboard