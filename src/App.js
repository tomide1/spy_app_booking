import './App.css';
import Login from './component/Login';
import Booking from './pages/Booking';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Booking/>
    </div>
  );
}

export default App;
