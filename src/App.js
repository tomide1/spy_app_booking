import './App.css';
import Login from './component/Login.js';
import { BrowserRouter as Router, Route, Switch, Routes } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/login" exact element={<Login />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
