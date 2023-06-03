import React from 'react';

const Chats = () => {
  return (
    <div className='chats'>
        <div className='userChat'>
            <img src='https://randomuser.me/api/portraits/lego/5.jpg' alt='' className='image'/>
            <div className='userChatInfo'>
                <span className='span_custom'>John</span>
                <p className='pg'>Hello</p>
            </div>
        </div>
        <div className='userChat'>
            <img src='https://randomuser.me/api/portraits/lego/5.jpg' alt='' className='image'/>
            <div className='userChatInfo'>
                <span className='span_custom'>Surya</span>
                <p className='pg'>Hello</p>
            </div>
        </div>
        <div className='userChat'>
            <img src='https://randomuser.me/api/portraits/lego/5.jpg' alt='' className='image'/>
            <div className='userChatInfo'>
                <span className='span_custom'>Mike</span>
                <p className='pg'>Hello</p>
            </div>
        </div>
        <div className='userChat'>
            <img src='https://randomuser.me/api/portraits/lego/5.jpg' alt='' className='image'/>
            <div className='userChatInfo'>
                <span className='span_custom'>Sai</span>
                <p className='pg'>Hello</p>
            </div>
        </div>
    </div>
  )
}

export default Chats