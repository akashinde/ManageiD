import './App.css'

// Hooks
import React, { Fragment, useEffect, useState } from "react";

// Router
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";

// Web3 and Solidity
import getWeb3 from "./getWeb3";
import Manage from "./contracts/Manage.json";

// Components
import Navbar from "./components/Navbar.jsx";
import Main from "./components/Main.jsx";
import GenericNotFound from "./components/GenericNotFound.jsx";
import { CreateUser, LoginUser, UserHome } from "./components/User";
import { CreateOrg, LoginOrg, OrgHome } from './components/Organization'
import { SendRequest } from './components/Organization'

import LoginCheck from './LoginCheck';

function App() {

  const initialDataState = {
    instance: null,
    account: null,
    username: '',
    uploadedDocs: {
      aadhar: '',
      pancard: '',
      passport: ''
    },
    requests: []
  }
  const [data, setData] = useState(initialDataState);

  useEffect(() => {
    async function fetchDetails() {
      try {
        if(window.ethereum) {
          window.ethereum.on('chainChanged', () => {
            window.location.reload();
          })
          window.ethereum.on('accountsChanged', () => {
            LoginCheck.setStatus('')
            history.push('/')
          })
        }
        const web3 = await getWeb3();
        const allAccounts = await web3.eth.getAccounts();
        const _account = allAccounts[0]
        setData(prevState => ({ ...prevState, account: _account }))

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = Manage.networks[networkId];
        if (deployedNetwork) {
          const _instance = new web3.eth.Contract(
            Manage.abi,
            deployedNetwork && deployedNetwork.address
          );
          setData(prevState => ({ ...prevState, instance: _instance }));

          let _user = await _instance.methods
            .getUser(_account)
            .call();
          let _org = await _instance.methods
            .getOrganisation(_account)
            .call();
          let currentLoggedIn
          if (_user._userId != 0) {
            currentLoggedIn = _user
          } else if (_org._organisationId != 0) {
            currentLoggedIn = _org
          }
          if (currentLoggedIn) {
            setData(prevState => ({ 
              ...prevState, 
              username: currentLoggedIn._displayName,
            }));
            let _requestList = currentLoggedIn._requestList
            for (const reqId of _requestList) {
              let _request = await _instance.methods.getRequest(reqId).call();
              if (_request._requestId != '') {
                setData(prevState => ({ 
                  ...prevState, 
                  requests: [...prevState.requests, _request]
                }));
              }
            }

            let _uploadedDocs = await _instance.methods
            .getUserDocs(_account)
            .call();
            let docs = {
              aadhar: _uploadedDocs._aadharHash,
              pancard: _uploadedDocs._pancardHash,
              passport: _uploadedDocs._passportHash,
            }       
            setData(prevState => ({ ...prevState, uploadedDocs: docs }));
          }

        } else {
          window.alert("Manage is not deployed to the network");
        }
      } catch (error) {
        alert(
          `Failed to load web3, account, or contract. Check console for details.`
        );
        console.error(error);
      }
    }
    fetchDetails();
  }, [data])

  const history = useHistory();
  const { username, instance, account } = data;
  const loggedIn = LoginCheck.getStatus();

  const handleCreateUser = async ({ fname, lname, username, password }) => {
    let user
    try {
      user = await instance.methods.getUser(account).call();
    } catch (error) {
      console.log("Error while fetching user: ", error);
    }
    if (user._userId != 0) {
      alert("Account already exist!")
    } else {
      await instance.methods.addUser(account, fname, lname, username, password, [""]).send({ from: account });
      alert("Account created");
      history.push("/");
    }
  };

  const handleLoginUser = async ({ username, password }) => {
    let user
    try {
      user = await instance.methods.getUser(account).call();
    } catch (error) {
      console.log("Error while fetching user: ", error);
    }

    if (user._userId == 0) {
      alert("User not found");
    } else if (username == user._username && password == user._password) {
      alert("Authenticated");
      LoginCheck.setStatus('user');
      history.push("/user/home");
    } else {
      alert("Username or password is wrong")
    }
  }

  const handleCreateOrg = async ({ name, username, password }) => {
    let org
    try {
      org = await instance.methods.getOrganisation(account).call();
    } catch (error) {
      console.log("Error while fetching Organisation: ", error);
    }
    if (org._organisationId != 0) {
      alert("Account already exist!")
    } else {
      try {
        await instance.methods.addOrganisation(account, name, username, password, [""]).send({ from: account });
        alert("Account created");
        history.push("/org/login");
      } catch (error) {
        console.log("Error while adding Organisation: ", error);
      }
    }
  };

  const handleLoginOrg = async ({ username, password }) => {
    let org
    try {
      org = await instance.methods.getOrganisation(account).call();
    } catch (error) {
      console.log("Error while fetching Organisation: ", error);
    }

    if (org._userId == 0) {
      alert("Organisation not found");
    } else if (username == org._username && password == org._password) {
      alert("Authenticated");
      LoginCheck.setStatus('org')
      history.push("/org/home");
    } else {
      alert("Username or password is wrong")
    }
  }

  return (
    <Fragment>
      <div className="App">
        <Navbar name={username} loggedIn={loggedIn} />
        <div className="main">
          <Switch>
            <Route exact path="/">
            { ((loggedIn == '' || loggedIn == null) && <Main />) || (loggedIn && <Redirect to={`/${loggedIn}/home`} />) }
            </Route>
            {/* User */}
            <Route exact path="/user/create">
              <CreateUser onCreateUser={handleCreateUser} />
            </Route>
            <Route exact path="/user/login">
              <LoginUser onLoginUser={handleLoginUser} />
            </Route>
            <Route exact path="/user/home">
              <UserHome data={data} />
            </Route>
            {/* Organization */}
            <Route exact path="/org/create">
              <CreateOrg onCreateOrg={handleCreateOrg} />
            </Route>
            <Route exact path="/org/login">
              <LoginOrg onLoginOrg={handleLoginOrg} />
            </Route>
            <Route exact path="/org/home">
              <OrgHome data={data} />
            </Route>
            {/* Org Home */}
            <Route exact path="/org/home/send-req">
              <SendRequest data={data} />
            </Route>
            
            <Route exact path="*">
              <GenericNotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </Fragment>
  );
}

export default withRouter(App);

// 8fc01fd2247eee14dd3c3242961de9ab24ba7936295cfdc32b6a2a5d3a825701
// (1) 1293067becb8de1bf4a352ce2c845ee36f339517a6bf7b70f7e9e0865689eca9
// (2) 723c4c3b2a91d1587e2d88e7a2501b9f8892d45a76828288664eb21df1b29cd5
// (3) 3a18f4c52d27ad8b448ed9655e61acb3573d0bb7b21f163e2af57f658c45c7c1
// (4) e0a0627e8b7f55547efd0d4ff104e6b763a58a3f365b303b6db40c01ed62fd58
// (5) b80a7724c0e910cf87d1865ae1c705686716745e268002b1682703b315a4a4d0
// (6) 929b64d549f799175467f4c08f6c3b12d782d4712aa1bb6faf58d2d6db71a110
// (7) 3846cae99d871b68aa682b758306f4de3760cd517be247e065d154d90ada5b2c
// (8) 3b616485d1e42c23086a4591ddbe04b088508459b3d3a8054b74e2ff996b0e0b
// (9) 2d286d669bf52f4ab606fdc9f70eac5030a9be6797d00efd953b0e40fd13e57b