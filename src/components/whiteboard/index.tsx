import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import rough from "roughjs";
import { RoughCanvas } from 'roughjs/bin/canvas';

const generator = rough.generator();

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
        canvas.height = window.innerHeight * 1
        canvas.width = window.innerWidth * 1

        const ctx = canvas?.getContext('2d')
        ctx.strokeStyle = drawColor
        ctx.lineWidth = 2
        ctx.lineCap = "round"

        ctxRef.current = ctx
    }, [])

    useLayoutEffect(() => {
        const roughCanvas = canvasRef.current !== null && rough.canvas(canvasRef.current)

        if (elements.length > 0) {
            (ctxRef?.current as any)?.clearRect(0, 0, (canvasRef?.current as any)?.width, (canvasRef?.current as any)?.height)
        }

        elements.forEach((element: any) => {
            if (element.type === "pencil") {
                (roughCanvas as RoughCanvas).linearPath(element.path, {
                    stroke: element.stroke,
                    roughness: 0,
                    strokeWidth: 5,
                })
            } else if (element.type === "line") {
                (roughCanvas as RoughCanvas).draw(
                    generator.line(element.offsetX, element.offsetY, element.width, element.height, {
                        stroke: element.stroke,
                        roughness: 0,
                        strokeWidth: 5,
                    })
                )
            } else if (element.type === "rectangle") {
                (roughCanvas as RoughCanvas).draw(
                    generator.rectangle(element.offsetX, element.offsetY, element.width, element.height, {
                        stroke: element.stroke,
                        roughness: 0,
                        strokeWidth: 5,
                    })
                )
            }
        })

    }, [elements])

    const handleMouseDown = (e: any) => {
        setAllowDrawing(true)
        const { offsetX, offsetY } = e.nativeEvent
        // allowDrawing && console.log(offsetX, offsetY);
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
        } else if (drawType === "line") {
            setElements((previousElements: any) => [
                ...previousElements,
                {
                    type: 'line',
                    offsetX,
                    offsetY,
                    stroke: 'black'
                }
            ])
        } else if (drawType === "rectangle") {
            setElements((previousElements: any) => [
                ...previousElements,
                {
                    type: 'rectangle',
                    offsetX,
                    offsetY,
                    stroke: 'black'
                }
            ])
        }
    }
    const handleMouseMove = (e: any) => {
        if (!allowDrawing) {
            return;
        }
        const { offsetX, offsetY } = e.nativeEvent

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
        } else if (drawType === "line") {
            setElements((previousElements: any[]) => previousElements.map((element: any, index: number) => {
                if (index === elements.length - 1) {
                    return {
                        ...element,
                        width: offsetX,
                        height: offsetY
                    }
                } else {
                    return element
                }
            }))
        } else if (drawType === "rectangle") {
            setElements((previousElements: any[]) => previousElements.map((element: any, index: number) => {
                if (index === elements.length - 1) {
                    return {
                        ...element,
                        width: offsetX - element.offsetX,
                        height: offsetY - element.offsetY
                    }
                } else {
                    return element
                }
            }))
        }
    }
    const handleMouseUp = (e: any) => {
        setAllowDrawing(false)
        // const { offsetX, offsetY } = e.nativeEvent
        // allowDrawing && console.log(offsetX, offsetY);
    }

    const handleClearCanvas = () => {
        const canvas = canvasRef.current as any

        const ctx = canvas?.getContext('2d')
        ctx.fillRect = "white";
        (ctxRef?.current as any)?.clearRect(0, 0, (canvasRef?.current as any)?.width, (canvasRef?.current as any)?.height)
        setElements([])
    }


    return (
        <div className='w-100 h-75'>
            <h1 className=''><ins>WhiteBoard</ins></h1>
            <div className=' mt-3 p-2 d-flex justify-content-between align-items-center '>
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
                    <Button variant="outline-danger" onClick={() => handleClearCanvas()}> Clear </Button>
                </div>
            </div>
            <div
                className='h-100 w-100 overflow-hidden  border border-black mb-5'
                onMouseDown={(e) => handleMouseDown(e)}
                onMouseUp={(e) => handleMouseUp(e)}
                onMouseMove={(e) => handleMouseMove(e)}
            >
                <canvas
                    ref={canvasRef}
                />
            </div>
        </div>
    )
}

export default Whiteboard