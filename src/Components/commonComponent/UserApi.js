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
    console.log("inside the getItemDetailsById",itemId);

    // if (!localStorage.getItem(ACCESS_TOKEN)) {
    //     return Promise.reject("No access token set.");
    // }
    console.log("inside the getItemDetailsById");
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

export function addToCart(itemId, quantity, desiredSize) {
    console.log("Adding item to cart:", itemId, "Quantity:", quantity, "Size:", desiredSize);

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: API_BASE_URL + "/api/cart",  // ✅ Changed to cart API
        method: "POST",
        body: JSON.stringify({ itemId, quantity, desiredSize }),  // ✅ Fixed request body
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ Authorization included
        },
    });
}

export function removeFromWishlist(itemId) {
    console.log("Removing item from wishlist:", itemId);

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: `${API_BASE_URL}/api/wishlist/remove/${itemId}`,
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}

export function removeFromCart(itemId) {
    console.log("Removing item from cart:", itemId);

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: `${API_BASE_URL}/api/cart/item/${itemId}`,
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}
export function getAllWhishlist() {
    console.log("inside the getAllWhishlist");

    // if (!localStorage.getItem(ACCESS_TOKEN)) {
    //     return Promise.reject("No access token set.");
    // }
    console.log("inside the getCurrentUser");
    return request({
        url: API_BASE_URL + "/api/wishlist?page=1&limit=22",
        method: 'GET'
    });
}
export function getAllCart() {
    console.log("inside the getAllWhishlist");

    // if (!localStorage.getItem(ACCESS_TOKEN)) {
    //     return Promise.reject("No access token set.");
    // }
    console.log("inside the getCurrentUser");
    return request({
        url: API_BASE_URL + "/api/cart/user",
        method: 'GET'
    });
}
export const getItemsByFilter = async ({ filters = {}, page = 1, limit = 10, searchText = "" }) => {
    try {
      console.log("Fetching items with filters...", { filters, page, limit, searchText });
  
      const response = await fetch(`${API_BASE_URL}/api/items/filter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filters, page, limit, searchText }),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("Fetched Items Response:", data);
      return data;
    } catch (error) {
      console.error("Error fetching items:", error.message);
      throw error;
    }
  };
  
  export function createAddress(addressData) {
    console.log("Creating address:", addressData);

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: `${API_BASE_URL}/api/address/createAddress`,
        method: "POST",
        body: JSON.stringify(addressData),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}

// Get Addresses by User ID
export function getUserAddresses() {
    console.log("Fetching user addresses");

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: `${API_BASE_URL}/api/address/user`,
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}

// Update Address by ID
export function updateAddress(id, addressData) {
    console.log("Updating address:", id, addressData);

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: `${API_BASE_URL}/api/address/${id}`,
        method: "PUT",
        body: JSON.stringify(addressData),
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}

// Delete Address by ID
export function deleteAddress(id) {
    console.log("Deleting address:", id);

    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
        return Promise.reject("No access token set.");
    }

    return request({
        url: `${API_BASE_URL}/api/address/${id}`,
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
}


export function createRazorpayOrder({ amount, itemIds, staticAddress, cart }) {
  console.log("Creating Razorpay order:", { amount, itemIds, staticAddress, cart });

  const token = localStorage.getItem(ACCESS_TOKEN) || ACCESS_TOKEN;
  if (!token) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: `${API_BASE_URL}/api/razorpay/create-order`,
    method: "POST",
    body: JSON.stringify({ amount, itemIds, staticAddress, cart }),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

// Verify Razorpay Payment
export function verifyRazorpayPayment(response) {
  console.log("Verifying Razorpay payment:", response);

  const token = localStorage.getItem(ACCESS_TOKEN) || ACCESS_TOKEN;
  if (!token) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: `${API_BASE_URL}/api/razorpay/verify-payment`,
    method: "POST",
    body: JSON.stringify(response),
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
}

export function getAllOrdersByUser() {
    console.log('inside the getAllOrdersByUser');
  
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      return Promise.reject('No access token set.');
    }
  
    return request({
      url: `${API_BASE_URL}/api/orders/getAllByUser?page=1&limit=50`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
  export function getAllDeliveredOrdersByUser() {
    console.log('inside the getAllDeliveredOrdersByUser');
  
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      return Promise.reject('No access token set.');
    }
  
    return request({
      url: `${API_BASE_URL}/api/orders/delivered?page=1&limit=50`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
  }
  // src/utils/apiUtils.js (append to the existing file)

export function createExchangeOrder(orderId, newItemId, desiredSize, reason) {
    console.log("Creating exchange order:", { orderId, newItemId, desiredSize, reason });
  
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      return Promise.reject("No access token set.");
    }
  
    return request({
      url: `${API_BASE_URL}/api/orders/exchange`,
      method: "POST",
      body: JSON.stringify({ orderId, newItemId, desiredSize, reason }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }