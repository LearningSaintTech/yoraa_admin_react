import { API_BASE_URL, ACCESS_TOKEN } from './Constant';
import request from './apiConnecter';

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

export const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
};

// 🟢 CATEGORY API FUNCTIONS
export function getAllCategories() {
    console.log("inside getAllCategories");
    return request({
      url: API_BASE_URL + "/api/categories",
      method: "GET",
    });
}

export function getCategoryById(categoryId) {
    return request({
      url: API_BASE_URL + `/api/categories/${categoryId}`,
      method: "GET",
    });
}

export async function createCategory(categoryData) {
    console.log("createCategory",categoryData)
    // const formData = new FormData();
    // console.log("categoryData.name", categoryData);
    // formData.append("name", categoryData.name);
    // formData.append("description", categoryData.description);
    
    // if (categoryData.image) {
    //     formData.append("image", categoryData.image);
    // }

    try {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            method: "POST",
            body: categoryData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
        });

        const result = await response.json();
        if (!response.ok) {
            throw result;
        }

        return result;
    } catch (error) {
        console.error("Error creating category:", error);
        return error;
    }
}

export function updateCategory(categoryId, categoryData) {
    // const formData = new FormData();
    // formData.append("name", categoryData.name);
    // formData.append("description", categoryData.description);
    // if (categoryData.image) formData.append("image", categoryData.image);
  
    return request({
      url: API_BASE_URL + `/api/categories/${categoryId}`,
      method: "PUT",
      body: categoryData,
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
}

export function deleteCategory(categoryId) {
    return request({
      url: API_BASE_URL + `/api/categories/${categoryId}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
      },
    });
}

// 🟢 SUBCATEGORY API FUNCTIONS
export function getAllSubCategories() {
    console.log("Fetching all subcategories...");
    return request({
        url: API_BASE_URL + "/api/subcategories",
        method: "GET",
    });
}

export function getSubCategoryById(subCategoryId) {
    return request({
        url: API_BASE_URL + `/api/subcategories/${subCategoryId}`,
        method: "GET",
    });
}

export async function createSubCategory(subCategoryData) {
    // const formData = new FormData();
    // formData.append("name", subCategoryData.name);
    // formData.append("description", subCategoryData.description);
    // formData.append("categoryId", subCategoryData.categoryId);
    
    // if (subCategoryData.image) {
    //     formData.append("image", subCategoryData.image);
    // }

    try {
        const response = await fetch(`${API_BASE_URL}/api/subcategories`, {
            method: "POST",
            body: subCategoryData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
        });

        const result = await response.json();
        if (!response.ok) {
            throw result;
        }

        return result;
    } catch (error) {
        console.error("Error creating subcategory:", error);
        return error;
    }
}

export function updateSubCategory(subCategoryId, subCategoryData) {
    // const formData = new FormData();
    // formData.append("name", subCategoryData.name);
    // formData.append("description", subCategoryData.description);
    // formData.append("categoryId", subCategoryData.categoryId);
    
    // if (subCategoryData.image) {
    //     formData.append("image", subCategoryData.image);
    // }

    return request({
        url: API_BASE_URL + `/api/subcategories/${subCategoryId}`,
        method: "PUT",
        body: subCategoryData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
    });
}

export function deleteSubCategory(subCategoryId) {
    return request({
        url: API_BASE_URL + `/api/subcategories/${subCategoryId}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
    });
}


// 🟢 ITEM API FUNCTIONS
export function getAllItems() {
    return request({
        url: API_BASE_URL + "/api/items",
        method: "GET",
    });
}

export function getItemById(itemId) {
    return request({
        url: API_BASE_URL + `/api/items/${itemId}`,
        method: "GET",
    });
}

export async function createItem(itemData,category,subcategory) {
    console.log("itemdata",itemData)
    const itemData1 = {
            name: itemData.name,
            description: itemData.description,
            price: itemData.price,
            stock: itemData.stock,
            brand: itemData.brand,
            style: itemData.style.split(","),  // Convert comma-separated input into an array
            occasion: itemData.occasion.split(","),
            fit: itemData.fit.split(","),
            material: itemData.material.split(","),
            discountPrice: itemData.discountPrice,
            averageRating: itemData.averageRating,
            totalReviews: itemData.totalReviews
        };
        console.log("itemdata1",itemData1)

    const formData = new FormData();
    
    formData.append("categoryId", category);
    formData.append("subCategoryId", subcategory);
    formData.append("data", JSON.stringify(itemData1));
    console.log("fomr data",formData)

    if (itemData.image) {
        formData.append("image", itemData.image);
    }
console.log("formdata in api.js",formData)
    try {
        const response = await fetch(`${API_BASE_URL}/api/items`, {
            method: "POST",
            body: formData,
            headers: {
                Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
        });

        const result = await response.json();
        if (!response.ok) {
            throw result;
        }

        return result;
    } catch (error) {
        console.error("Error creating item:", error);
        return error;
    }
}

export function updateItem(itemId, itemData,category,subcategory) {
    const formData = new FormData();
    formData.append("name", itemData.name);
    formData.append("description", itemData.description);
    formData.append("price", itemData.price);
    formData.append("categoryId", category);
    formData.append("stock", itemData.stock);

    formData.append("subCategoryId", subcategory);
    
    if (itemData.image) {
        formData.append("image", itemData.image);
    }

    return request({
        url: API_BASE_URL + `/api/items/${itemId}`,
        method: "PUT",
        body: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
    });
}

export function deleteItem(itemId) {
    return request({
        url: API_BASE_URL + `/api/items/${itemId}`,
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
    });
}



//Users
export function getAllUsers() {
    return request({
        url: API_BASE_URL + `/api/user/getAlluser`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
    });
}


//notifications
export async function fetchNotifications() {
    return request({
      url: `${API_BASE_URL}/api/notifications`,
      method: 'GET',
    });
  }
  
  export async function sendNotificationRequest(notificationData) {
    return request({
      url: `${API_BASE_URL}/api/send-notification`,
      method: 'POST',
      body: JSON.stringify(notificationData),
    });
  }

  //items details
  // 🟢 ITEM DETAILS API FUNCTIONS

// Get all item details
export function getAllItemDetails() {
    return request({
        url: API_BASE_URL + "/api/itemDetails",
        method: "GET",
    });
}

// Get item details by item ID
export function getItemDetailsByItemId(itemId) {
    return request({
        url: API_BASE_URL + `/api/itemDetails/${itemId}`,
        method: "GET",
    });
}

// Create item details
export async function createItemDetails(itemId, formData) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/itemDetails/${itemId}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
      });
  
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to create item details");
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

// Update item details
// ✅ UPDATE ItemDetails (Supports File Uploads)
export async function updateItemDetails(itemDetailsId, itemDetailsData, formData1) {
    console.log("itemDetailsId", itemDetailsId);
    console.log("itemDetailsData", itemDetailsData);
    console.log("formData1", formData1);

    const formData =  new FormData();

    // ✅ Correctly stringify the JSON data
    formData.append("data", JSON.stringify(itemDetailsData));

    // ✅ Append images if provided
    if (formData1.images && formData1.images.length > 0) {
        formData1.images.forEach((image) => {
            formData.append("images", image);
            console.log("image",image)
        });
    }

    return fetch(`${API_BASE_URL}/api/itemDetails/${itemDetailsId}`, {
        method: "PUT",
        body: formData,
        headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
    })
    .then(response => response.json())
    .then(response => {
        if (!response) throw response;
        return response;
    })
    .catch(error => {
        console.error("Error updating item details:", error);
        return error;
    });
}

// ✅ DELETE ItemDetails
export async function deleteItemDetails(itemDetailsId) {
    console.log("itemDetailsId",itemDetailsId)
    return fetch(`${API_BASE_URL}/api/itemDetails/${itemDetailsId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
        },
    })
    .then(response => response.json())
    .then(response => {
        if (response.success) throw response;
        return response;
    })
    .catch(error => {
        console.error("Error deleting item details:", error);
        return error;
    });
}
