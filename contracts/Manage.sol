pragma solidity >=0.5.16 <0.8.0;

pragma experimental ABIEncoderV2;

contract Manage {
    address public ContractOwner;

    uint256 public userId = 0;
    uint256 public organisationId = 0;

    constructor() public {
        ContractOwner = msg.sender;
    }

    // User
    struct User {
        uint256 userId;
        address userAddress;
        string firstName;
        string lastName;
        string username;
        string password;
        string[] requestList;
    }
    mapping(address => User) public UserMap; // mapping with addresses

    function addUser(
        address _userAddress,
        string memory _firstName,
        string memory _lastName,
        string memory _username,
        string memory _password,
        string[] memory _requestList
    ) public {
        userId++;
        UserMap[_userAddress] = User(
            userId,
            _userAddress,
            _firstName,
            _lastName,
            _username,
            _password,
            _requestList
        );
    }

    function getUser(address _userAddress)
        public
        view
        returns (
            uint256 _userId,
            string memory _displayName,
            string memory _firstName,
            string memory _lastName,
            string memory _username,
            string memory _password,
            string[] memory _requestList
        )
    {
        User storage thisUser = UserMap[_userAddress];
        return (
            thisUser.userId,
            thisUser.firstName,
            thisUser.firstName,
            thisUser.lastName,
            thisUser.username,
            thisUser.password,
            thisUser.requestList
        );
    }

    // Documents
    struct Docs {
        string aadharHash;
        string pancardHash;
        string passportHash;
    }
    mapping(address => Docs) public DocsMap;

    function uploadUserDocs(
        address _userAddress,
        string memory _aadharHash,
        string memory _pancardHash,
        string memory _passportHash
    ) public {
        DocsMap[_userAddress] = Docs(_aadharHash, _pancardHash, _passportHash);
    }

    function getUserDocs(address _userAddress)
        public
        view
        returns (
            string memory _aadharHash,
            string memory _pancardHash,
            string memory _passportHash
        )
    {
        Docs storage thisDocs = DocsMap[_userAddress];
        return (
            thisDocs.aadharHash,
            thisDocs.pancardHash,
            thisDocs.passportHash
        );
    }

    // Organisation
    struct Organisation {
        uint256 organisationId;
        address organisationAddress;
        string organisationName;
        string username;
        string password;
        string[] requestList;
    }
    mapping(address => Organisation) public OrgnisationMap;

    function addOrganisation(
        address _organisationAddress,
        string memory _organisationName,
        string memory _username,
        string memory _password,
        string[] memory _requestList
    ) public {
        // (uint256 id, , , ) = getUser(user_address);
        // require(id == 0, "User already exist");
        organisationId++;
        OrgnisationMap[_organisationAddress] = Organisation(
            organisationId,
            _organisationAddress,
            _organisationName,
            _username,
            _password,
            _requestList
        );
    }

    function getOrganisation(address _organisationAddress)
        public
        view
        returns (
            uint256 _organisationId,
            string memory _displayName,
            string memory _organisationName,
            string memory _username,
            string memory _password,
            string[] memory _requestList
        )
    {
        Organisation storage thisOrg = OrgnisationMap[_organisationAddress];
        return (
            thisOrg.organisationId,
            thisOrg.organisationName,
            thisOrg.organisationName,
            thisOrg.username,
            thisOrg.password,
            thisOrg.requestList
        );
    }

    // Request
    struct Request {
        string requestId;
        string userName;
        address userAddress;
        string organisationName;
        address organisationAddress;
        string aadhar;
        string pancard;
        string passport;
        string status;
    }
    /* 
        Status
        1: pending
        2: approved
        3: rejected
    */
    mapping(string => Request) public RequestMap; // mapping with requested orgnisation's address

    function addRequest(
        string memory _requestId,
        string memory _userName,
        address _userAddress,
        string memory _organisationName,
        address _organisationAddress,
        string memory _aadhar,
        string memory _pancard,
        string memory _passport
    ) public {
        RequestMap[_requestId] = Request(
            _requestId,
            _userName,
            _userAddress,
            _organisationName,
            _organisationAddress,
            _aadhar,
            _pancard,
            _passport,
            "1"
        );

        User storage thisUser = UserMap[_userAddress];
        thisUser.requestList.push(_requestId);

        Organisation storage thisOrg = OrgnisationMap[_organisationAddress];
        thisOrg.requestList.push(_requestId);
    }

    function getRequest(string memory _id)
        public
        view
        returns (
            string memory _requestId,
            string memory _userName,
            address _userAddress,
            string memory _organisationName,
            address _organisationAddress,
            string memory _aadhar,
            string memory _pancard,
            string memory _passport,
            string memory _status
        )
    {
        Request storage thisRequest = RequestMap[_id];
        return (
            thisRequest.requestId,
            thisRequest.userName,
            thisRequest.userAddress,
            thisRequest.organisationName,
            thisRequest.organisationAddress,
            thisRequest.aadhar,
            thisRequest.pancard,
            thisRequest.passport,
            thisRequest.status
        );
    }

    function updateRequest(
        string memory _requestId,
        string memory _aadhar,
        string memory _pancard,
        string memory _passport,
        string memory _status
    ) public {
        RequestMap[_requestId].aadhar = _aadhar;
        RequestMap[_requestId].pancard = _pancard;
        RequestMap[_requestId].passport = _passport;
        RequestMap[_requestId].status = _status;
    }

    function concatenate(string memory a, string memory b)
        public
        pure
        returns (string memory)
    {
        return string(abi.encodePacked(a, "", b));
    }

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
