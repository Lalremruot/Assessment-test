import React, { useEffect, useState } from 'react';
import Assessment from './components/Assessment';
import Detail from './components/Detail';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Detail />} />
        <Route path="/career-quiz" element={<Assessment />} />
      </Routes>
    </Router>
  );
};

export default App;
