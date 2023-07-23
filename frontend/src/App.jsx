import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes } from 'react-router-dom'
import HomeScreen from './pages/navigation/HomeScreen';
import FourOhFour from './pages/error/FourOhFour';
import Landing from './pages/navigation/LandingScreen';
import Register from './pages/auth/Register'
import Feed from './pages/feed/Feed'
import Profile from './pages/profile/Profile';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Landing/>} />
            <Route path="*" element={<FourOhFour/>} />
            <Route path="/home" element={<HomeScreen/>}/>
            <Route path="/login" element={<Register openModal={true}/>} />
            <Route path="/register" element={<Register openModal={false}/>} />
            <Route path="/feed" element={<Feed/>} />
            <Route path="/profile" element={<Profile/>}/>
        </Routes>
    )
}

export default App