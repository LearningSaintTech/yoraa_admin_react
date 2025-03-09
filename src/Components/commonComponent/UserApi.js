import { API_BASE_URL, ACCESS_TOKEN } from './Constant';
import request from './apiConnecter';

export function getAllCategories() {
    console.log("inside the getallCategories");

    // if (!localStorage.getItem(ACCESS_TOKEN)) {
    //     return Promise.reject("No access token set.");
    // }
    console.log("inside the getCurrentUser");
    return request({
        url: API_BASE_URL + "/api/categories/",
        method: 'GET'
    });
}
export function getAllSubCategories(subcategoryId) {
    console.log("inside the getAllSubCategories");

    // if (!localStorage.getItem(ACCESS_TOKEN)) {
    //     return Promise.reject("No access token set.");
    // }
    console.log("inside the getAllSubCategories");
    return request({
        url: API_BASE_URL + `/api/subcategories/category/${subcategoryId}`,
        method: 'GET'
    });
}
export function getAllCollections() {
    console.log("inside the getAllCollections");

    // if (!localStorage.getItem(ACCESS_TOKEN)) {
    //     return Promise.reject("No access token set.");
    // }
    console.log("inside the getAllCollections");
    return request({
        url: API_BASE_URL + `/api/items?page=1&limit=20`,
        method: 'GET'
    });
}
export function getAllItemsBySubCategory(subCategoryId) {
    console.log("inside the getAllItemsBySubCategory");

    // if (!localStorage.getItem(ACCESS_TOKEN)) {
    //     return Promise.reject("No access token set.");
    // }
    console.log("inside the getAllItemsBySubCategory");
    return request({
        url: API_BASE_URL + `/api/items/subcategory/${subCategoryId}?page=1&limit=10`,
        method: 'GET'
    });
}

export function getItemDetailsById(itemId) {
    console.log("inside the getItemDetailsById");

    // if (!localStorage.getItem(ACCESS_TOKEN)) {
    //     return Promise.reject("No access token set.");
    // }
    console.log("inside the getAllItemsBySubCategory");
    return request({
        url: API_BASE_URL + `/api/itemDetails/${itemId}`,
        method: 'GET'
    });
}
export function addToWishlist(itemId) {
    console.log("Adding item to wishlist:", itemId);

    if (!localStorage.getItem(ACCESS_TOKEN)) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/wishlist/add",
        method: 'POST',
        body: JSON.stringify({ itemId }), // ✅ Send itemId in request body
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`, // ✅ Include access token
        },
    });
}


