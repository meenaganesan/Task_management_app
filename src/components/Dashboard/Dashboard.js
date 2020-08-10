import React, { useEffect, useState } from 'react'
import '../Dashboard/Dashboard.css'
import Addtask from '../Addtask/Addtask'
import Prompt from '../Prompt/Prompt'
import { useHistory } from 'react-router-dom'
import Auth from '../Auth'
import {toast} from 'react-toastify'

const notifySuccess = (data) => {
  toast.dismiss()
  toast.success(data, { autoClose: true })
}
const notifyError = (data) => {
  toast.dismiss()
  toast.error(data, { autoClose: false })
}


const Dashboard = () => {
  let history = useHistory()
  const openOverlay = (status, data, id='') =>  {
    if(data) {
      updateOverlayType('update')
    } else {
      updateOverlayType('add')
    }
    setId(id)
    if(status === '') {
      fetchTask()
    }
    updateOverlay(status)
    select(data)
  }

  const deleteTask = () => {
    fetch('https://task-management-rest-app.herokuapp.com/api/tasks/' + id, {
      method: 'DELETE',
      headers: {'Authorization': 'Bearer' +  window.localStorage.getItem('token'), 'Content-Type': 'application/json'}
    })
      notifySuccess('Deleted Succesfully')
      openOverlay('', undefined, '')
      setTimeout(fetchTask(), 1500)
  }

  //state variables
  const [tableData, updateData] = useState([])
  const [overlay, updateOverlay] = useState('')
  const [selectedData, select] = useState(undefined)
  const [overlayType, updateOverlayType] = useState('add')
  const [id, setId] = useState('')
  const [showDropDown, openDropDown] = useState(false)

  const logout = () => {
    window.localStorage.setItem('token', '')
    Auth.signout()
    history.push('/')
  }

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
      updateOverlay('')
      select({})
    })
  }, [])

  const getData = (data) => {
    let string = ''
    data.forEach((item) => {
     if(item  === 1) {
       string = string.concat('Feature')
     } else if(item === 2){
        string = string.concat(' Front-end ')
     } else if(item === 3){
        string = string.concat(' Change-Request ')
     } else if(item === 4){
        string = string.concat(' Back-end ')
     }
    })
    return string
  }

  const overlayComponent = overlay === 'addTask' ? <Addtask data={selectedData} type={overlayType} onClose={openOverlay}></Addtask> : overlay === 'prompt' ? <Prompt delete={deleteTask} onClose={openOverlay}></Prompt> : ''
  return(
    <div id='dashboard'>
      {overlayComponent}
      <div className='header'>
        <div>Task Management</div>
        <div className='profile' onClick={openDropDown}>
          <div className='profileImg'></div>
          <div>{window.localStorage.getItem('userName')}</div>
          <button className='submitButton' onClick={logout}>Logout</button>
        </div>
        
      </div>
      <div className='body'>
        <div className='bodyHead'>
          <div className='tableHead'>Task Management</div>
          <div className='searchBox'>
            <input className='inputbox' type='text' name='search' placeholder='Search'></input>
            <button className='submitButton' onClick={ () => {openOverlay('addTask', undefined)}}>ADD TASK</button>
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
                    <td className='td'>{item.priority === 1 ? 'High' : item.priority === 2 ? 'Medium' : 'Low'}</td>
                    <td className='td'>{item.type === 1 ? 'Task' : item.type === 2 ? 'Story' : 'Bug'}</td>
                    <td className='td'>{getData(item.label)}</td>
                    <td className='td'><button className='transparentButton cursorPointer' onClick={ () => {openOverlay('addTask', item)}}>EDIT</button></td>
                    <td className='td'><button className='transparentButton cursorPointer' onClick={ () => {openOverlay('prompt', undefined, item._id)}}>DELETE</button></td>
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