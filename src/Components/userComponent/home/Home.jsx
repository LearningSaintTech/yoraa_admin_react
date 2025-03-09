import React from 'react'
import Banner from "../home/Baner"
import Category from './Category'
import Collections from './Collections'
import NewArrival from './NewArrival'
const Home = () => {
  return (
    <div>
      <Banner/>
      <Category/>
      <Collections/>
      <NewArrival/>
    </div>
  )
}

export default Home