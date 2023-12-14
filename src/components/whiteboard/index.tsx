import { useState } from 'react';
import { Button, Card } from 'react-bootstrap';
function Whiteboard() {

    // draw tool type - pencil, line , rectangle
    const [drawType, setDrawType] = useState('pencil')

    console.log({ drawType });


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
            <Card border="primary h-100 m-5">
                <Card.Body id='onlyCanvas'>
                    <p>This is card body</p>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Whiteboard