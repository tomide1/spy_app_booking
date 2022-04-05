import React, { useEffect, useState } from 'react';

import { Link, useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword, logInWithGoogle, logout } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading, error] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    // if (user) console.log(user);
  }, [user, loading]);

  return (
    <div className="login">
      <div className="login__container">
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {
            !user ?
        <div><button
          className="login__btn"
          onClick={() => logInWithEmailAndPassword(email, password)}
        >
          Login
        </button>
        <button className="login__btn login__google" onClick={logInWithGoogle}>
          Login with Google
        </button></div> :
        
            <button
            className="login__btn"
            onClick={() => {logout(); console.log('logged out')}}
        >
          logout
        </button>
        }
        
      </div>
    </div>
  )
}

export default Login
