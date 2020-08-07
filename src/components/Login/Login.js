import React from 'react'
import {Link, useHistory} from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup' 
import sha512 from 'js-sha512'
import '../Login/Login.css'

const validationSchema = Yup.object({
	email: Yup.string().email().required('Email ID is required'),
	password:  Yup.string().required('Password is required')
})

function Login (){
	let history = useHistory()
	const {handleSubmit, handleChange, values, errors} = useFormik({
		initialValues: {
			email: '',
			password: ''
		},
		validationSchema,
		onSubmit(values) {
			console.log(sha512(values.password))
			fetch('https://task-management-rest-app.herokuapp.com/api/users/login',{
				method: 'POST',
				headers: { 'Content-Type': 'application/json'},
				body: JSON.stringify({email: values.email, password: sha512(values.password)})
			})
			.then((response) => {return response.json()})
			.then((result) => { 
				if(result.errors) {

				} else {
					window.localStorage.setItem('token', result.data.accessToken)
					window.localStorage.setItem('userName', result.data.firstName+ ' ' + result.data.lastName)
					return (
						history.push('/dashboard/task')
					)
				}
			})
		}
	})
  return(
    <div id='login'>
			<div className='signupDiv'>
				<span>Need an account?</span>
				<button className='signupButton'>
					<Link to='/signup' className='linkButton'>Signup</Link>
				</button>
			</div>
			<div className='formDiv'>
				<h3>Login</h3>
				<form className='form'>
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
						LOGIN
					</button>
				</form>
			</div>
    </div>
  )
}
export default Login;