import axios from "axios"
import moment from "moment"
import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

function HomepageComponent() {
    const [drawingList, setDrawingList] = useState([])
    const [update, setUpdate] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        fetchData()
    }, [update])

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:9000/api/v1/draw/list')
            // console.log(response.data);
            setDrawingList(response.data.data)

        } catch (error) {
            console.log(error);
        }
    }

    const deleteData = async (id: string) => {
        try {
            const response = await axios.delete(`http://localhost:9000/api/v1/draw/${id}`)
            // console.log(response.data);
            setDrawingList(response.data.data)
            setUpdate(!update)
        } catch (error) {
            console.log(error);
        }
    }

    console.log(drawingList);

    return (
        <div>
            <h1 className=''><ins>Homepage</ins></h1>
            <div>
                <Button
                    onClick={() => navigate('whiteboard')}
                    variant="outline-success m-5">+ Create new</Button>
            </div>
            <div className=' mt-3 p-2 d-flex justify-content-between align-items-center h-100'>
                <Table striped bordered hover variant="dark">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Drawing Name</th>
                            <th>Created time</th>
                            <th>Last modified</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            drawingList.length > 0 ? drawingList?.map((eachDrawing: any, index) => (
                                <tr key={index}>
                                    <td>{eachDrawing?._id}</td>
                                    <td>{eachDrawing?.name}</td>
                                    <td>{moment(eachDrawing?.createdAt).fromNow()}</td>
                                    <td>{moment(eachDrawing?.updatedAt).fromNow()}</td>
                                    <td className="d-flex justify-content-between">
                                        <Button variant="outline-warning">Edit</Button>
                                        <Button
                                            onClick={() => deleteData(eachDrawing?._id)}
                                            className="ms-3" variant="outline-danger">Delete</Button>
                                    </td>
                                </tr>
                            ))
                                : <p>No Drawing created yet</p>
                        }
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default HomepageComponent