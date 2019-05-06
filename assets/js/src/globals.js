import apiFetch from './api/index'

window.wp = {
    apiFetch,
    // url: { addQueryArgs },
};

window.userSettings = {
    uid: 2, // Among other things, this uid is used to identify and store editor user preferences in localStorage
};

// set your root path
window.wpApiSettings = {
    root: 'http://localhost:9000'
};