import React, { useState, useRef } from "react";
import { useHistory } from "react-router";

import ipfs from "../../ipfs";

const UserHome = ({ data }) => {
  const history = useHistory();

  const hiddenAadharInput = useRef(null);
  const hiddenPassportInput = useRef(null);
  const hiddenPancardInput = useRef(null);

  const initialState = {
    aadhar: {
      fileName: "",
      buffer: null,
      hash: "",
    },
    pancard: {
      fileName: "",
      buffer: null,
      hash: "",
    },
    passport: {
      fileName: "",
      buffer: null,
      hash: "",
    },
  };
  const [file, setFile] = useState(initialState);
  const [edit, setEdit] = useState(false);

  const { instance, account, uploadedDocs, requests } = data;

  const ipfsUrl = "https://ipfs.infura.io/ipfs";

  const handleAadharClick = () => {
    hiddenAadharInput.current.click();
  };

  const handlePancardClick = () => {
    hiddenPancardInput.current.click();
  };

  const handlePassportClick = () => {
    hiddenPassportInput.current.click();
  };

  const handleSaveClick = async () => {
    try {
      if (file["aadhar"].buffer) {
        let aadharFile = await ipfs.add(file["aadhar"].buffer);
        uploadedDocs["aadhar"] = aadharFile.path;
      }

      if (file["pancard"].buffer) {
        let pancardFile = await ipfs.add(file["pancard"].buffer);
        uploadedDocs["pancard"] = pancardFile.path;
      }

      if (file["passport"].buffer) {
        let passportFile = await ipfs.add(file["passport"].buffer);
        uploadedDocs["passport"] = passportFile.path;
      }
    } catch (error) {
      console.log("Error while uploading files to ipfs");
    }

    try {
      console.log(uploadedDocs);
      await instance.methods
        .uploadUserDocs(
          account,
          uploadedDocs.aadhar,
          uploadedDocs.pancard,
          uploadedDocs.passport
        )
        .send({ from: account });
    } catch (error) {
      console.log("Error while uploadUserDocs");
    }

    window.location.reload(false);
  };

  const handleApprove = async (requestId, aadhar, pancard, passport) => {
    try {
      await instance.methods
        .updateRequest(
          requestId,
          aadhar == "true" ? uploadedDocs.aadhar : aadhar,
          pancard == "true" ? uploadedDocs.pancard : pancard,
          passport == "true" ? uploadedDocs.passport : passport,
          "2"
        )
        .send({ from: account });
      window.location.reload(false);
    } catch (error) {
      console.log("Error at handleApprove", error);
    }
  };

  const handleReject = async (requestId, aadhar, pancard, passport) => {
    try {
      await instance.methods
        .updateRequest(requestId, "", "", "", "3")
        .send({ from: account });
      window.location.reload(false);
    } catch (error) {
      console.log("Error at handleApprove", error);
    }
  };

  const fileToBuffer = (file, cb) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload = function () {
      cb(null, Buffer(reader.result));
    };
    reader.onerror = function (error) {
      cb(error, null);
    };
  };

  const onUploadFileChange = ({ target }) => {
    if (target.files < 1 || !target.validity.valid) {
      return;
    }
    fileToBuffer(target.files[0], (err, result) => {
      if (result) {
        setFile({
          ...file,
          [target.name]: { fileName: target.files[0].name, buffer: result },
        });
      }
    });
  };

  const Button = ({ name, func }) => {
    return (
      <button className="button-other" onClick={func}>
        {name}
      </button>
    );
  };

  const UploadInput = ({ name, refName }) => {
    return (
      <input
        ref={refName}
        name={name}
        type="file"
        onChange={onUploadFileChange}
        accept="application/pdf"
        style={{ display: "none" }}
      />
    );
  };

  const Request = ({ req }) => {
    return (
      <div className="container">
        <p>{req._organisationName}</p>

        {req._status == 1 ? (
          <div>
            <button
              onClick={() => {
                handleApprove(
                  req._requestId,
                  req._aadhar,
                  req._pancard,
                  req._passport
                );
              }}
            >
              Approve
            </button>
            <button
              onClick={() => {
                handleReject(
                  req._requestId,
                  req._aadhar,
                  req._pancard,
                  req._passport
                );
              }}
            >
              Reject
            </button>
          </div>
        ) : (
          (req._status == 2 && "Approved") || (req._status == 3 && "Rejected")
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <h1 className="heading">Documents</h1>
      <hr />
      {!edit && (
        <button className="button-other" onClick={() => setEdit(!edit)}>
          Edit
        </button>
      )}
      <div className="container border p-3 rounded mb-3 mt-5">
        <h4 className="mr-auto d-inline">Aadhar Card</h4>
        {file.aadhar.fileName && <p>{file.aadhar.fileName}</p>}
        {edit ? (
          <Button
            name={uploadedDocs.aadhar ? "Update" : "Add"}
            func={handleAadharClick}
          />
        ) : (
          uploadedDocs.aadhar && (
            <a
              className="btn btn-info float-right mr-2"
              href={`${ipfsUrl}/${uploadedDocs.aadhar}`}
              target="_blank"
            >
              View
            </a>
          )
        )}
        <UploadInput name={"aadhar"} refName={hiddenAadharInput} />
      </div>

      <div className="container border p-3 rounded mb-3">
        <h4 className="mr-auto d-inline">Pancard</h4>
        {file.pancard.fileName && <p>{file.pancard.fileName}</p>}
        {edit ? (
          <Button
            name={uploadedDocs.pancard ? "Update" : "Add"}
            func={handlePancardClick}
          />
        ) : (
          uploadedDocs.pancard && (
            <a
              className="btn btn-info float-right mr-2"
              href={`${ipfsUrl}/${uploadedDocs.pancard}`}
              target="_blank"
            >
              View
            </a>
          )
        )}
        <UploadInput name={"pancard"} refName={hiddenPancardInput} />
      </div>

      <div className="container border p-3 rounded mb-3">
        <h4 className="mr-auto d-inline">Passport</h4>
        {file.passport.fileName && <p>{file.passport.fileName}</p>}
        {edit ? (
          <Button
            name={uploadedDocs.passport ? "Update" : "Add"}
            func={handlePassportClick}
          />
        ) : (
          uploadedDocs.passport && (
            <a
              className="btn btn-info float-right mr-2"
              href={`${ipfsUrl}/${uploadedDocs.passport}`}
              target="_blank"
            >
              View
            </a>
          )
        )}
        <UploadInput name={"passport"} refName={hiddenPassportInput} />
      </div>

      {edit && (
        <>
          <Button name={"Cancel"} func={() => window.location.reload(false)} />
          <Button name={"Save"} func={handleSaveClick} />
        </>
      )}
      <div>
        <h1 className="mt-5">Requests</h1>
        {requests.map((t, index) => (
          <Request req={t} key={index} />
        ))}
      </div>
    </div>
  );
};

export default UserHome;
