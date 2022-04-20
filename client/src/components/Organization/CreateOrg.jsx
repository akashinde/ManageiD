import React from "react";
import { useState } from "react";

import { BsArrowRightShort } from "react-icons/bs";

const CreateOrg = ({ onCreateOrg }) => {
  const initialState = {
    name: "",
    username: "",
    password: "",
  };
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h3 className="heading">
        Create Account
        <BsArrowRightShort size={"30px"} />
      </h3>
      <form className="form-container">
        <input
          className="input-control"
          type="text"
          name="name"
          placeholder="Organisation Name"
          value={form.name}
          onChange={handleChange}
        />
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
          onClick={() => onCreateOrg(form)}
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

export default CreateOrg;
