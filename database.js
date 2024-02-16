let userStore = {};

module.exports = {
    saveUserDetails: (phoneNumber, userDetails) => {
        userStore[phoneNumber] = userDetails;
    },
    getUserDetails: (phoneNumber) => {
        return userStore[phoneNumber];
    }
};
