import React, { useContext } from 'react'
import { UserContext } from '../App'

const Home = () => {
    const[user,setUser]=useContext(UserContext)
  return (
    <div className='h-full px-18 py-10'>
        <h1 className='text-3xl font-semibold text-gray-700'>Welcome Back! {user.username}</h1>
        <p className='text-xl mt-3 text-gray-700'>Have a wonderfull day!</p>
        <div className="mt-5   pt-5">
            <h1 className='text-5xl tracking-wider text-neutral-800 w-fit px-3 py-2 rounded-xl'>Your Works</h1>
            <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 h-screen w-full gap-3 ">
                {
                    [1,2,3,4,5,6,7,8,9].map((element,index)=>{
                        return (
                            <div className="bg-gray-100 rounded-xl w-full h-full" key={index}>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
  )
}

export default Home