import React from 'react';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import Footer from './components/Footer';
import './App.css'; // Your main CSS file

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Home />
      </main>
      <Footer />
    </div>
  );
}

export default App;