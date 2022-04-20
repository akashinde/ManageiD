import React from "react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="main-container">
        <Profile name={"User"} login={"/user/login"} create={"/user/create"} />
        <Profile name={"Organization"} login={"/org/login"} create={"/org/create"} />
    </div>
  );
};


const Profile = ({name, login, create}) => {
  return (
    <div className="profile-container">
      <h2>{name}</h2>
      <div>
        <Link to={login}>
          <button className="login-button" >
            Login
          </button>
        </Link>
        <Link to={create}>
          <button className="create-button" >
            Create Account
          </button>
        </Link>
      </div>
    </div>
  )  
}

export default Main;
