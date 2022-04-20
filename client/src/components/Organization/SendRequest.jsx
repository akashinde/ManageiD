import React from "react";
import { useState } from "react";

import { useHistory } from "react-router-dom";

const SendRequest = ({ data }) => {
  const initialState = {
    userAddress: "",
    aadhar: false,
    pancard: false,
    passport: false,
  };

  const [form, setForm] = useState(initialState);
  const { instance, account } = data;

  const history = useHistory();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBoolChange = (e) => {
    setForm({ ...form, [e.target.name]: !form[e.target.name] });
  };

  const handleOnSubmit = async () => {
    try {
      let user = await instance.methods.getUser(form.userAddress).call();
      let org = await instance.methods.getOrganisation(account).call();

      let requestId = user._userId + org._organisationId;

      let isRequestExist = await instance.methods.getRequest(requestId).call();

      if (isRequestExist._requestId == "") {
        console.log("Adding request");
        await instance.methods
          .addRequest(
            requestId,
            user._firstName,
            form.userAddress,
            org._organisationName,
            account,
            form.aadhar.toString(),
            form.pancard.toString(),
            form.passport.toString()
          )
          .send({ from: account });

        alert("Request sent");
        history.push("/org/home");
      } else {
        alert("Request already exist");
        window.location.reload(false);
      }
    } catch (error) {
      console.log("Error at sendRequest OnSubmit event", error);
    }
  };

  return (
    <div className="container mt-5 p-4 pb-5 m-auto w-25 border border-light shadow rounded">
      <h3>Request Documents</h3>
      <form>
        <div className="form-group">
          <input
            className="form-control"
            type="text"
            name="userAddress"
            placeholder="Enter public address of User"
            value={form.userAddress}
            onChange={handleChange}
          />
        </div>

        <label>Select Documents to Request</label>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={form.aadhar}
            name="aadhar"
            onChange={handleBoolChange}
          />
          <label className="form-check-label" htmlFor="aadhar">
            Aadhar
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={form.pancard}
            name="pancard"
            onChange={handleBoolChange}
          />
          <label className="form-check-label" htmlFor="pancard">
            Pancard
          </label>
        </div>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={form.passport}
            name="passport"
            onChange={handleBoolChange}
          />
          <label className="form-check-label" htmlFor="passport">
            Passport
          </label>
        </div>

        <button
          type="button"
          className="btn btn-secondary float-right"
          onClick={() => history.push("/org/home")}
        >
          Cancel
        </button>
        <button
          type="button"
          className="btn btn-secondary float-right"
          onClick={handleOnSubmit}
        >
          Request
        </button>
      </form>
    </div>
  );
};

export default SendRequest;
