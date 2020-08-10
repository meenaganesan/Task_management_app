import React from 'react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import '../Addtask/Addtask.css'
import DatePicker from "react-datepicker"
import {toast} from 'react-toastify'
 
import "react-datepicker/dist/react-datepicker.css";

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
	dueDate: Yup.date().required('Due date is required'),
  type:  Yup.number().required('Type is required'),
  priority: Yup.number().required('Priority is required'),
  label: Yup.array().required('Label is required.')
})

const notifySuccess = (data) => {
  toast.dismiss()
  toast.success(data, { autoClose: true })
}
const notifyError = (data) => {
  toast.dismiss()
  toast.error(data, { autoClose: false })
}

function Addtask (props) {

  function cancel () {
    props.onClose('', undefined)
  }
  const data =  props.data ? props.data.label.map((element) => {return(element.toString())}) : ''
  
  const {handleSubmit, handleChange, values, errors, setFieldValue} = useFormik({
    initialValues: props.data ? 
    {
      title:props.data.title,
      description:props.data.description,
      priority: props.data.priority,
      type: props.data.type.toString(),
      dueDate: props.data.dueDate,
      label: data
		} : {
      title:'',
      description:'',
      priority: 1,
      type: '1',
      dueDate: new Date(),
      label: []
    } ,
		validationSchema,
		onSubmit(values,{resetForm}) {
      if(props.type === 'add') {
        fetch('https://task-management-rest-app.herokuapp.com/api/tasks', {
        method: 'POST',
        headers: {'Authorization': 'Bearer' +  window.localStorage.getItem('token'), 'Content-Type': 'application/json'},
        body: JSON.stringify({...values, type: parseInt(values.type)})
      })
      .then((response) => {return response.json()})
      .then((result) => {
        if(result.error) {
          notifyError(result.message)
        } else {
          notifySuccess('Task added succesfully')
          resetForm({values: {
            title:'',
            description:'',
            priority: 1,
            type: '1',
            dueDate: new Date(),
            label: []
          }})
          cancel()
        }
      })
      
    } else {
      fetch('https://task-management-rest-app.herokuapp.com/api/tasks/' + props.data._id, {
        method: 'PUT',
        headers: {'Authorization': 'Bearer' +  window.localStorage.getItem('token'), 'Content-Type': 'application/json'},
        body: JSON.stringify(values)
      })
      .then((response) => {return response.json()})
      .then((result) => {
        if(result.error) {
          notifyError(result.message)
        } else {
          notifySuccess('Task updated succesfully')
          cancel()
        }
      })
    }
		}
  })
  console.log(values)
  return(
    <div id='addTask'>
			<div className='formDiv'>
				<h3>Add Task</h3>
				<form className='form' onSubmit={handleSubmit}>
          <div className='forminput'>
						<label className='label'>Title</label>
						<input className='inputbox' name='title' value={values.title} onChange={handleChange}></input>
						{errors.title ? <div className='errorText'>{errors.title}</div> : null}
					</div>
          <div className='forminput'>
						<label className='label'>Description</label>
						<textarea className='description' name='description' value={values.description} onChange={handleChange}></textarea>
						{errors.description ? <div className='errorText'>{errors.description}</div> : null}
					</div>
          <div className='displayFlex'>
            <div className='dateInput'>
              <label className='label'>Due Date</label>
              <DatePicker className='inputbox' name='dueDate' selected={new Date(values.dueDate)} onChange={date => setFieldValue('dueDate', date)} name='dueDate'></DatePicker>
              {errors.dueDate ? <div className='errorText'>{errors.dueDate}</div> : null}
            </div>
            <div className='dateInput'>
              <label className='label'>Type</label>
              <div>
               <input type='radio' name='type' value='1' checked={values.type === '1' ? true: false} onChange={handleChange}/>
               <label htmlFor='task'>Task</label>
               <input type='radio' name='type' value='2' checked={values.type === '2' ? true: false} onChange={handleChange}/>
               <label htmlFor='story'>Story</label>
               <input type='radio' name='type'value= '3' checked={values.type === '3' ? true: false} onChange={handleChange}/>
               <label htmlFor='bug'>Bug</label>
              </div>
              {errors.type ? <div className='errorText'>{errors.type}</div> :null}
            </div>
          </div>
          <div className='displayFlex'>
            <div className='dateInput'>
              <label className='label'>Priority</label>
              <select className='inputbox' value={values.priority} name='priority' onChange={handleChange}>
                <option value='1'>High</option>
                <option value='2'>Medium</option>
                <option value='3'>Low</option>
              </select>
              {errors.priority ? <div className='errorText'>{errors.priority}</div> : null}
            </div>
            <div className='dateInput'>
              <label className='label'>Label</label>
              <div className='mr-7'>
                <input type='checkbox' name='label' value='1' checked={values.label.indexOf('1') > -1 ? true : false} onChange={handleChange}/>
                <label htmlFor='label'>Feature</label>
                <input type='checkbox' name='label' value='2' checked={values.label.indexOf('2') > -1 ? true : false} onChange={handleChange}/>
                <label htmlFor='label'>Front-end</label>
              </div> 
              <div className='mr-5'>
                <input type='checkbox' name='label' value='3' checked={values.label.indexOf('3') > -1 ? true : false} onChange={handleChange}/>
                <label htmlFor='label'>Change Request</label>
                <input type='checkbox' name='label' value='4' checked={values.label.indexOf('4') > -1 ? true : false} onChange={handleChange}/>
                <label>Back-end</label>
              </div>
              {errors.label ? <div className='errorText'>{errors.label}</div> : null} 
            </div>
          </div>
          <div className='flexButtons'>
            <button className='cancelButton' type='button' onClick={cancel}>CANCEL</button>
            <button className='submitButton' type='submit'>CREATE</button>
          </div>
					
				</form>
			</div>
    </div>
  )
}
export default Addtask; 