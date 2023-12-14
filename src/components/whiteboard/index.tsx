/* eslint-disable */
import axios from 'axios';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import rough from "roughjs";
import { RoughCanvas } from 'roughjs/bin/canvas';

const generator = rough.generator();

function Whiteboard() {

    const navigate = useNavigate()

    // canvas reference state
    const canvasRef = useRef(null);
    // canvas context reference state
    const ctxRef = useRef(null);

    // draw tool type - pencil, line , rectangle
    const [drawType, setDrawType] = useState('pencil')
    // draw color
    /* eslint-disable */
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
        setDrawColor('black')
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

    const handleMouseUp = () => {
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

    useEffect(() => {
        console.log(elements);
    }, [elements])


    const handleSave = async (e: any) => {
        e.preventDefault()
        try {
            const response = await axios.post('https://test.trelyt.store/api/v1/draw/new', {
                name: 'Test name',
                shape: elements
            })
            console.log(response.data);
            alert(response.data.message)
            handleClearCanvas()
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className='container text-center d-flex justify-content-center align-items-center' style={{
            height: '100vh',
            width: '100vw'
        }}>
            <div className='w-100 h-75'>
                <h1 className=''><ins>WhiteBoard</ins></h1>
                <div className="mt-3 p-2 d-flex justify-content-start">
                    <Button
                        onClick={() => navigate('/')}
                        variant='outline-primary'> {'<'} Back to home</Button>
                </div>
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
                        <form className="input-group mb-3" onSubmit={(e) => handleSave(e)}>
                            <input required type="text" className="form-control" placeholder="Drawing Name" aria-label="Drawing Name" aria-describedby="button-addon2" />
                            <button className="btn btn-outline-success" type="submit" id="button-addon2">Save</button>
                        </form>

                        {/* <Button variant="outline-success me-2" onClick={() => handleClearCanvas()}> Save </Button> */}
                        <Button variant="outline-danger" onClick={() => handleClearCanvas()}> Clear </Button>
                    </div>
                </div>
                <div
                    className='h-100 w-100 overflow-hidden  border border-black mb-5'
                    onMouseDown={(e) => handleMouseDown(e)}
                    onMouseUp={() => handleMouseUp()}
                    onMouseMove={(e) => handleMouseMove(e)}
                >
                    <canvas
                        ref={canvasRef}
                    />
                </div>
            </div>
        </section>
    )
}

export default Whiteboard