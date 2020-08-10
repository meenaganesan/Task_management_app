import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup' 
import sha512 from 'js-sha512'
import '../Signup/Signup.css'
import Auth from '../Auth'
import {toast}  from 'react-toastify'

const notifySuccess = (data) => {
  toast.dismiss()
  toast.success(data, { autoClose: true })
}
const notifyError = (data) => {
  toast.dismiss()
  toast.error(data, { autoClose: false })
}
const validationSchema = Yup.object({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
	email: Yup.string().email().required('Email ID is required'),
	password:  Yup.string().required('Password is required')
})

function Signup (){
	let history = useHistory()
	const {handleSubmit, handleChange, values, errors} = useFormik({
		initialValues: {
      firstName: '',
      lastName: '',
			email: '',
			password: ''
		},
		validationSchema,
		onSubmit(values) {
			fetch('https://task-management-rest-app.herokuapp.com/api/users',{
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({ firstName: values.firstName, lastName: values.lastName, email: values.email, password: sha512(values.password)})
			})
			.then((response) => {return response.json()})
			.then((result) => { 
				if(result.errors) {
					notifyError(result.errors)
				} else{
					window.localStorage.setItem('token', result.data.accessToken)
					window.localStorage.setItem('userName', result.data.firstName+ ' ' + result.data.lastName)
					Auth.authenticate()
					notifySuccess('Login Succesfull')
					return (
						history.push('/dashboard/task')
					)
				}
			})
		}
	})
  return(
    <div id='signup'>
			<div className='signupDiv'>
				<span>Already have an account?</span>
				<button className='signupButton'>
					<Link to='/login' className='linkButton'>Login</Link>
				</button>
			</div>
			<div className='formDiv'>
				<h3>Signup</h3>
				<form className='form'>
          <div className='forminput'>
						<label className='label'>First Name</label>
						<input className='inputbox' name='firstName' value={values.firstName} onChange={handleChange}></input>
						{errors.firstName ? <div className='errorText'>{errors.firstName}</div> : null}
					</div>
          <div className='forminput'>
						<label className='label'>Last Name</label>
						<input className='inputbox' name='lastName' value={values.lastName} onChange={handleChange}></input>
						{errors.lastName ? <div className='errorText'>{errors.lastName}</div> : null}
					</div>
					<div className='forminput'>
						<label className='label'>Email-Id</label>
						<input className='inputbox' name='email' value={values.email} onChange={handleChange}></input>
						{errors.email ? <div className='errorText'>{errors.email}</div> : null}
					</div>
					<div className='forminput'>
						<label className='label'>Password</label>
						<input className='inputbox' type='password' name='password' value={values.password} onChange={handleChange}></input>
						{errors.password ? <div className='errorText'>{errors.password}</div> : null}
					</div>
					<button className='submitButton' type='submit' onClick={handleSubmit}>
						CONTINUE
					</button>
				</form>
				<div className='termsText'>By Signing up i accept the <strong>Terms & Conditions</strong> and the <strong>Privacy policy</strong> of sync</div>
			</div>
    </div>
  )
}
export default Signup;