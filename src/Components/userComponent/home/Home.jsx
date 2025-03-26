import React from 'react'
import Banner from "../home/Baner"
import Category from './Category'
import Collections from './Collections'
import NewArrival from './NewArrival'
import myImage from '../../../Assets/home/yoraaButtom2.png'
const Home = () => {
  return (
    <div className='bg-[#F5F5F5]'>
      {/* <Banner/> */}
      <Category/>
      {/* <Collections/> */}
      <NewArrival/>
      <div className=''>
  <img src={myImage} alt="Sample" className="w-full h-auto" />
</div>
    </div>
  )
}

export default Home