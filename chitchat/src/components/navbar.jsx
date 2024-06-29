import React, { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { logoutService } from "../helpers/services";

const Navbar = ({ isLoggedIn, setLogin }) => {
    const history = useHistory()

    function logout(e){
        e.preventDefault()
        logoutService()
        setLogin(false)
    }
    return (
        <nav>
            <a href="#">Chit-Chat</a>
            <ul className="list">
                {isLoggedIn &&
                    <li><a href="#" onClick={logout}>Logout</a></li>
                }
            </ul>
            <button className="search">Search</button>
            <button className="menu">Menu</button>
        </nav>
    )
}

export default Navbar;