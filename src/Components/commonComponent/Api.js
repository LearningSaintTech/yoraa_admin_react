import { API_BASE_URL, ACCESS_TOKEN } from './Constant';
import  request from './apiConnecter';

export function getCurrentUser() {
    console.log("inside the getCurrentUser");

    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    console.log("inside the getCurrentUser");
    return request({
        url: API_BASE_URL + "/user/me",
        method: 'GET'
    });
}

export function getPrivateMessage() {
    console.log("getPrivateMessage");
    return request({
        url: API_BASE_URL + "/prii",
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/auth/login",
        method: 'POST',
        body: JSON.stringify(loginRequest)
    });
}

export function signup(signupRequest) {
    return request({
        url: API_BASE_URL + "/auth/signup",
        method: 'POST',
        body: JSON.stringify(signupRequest)
    });
}

export function getAllUsers() {
    return request({
        url: API_BASE_URL + "/admin/getAllUsers",
        method: 'GET'
    });
}



export function updateUserRoleAndStatus(userId, newRoles, newStatus) {
    const body = {};
    if (newRoles !== null) body.roles = newRoles;
    if (newStatus !== null) body.status = newStatus;
console.log("body inside updateUserRoleAndStatus",body);
    const headers = new Headers({
        'Content-Type': 'application/json',
    });

    if(localStorage.getItem(ACCESS_TOKEN)) {
        headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
    }

    return fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: headers,
        body: JSON.stringify(body)
    }).then(response => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return response.json().then(json => {
                if (!response.ok) {
                    return Promise.reject(json);
                }
                return json;
            });
        } else {
            return response.text().then(text => {
                if (!response.ok) {
                    return Promise.reject(text);
                }
                return text;
            });
        }
    });
}


