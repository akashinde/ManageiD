import React from "react";
import { useHistory } from "react-router";

const OrgMenu = ({ data }) => {
  const history = useHistory();

  const { requests } = data;

  const ipfsUrl = "https://ipfs.infura.io/ipfs";

  const Request = ({ req }) => {
    return (
      <div className="container border p-3 rounded mb-3 mt-1 d-flex justify-content-between">
        <p>{req._userName}</p>
        <p>{req._status === 1 ? "Pending" : "Rejected"}</p>
        {req._status === 2 && (
          <div>
            {req._aadhar !== "" && req._aadhar !== "false" && (
              <a
                className="btn btn-info float-right mr-2"
                href={`${ipfsUrl}/${req._aadhar}`}
                target="_blank"
              >
                Aadhar
              </a>
            )}
            {req._pancard !== "" && req._pancard !== "false" && (
              <a
                className="btn btn-info float-right mr-2"
                href={`${ipfsUrl}/${req._pancard}`}
                target="_blank"
              >
                Pancard
              </a>
            )}
            {req._passport !== "" && req._passport !== "false" && (
              <a
                className="btn btn-info float-right mr-2"
                href={`${ipfsUrl}/${req._passport}`}
                target="_blank"
              >
                Pancard
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container mt-5 p-4 m-auto w-50 border border-light shadow rounded">
      <h1 className="mb-3">Select one</h1>
      <hr />
      <form>
        <div className="container border p-3 rounded mb-3 mt-5">
          <div className="row text-center">
            <div className="col">
              <button
                className="btn btn-primary"
                onClick={() => history.push("/org/home/send-req")}
              >
                Send Request
              </button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h3>History</h3>
            {requests.length > 0 ? (
              requests.map((t, index) => <Request req={t} key={index} />)
            ) : (
              <p>No history available</p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default OrgMenu;
