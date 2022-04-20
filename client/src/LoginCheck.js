const LoginCheck = (function () {
    const getStatus = function() {
        return sessionStorage.getItem('login');
    }

    const setStatus = function(status) {
        sessionStorage.setItem('login', status)
    }

    return {
        getStatus: getStatus,
        setStatus: setStatus
    }
})();

export default LoginCheck;