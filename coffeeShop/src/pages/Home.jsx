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
import bgImage from '../assets/Images/HomePageBgImage.png'
import homeImage from '../assets/Images/homeImage.png'
import zero from '../assets/Images/zero.png'
const Home = () => {
    return (
        <div
            className="relative min-h-screen bg-cover bg-center bg-fixed"
            style={{
                backgroundImage: `url(${zero})`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Content */}
            <div className="relative z-10">
                <Hero />
                <Types />
                <CategoryPage />
                <Favourite />
                <Benfits />
                <Journey />
                <Review />
            </div>
        </div>
    )
}

export default Home