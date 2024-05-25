import React from 'react';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './components/Nav';
import Main from './components/Main';
import Footer from './components/Footer';


function App() {

  return (
    <div className="App">
      <Nav />
      <Main />
      <div className="col-sm-12 dark-mode"><Footer /></div>
    </div>
  );
}

export default App;
