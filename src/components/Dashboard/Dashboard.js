import React, { useEffect, useState } from 'react'
import '../Dashboard/Dashboard.css'
import Addtask from '../Addtask/Addtask'

const Dashboard = () => {
  const openOverlay = (status, data) =>  {
    if(data) {
      updateOverlayType('update')
    } else {
      updateOverlayType('add')
    }
    if(!status) {
      fetchTask()
    }
    updateOverlay(status)
    select(data)
  }

  const deleteTask = (id) => {
    fetch('https://task-management-rest-app.herokuapp.com/api/tasks/' + id, {
      method: 'DELETE',
      headers: {'Authorization': 'Bearer' +  window.localStorage.getItem('token'), 'Content-Type': 'application/json'}
    })
      fetchTask()
  }

  //state variables
  const [tableData, updateData] = useState([])
  const [overlay, updateOverlay] = useState(false)
  const [selectedData, select] = useState(undefined)
  const [overlayType, updateOverlayType] = useState('add')


  const fetchTask = () => {
    fetch('https://task-management-rest-app.herokuapp.com/api/tasks', {
      method: 'GET',
      headers: {'Authorization': 'Bearer' +  window.localStorage.getItem('token'), 'Content-Type': 'application/json'}
    })
    .then((response) => { return response.json()})
    .then((result) => {
      updateData(result.data)
    })
  }
  useEffect(() => {
    fetchTask()
    return (() => {
      updateOverlay(false)
      select({})
    })
  }, [])

  const overlayComponent = overlay ? <Addtask data={selectedData} type={overlayType} onClose={openOverlay}></Addtask> : ''
  return(
    <div id='dashboard'>
      {overlayComponent}
      <div className='header'>
        <div>Task Management</div>
        <div className='profile'>
          <div className='profileImg'></div>
          <div>{window.localStorage.getItem('userName')}</div>
        </div>
      </div>
      <div className='body'>
        <div className='bodyHead'>
          <div>Task Management</div>
          <div className='searchBox'>
            <input className='inputbox' type='text' name='search' placeholder='Search'></input>
            <button className='submitButton' onClick={ () => {openOverlay(true, undefined)}}>ADD TASK</button>
          </div>
        </div>
        <div className='tableDiv'>
          <table className='table'>
            <thead>
              <tr className='tr'>
                <th className='th'>Date</th>
                <th className='th'>Title</th>
                <th className='th'>Description</th>
                <th className='th'>Priority</th>
                <th className='th'>Type</th>
                <th className='th'>Label</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length >0 ? tableData.map((item, i) => {
                return(
                  <tr key={i} className='tr'>
                    <td className='td'>{new Date(item.dueDate).toDateString()}</td>
                    <td className='td'>{item.title}</td> 
                    <td className='td'>{item.description}</td>
                    <td className='td'>{item.priority}</td>
                    <td className='td'>{item.type}</td>
                    <td className='td'>{item.label}</td>
                    <td className='td'><button className='transparentButton' onClick={ () => {openOverlay(true, item)}}>EDIT</button></td>
                    <td className='td'><button className='transparentButton' onClick={ () => {deleteTask(item._id)}}>DELETE</button></td>
                  </tr>
                )
              }) :
              <tr><td colSpan='5' className='noDataText'>No Tasks availabel</td></tr>
              }
            </tbody>
          </table> 
        </div>
        <hr></hr>
        <div className='copyright'>
          <div>Copyright 2020-2021 | All rights reserved</div>
          <div>Privacy Policy | Terms & Condition | Sitemap</div>
        </div>
      </div>
    </div>
  )
}
export default Dashboard;