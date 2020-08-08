import React from 'react'
import './Prompt.css'

const Prompt = (props) => {
    return (
      <div id='prompt'>
        <div className='prompt-container'>
          <div className='prompt-content'>
            <strong>Are you sure want to delete the task?</strong>
            <div className='desc'>By giving delete the task will be deleted permanently</div>
          </div>
          <div className='bottom-block'>
            <div className='cl-button' onClick={props.onClose}><div>Cancel</div></div>
            <div className='confirm-button' onClick={props.delete} ><div>Delete</div></div>
          </div>
        </div>
      </div>
    )
  }


export default Prompt
