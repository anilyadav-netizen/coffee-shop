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
import WhyUs from './WhyUs'
import OurStore from './OurStore'
const Home = () => {
    return (
        <div
            className="relative min-h-screen bg-cover bg-[#faf2e4] bg-center bg-fixed"
            style={{
                backgroundImage: `url()`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0"></div>

            {/* Content */}
            <div className="relative z-10">
                <Hero />
                <Types />
                <CategoryPage />
                <Favourite />
                <WhyUs />
                <Benfits />
                <Journey />
                <OurStore />
                <Review />
            </div>
        </div>
    )
}

export default Home