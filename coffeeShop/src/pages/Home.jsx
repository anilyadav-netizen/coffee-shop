import React from 'react'
import Footer from '../component/Footer'
import Hero from './Hero'
import CategoryPage from './CategoryPage'
import Types from './Types'
import Favourite from './Favourite'
import Benfits from './Benfits'
import Review from './Review'
import Journey from './Journey'
import Login from './Login'

const Home = () => {
    return (
        <>
            <Hero />
            <Types />
            <CategoryPage />
            <Favourite />
            <Benfits />
            <Journey />
            <Review />
        </>
    )
}

export default Home