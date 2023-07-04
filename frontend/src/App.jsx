import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Routes } from 'react-router-dom'
import HomeScreen from './pages/HomeScreen';
import FourOhFour from './pages/FourOhFour';

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomeScreen/>} />
            <Route path="*" element={<FourOhFour/>} />
        </Routes>
    )
}

export default App