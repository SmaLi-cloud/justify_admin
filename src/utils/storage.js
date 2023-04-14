import Cookies from 'js-cookie';

function get(key) {
    let value = sessionStorage.getItem(key);
    if (value) {
        return JSON.parse(value);
    }
    return null;
}

function set(key, value) {
    value = JSON.stringify(value);
    return sessionStorage.setItem(key, value);
}

function remove(key) {
    return sessionStorage.removeItem(key);
}

export default {
    get,
    set,
    remove,
};