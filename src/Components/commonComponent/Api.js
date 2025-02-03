import { API_BASE_URL, ACCESS_TOKEN } from './Constant';
import  request from './apiConnecter';

export function getCurrentUser() {
    console.log("inside the getCurrentUser");

    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }
    console.log("inside the getCurrentUser");
    return request({
        url: API_BASE_URL + "/api/user/getUser",
        method: 'GET'
    });
}

export function login(loginRequest) {
    return request({
        url: API_BASE_URL + "/api/auth/login",
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
// export function getUserProfile() {
//     return request({
//         url: API_BASE_URL + "/api/user-profile/24",
//         method: 'GET',
//     });
// }
// export const verifyOtp = async (email, otp) => {
//     console.log("email,otp",email);
//     console.log("email,otp",otp);


//     const response = await fetch(`${API_BASE_URL}/auth/verify-otp?email=${email}&otp=${otp}`, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });

//     if (!response.ok) {
//         throw new Error('Failed to verify OTP');
//     }

//     return response.json();
// };
// export function getPrivateMessage() {
//     console.log("getPrivateMessage");
//     return request({
//         url: API_BASE_URL + "/prii",
//         method: 'GET'
//     });
// }






// export function getAllUsers() {
//     return request({
//         url: API_BASE_URL + "/admin/getAllUsers",
//         method: 'GET'
//     });
// }

// export function getAllRoles() {
//     console.log("getAllRoles");
//     return request({
//         url: API_BASE_URL + "/admin/getAllRoles",
//         method: 'GET'
//     });
// }

// export function updateUserRoleAndStatus(userId, newRoles, newStatus) {
//     const body = {};
//     if (newRoles !== null) body.roles = newRoles;
//     if (newStatus !== null) body.status = newStatus;
// console.log("body inside updateUserRoleAndStatus",body);
//     const headers = new Headers({
//         'Content-Type': 'application/json',
//     });

//     if(localStorage.getItem(ACCESS_TOKEN)) {
//         headers.append('Authorization', 'Bearer ' + localStorage.getItem(ACCESS_TOKEN));
//     }

//     return fetch(`${API_BASE_URL}/admin/users/${userId}`, {
//         method: 'PUT',
//         headers: headers,
//         body: JSON.stringify(body)
//     }).then(response => {
//         const contentType = response.headers.get("content-type");
//         if (contentType && contentType.indexOf("application/json") !== -1) {
//             return response.json().then(json => {
//                 if (!response.ok) {
//                     return Promise.reject(json);
//                 }
//                 return json;
//             });
//         } else {
//             return response.text().then(text => {
//                 if (!response.ok) {
//                     return Promise.reject(text);
//                 }
//                 return text;
//             });
//         }
//     });
// }


