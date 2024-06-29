import './App.css';
import React, { useEffect, useState } from 'react';
import ChatPage from './pages/chat/ChatPage';
import {
  Route,
} from "react-router-dom";
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Home from './pages/home/home';
import Navbar from './components/navbar';

function App() {
  const userInfo = localStorage.getItem("userInfo")
  const history = useHistory()
  const [login, setLogin] = useState(!!userInfo)

  useEffect(() => {
    if (!login) { history.push("/"); }
    else { history.push("/chats"); }
  }, [login])

  return (
    <div className='App'>
      <Navbar isLoggedIn={login} setLogin={setLogin} />
      <Route path='/' exact><Home login={setLogin} /></Route>
      {login && <Route path='/chats'><ChatPage /></Route>}
    </div>
  );
}

export default App;
