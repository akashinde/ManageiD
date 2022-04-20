import React from "react";
import { useState } from "react";

import { BsArrowRightShort } from "react-icons/bs";

const LoginOrg = ({ onLoginOrg }) => {
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
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        <input
          className="input-control"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="button"
          className="button"
          onClick={() => onLoginOrg(form)}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginOrg;
