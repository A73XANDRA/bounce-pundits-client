
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import HomePage from './Pages/HomePage/HomePage';
import { Routes, Route } from 'react-router-dom';

function App() {

  return (

    <div className='App'>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </div>
  )
}

export default App
