import React from "react";
import { useState } from "react";

import { BsArrowRightShort } from "react-icons/bs";

const CreateUser = ({ onCreateUser }) => {
  const initialState = {
    fname: "",
    lname: "",
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
        Create Account
        <BsArrowRightShort size={"30px"} />
      </h2>
      <form className="form-container">
        <div>
          <input
            className="input-control"
            type="text"
            name="fname"
            value={form.fname}
            placeholder="First Name"
            onChange={handleChange}
          />
          <input
            className="input-control"
            type="text"
            name="lname"
            placeholder="Last Name"
            value={form.lname}
            onChange={handleChange}
          />
        </div>
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
          value={form.password}
          placeholder="Create Password"
          onChange={handleChange}
        />

        <button
          type="button"
          className="button"
          onClick={() => onCreateUser(form)}
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateUser;
