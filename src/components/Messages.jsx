import React from 'react'
import Message from './Message'

const Messages = () => {
  return (
    <div className='messages'>
        <Message className="message"/>
        <Message className="message owner"/>
        <Message className="message"/>
        <Message className="message owner"/>
        <Message className="message"/>
        <Message className="message owner"/>
    </div>
  )
}

export default Messages