import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Join from './pages/Join';
import Game from './pages/Game';
import './sunburst.css'; // Import the sunburst background CSS

const App = () => {
    return (
        <Router>
          <Routes>
            <Route path="/" element={<Join />} />
            <Route path="/:code" element={<Game />} />
          </Routes>
        </Router>
    );
};

export default App;
