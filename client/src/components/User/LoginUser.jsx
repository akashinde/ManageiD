import React from "react";
import { useState } from "react";

import { BsArrowRightShort } from "react-icons/bs";

const LoginUser = ({ onLoginUser }) => {
  const initialState = {
    username: "",
    password: "",
  };
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h2 className="heading">
        Login
        <BsArrowRightShort size={"30px"} />
      </h2>
      <form className="form-container">
        <input
          className="input-control"
          type="text"
          name="username"
          value={form.username}
          placeholder="Username"
          onChange={handleChange}
        />
        <input
          className="input-control"
          type="password"
          name="password"
          value={form.password}
          placeholder="Password"
          onChange={handleChange}
        />

        <button
          type="button"
          className="button"
          onClick={() => onLoginUser(form)}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginUser;
