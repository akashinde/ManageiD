import React from "react";

import LoginCheck from "../LoginCheck";

import { useHistory } from "react-router-dom";

const Navbar = ({ name, loggedIn }) => {
  const history = useHistory();

  const handleClick = () => {
    LoginCheck.setStatus("");
    history.push("/");
  };

  const handleLogoClick = () => {
    if (loggedIn === "" || loggedIn === null) {
      history.push("/");
    } else {
      history.push(`/${loggedIn}/home`);
    }
  };

  return (
    <React.Fragment>
      <nav className="navbar-container">
        <span className="navbar-logo" onClick={handleLogoClick}>
          ManageiD
        </span>
        <span className="navbar-text">{loggedIn && `Welcome, ${name}`}</span>
        {loggedIn && (
          <button className="button-logout" onClick={handleClick}>
            Log out
          </button>
        )}
      </nav>
    </React.Fragment>
  );
};

export default Navbar;
