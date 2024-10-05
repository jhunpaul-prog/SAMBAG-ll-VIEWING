import React from 'react';
import Navbar from './Header/Navbar';
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Events from './Pages/ReportsMap';
import Headroom from 'react-headroom';
import Footer from './Header/Footer';

function App() {
  return (
    <div>
      <Headroom >
        <Navbar />
      </Headroom>
     <Layout/>

    </div>
  );
}

export default App;
