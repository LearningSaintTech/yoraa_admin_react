import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllCart, removeFromCart, addToCart } from "../../commonComponent/UserApi";
import { deleteFromCart, updateQuantity, setCartItems } from "../../slice/cartSlice";
import { createAddress, getUserAddresses } from "../../commonComponent/UserApi";

const Cart = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null); // Fixed initial state to null

  const [isAddAddressModalOpen, setIsAddAddressModalOpen] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: "",
    lastName: "",
    type: "new",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    country: "",
    phoneNumber: "",
  });

  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCartItems();
    fetchUserAddresses();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await getAllCart();
      // Map the backend response to the desired cart format
      const items = response.data.map((cartEntry) => ({
        cartId: cartEntry._id, // Use the cart entry ID as cartId
        name: cartEntry.item.name,
        description: cartEntry.item.description || "No description available", // Fallback if description is missing
        price: cartEntry.item.price,
        imageUrl: cartEntry.item.imageUrl,
        quantity: cartEntry.quantity,
        item: cartEntry.item._id,
        desiredSize: cartEntry.desiredSize,
      }));
      dispatch(setCartItems(items)); // Store the full cart data in Redux
    } catch (err) {
      console.error("Failed to load cart items:", err);
      setError("Failed to load cart items");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAddresses = async () => {
    try {
      const response = await getUserAddresses();
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0]); // Set the first address as default
      }
    } catch (err) {
      console.error("Failed to load addresses:", err);
    }
  };

  const handleIncrement = async (item) => {
    const newQuantity = item.quantity + 1;
    try {
      await addToCart(item.item, newQuantity, item.desiredSize); // Use item.item as the item ID
      dispatch(
        updateQuantity({
          id: item.item,
          size: item.desiredSize,
          quantity: newQuantity,
        })
      );
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
      setError("Failed to update cart");
    }
  };

  const handleDecrement = async (item) => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      try {
        await addToCart(item.item, newQuantity, item.desiredSize); // Use item.item as the item ID
        dispatch(
          updateQuantity({
            id: item.item,
            size: item.desiredSize,
            quantity: newQuantity,
          })
        );
      } catch (err) {
        console.error("Failed to update cart quantity:", err);
        setError("Failed to update cart");
      }
    } else {
      handleDelete(item);
    }
  };

  const handleDelete = async (item) => {
    try {
      await removeFromCart(item.cartId); // Use cartId for deletion
      dispatch(deleteFromCart({ id: item.item, size: item.desiredSize }));
    } catch (err) {
      console.error("Failed to remove from cart:", err);
      setError("Failed to remove item from cart");
    }
  };

  const handleAddAddress = async () => {
    try {
      await createAddress(newAddress);
      setIsAddAddressModalOpen(false);
      setNewAddress({
        firstName: "",
        lastName: "",
        type: "new",
        address: "",
        city: "",
        state: "",
        pinCode: "",
        country: "",
        phoneNumber: "",
      });
      fetchUserAddresses();
    } catch (err) {
      console.error("Failed to add address:", err);
      setError("Failed to add address: " + err.message);
    }
  };

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (!selectedAddress) {
      alert("Please select or add a delivery address before proceeding to checkout.");
      return;
    }

    const itemIds = cartItems.map((item) => item.item); // Use item IDs for payment

    // Navigate to the payment screen with the full cart data
    navigate("/payment", {
      state: {
        itemIds,
        address: selectedAddress,
        cart: cartItems, // Send the cart items in the desired format
        totalAmount: subtotal,
      },
    });
  };

  return (
    <div className="max-h-full w-full pb-5">
      {loading && <p className="text-center text-gray-500 my-8">Loading cart...</p>}
      {error && <p className="text-center text-red-500 my-8">{error}</p>}

      {!loading && !error && cartItems.length === 0 ? (
        <p className="text-center text-gray-500 my-8">Your cart is empty</p>
      ) : (
        !loading &&
        !error && (
          <>
            <h1 className="w-full text-center font-light text-3xl my-3 mb-6">
              Your Cart
            </h1>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 mx-6">
              {/* Cart items for small devices */}
              <div className="xl:col-span-2">
                <div className="xl:hidden">
                  <ul className="-my-6 divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <li key={`${item.item}-${item.desiredSize}`} className="flex py-6">
                        <div className="h-28 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-contain object-center"
                          />
                        </div>
                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-light text-gray-900">
                              <h3>{item.name}</h3>
                              <button
                                onClick={() => handleDelete(item)}
                                className="text-gray-400 hover:text-gray-700"
                              >
                                <svg
                                  width="15"
                                  height="15"
                                  viewBox="0 0 15 15"
                                  fill="currentColor"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path d="M11.1274 4.59992V12.0306C11.1274 12.102 11.1118 12.1734 11.0805 12.2449C11.0493 12.3163 11.0069 12.3787 10.9533 12.4323C10.9087 12.4858 10.8507 12.526 10.7793 12.5528C10.7079 12.5796 10.632 12.593 10.5517 12.593H4.84809C4.76775 12.593 4.69188 12.5796 4.62048 12.5528C4.54907 12.526 4.49105 12.4858 4.44643 12.4323C4.39287 12.3787 4.35047 12.3163 4.31923 12.2449C4.28799 12.1734 4.27237 12.102 4.27237 12.0306V4.59992H11.1274ZM10.5517 3.46188V2.88617C10.5517 2.6541 10.507 2.43319 10.4178 2.22343C10.3285 2.01368 10.208 1.83293 10.0563 1.68119C9.89562 1.52053 9.71264 1.39557 9.50734 1.30631C9.30205 1.21705 9.07891 1.17242 8.83791 1.17242H6.56184C6.32084 1.17242 6.09546 1.21705 5.88571 1.30631C5.67595 1.39557 5.49521 1.52053 5.34347 1.68119C5.19173 1.83293 5.07123 2.01368 4.98197 2.22343C4.89271 2.43319 4.84809 2.6541 4.84809 2.88617V3.46188H2.55862C2.39796 3.46188 2.26184 3.51767 2.15027 3.62924C2.0387 3.74082 1.98291 3.87247 1.98291 4.02421C1.98291 4.18487 2.0387 4.32099 2.15027 4.43256C2.26184 4.54414 2.39796 4.59992 2.55862 4.59992H3.13434V12.0306C3.13434 12.2627 3.17896 12.4836 3.26822 12.6934C3.35748 12.9031 3.47798 13.0839 3.62972 13.2356C3.79038 13.3874 3.97336 13.5101 4.17865 13.6038C4.38395 13.6975 4.60709 13.7444 4.84809 13.7444H10.5517C10.7927 13.7444 11.018 13.6998 11.2278 13.6105C11.4375 13.5212 11.6183 13.3963 11.77 13.2356C11.9218 13.0839 12.0423 12.9031 12.1315 12.6934C12.2208 12.4836 12.2654 12.2627 12.2654 12.0306V4.59992H12.8411C13.0018 4.59992 13.1379 4.54414 13.2495 4.43256C13.361 4.32099 13.4168 4.18487 13.4168 4.02421C13.4168 3.87247 13.361 3.74082 13.2495 3.62924C13.1379 3.51767 13.0018 3.46188 12.8411 3.46188H10.5517ZM5.98612 3.46188V2.88617C5.98612 2.80584 6.00174 2.7322 6.03298 2.66526C6.06422 2.59832 6.10662 2.53807 6.16018 2.48451C6.2048 2.43096 6.26282 2.38856 6.33423 2.35732C6.40563 2.32608 6.4815 2.31046 6.56184 2.31046H8.83791C8.91824 2.31046 8.99411 2.32608 9.06552 2.35732C9.13692 2.38856 9.19494 2.43096 9.23957 2.48451C9.29313 2.53807 9.33552 2.59832 9.36676 2.66526C9.398 2.7322 9.41362 2.80584 9.41362 2.88617V3.46188H5.98612ZM5.98612 6.88938V10.3169C5.98612 10.4686 6.04191 10.6003 6.15348 10.7119C6.26505 10.8234 6.40117 10.8792 6.56184 10.8792C6.71357 10.8792 6.84523 10.8234 6.9568 10.7119C7.06837 10.6003 7.12416 10.3169V6.88938C7.12416 6.72872 7.06837 6.5926 6.9568 6.48103C6.84523 6.36946 6.71357 6.31367 6.56184 6.31367C6.40117 6.31367 6.26505 6.36946 6.15348 6.48103C6.04191 6.5926 5.98612 6.72872 5.98612 6.88938ZM8.27559 6.88938V10.3169C8.27559 10.4686 8.33137 10.6003 8.44294 10.7119C8.55452 10.8234 8.68617 10.8792 8.83791 10.8792C8.99857 10.8792 9.13469 10.8234 9.24626 10.7119C9.35784 10.6003 9.41362 10.4686 9.41362 10.3169V6.88938C9.41362 6.72872 9.35784 6.5926 9.24626 6.48103C9.13469 6.36946 8.99857 6.31367 8.83791 6.31367C8.68617 6.31367 8.55452 6.36946 8.44294 6.48103C8.33137 6.5926 8.27559 6.72872 8.27559 6.88938Z" />
                                </svg>
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <p className="my-1 text-sm text-gray-500">{item.desiredSize}</p>
                          </div>
                          <p className="font-medium text-gray-600 text-xs">
                            Rs. {item.price.toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-1 text-sm mt-2">
                          <div className="relative flex items-center max-w-[100px] border-2 border-gray-300 rounded-lg">
                            <button
                              type="button"
                              onClick={() => handleDecrement(item)}
                              className="bg-white hover:bg-gray-200 rounded-s-lg p-2 h-9"
                            >
                              <svg
                                className="w-3 h-3 text-gray-900"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 2"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M1 1h16"
                                />
                              </svg>
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              readOnly
                              className="bg-gray-50 border-x-0 pl-3 border-gray-300 h-9 font-medium text-center text-gray-900 text-sm w-full"
                            />
                            <button
                              type="button"
                              onClick={() => handleIncrement(item)}
                              className="bg-white hover:bg-gray-200 rounded-e-lg p-2 h-9"
                            >
                              <svg
                                className="w-3 h-3 text-gray-900"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 18 18"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M9 1v16M1 9h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cart items for large devices */}
                <div className="hidden xl:block">
                  <table className="min-w-full text-sm text-gray-700 border">
                    <thead className="border-gray-300 border-2">
                      <tr>
                        <th className="px-4 py-2 text-left border-gray-300 border-2" colSpan="2">
                          Product
                        </th>
                        <th className="px-4 py-2 text-left border-gray-300 border-2">
                          Quantity
                        </th>
                        <th className="px-4 py-2 text-left border-gray-300 border-2">
                          Total
                        </th>
                        <th className="px-4 py-2 border-gray-300 border-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={`${item.item}-${item.desiredSize}`} className="border-b border-gray-300">
                          <td className="px-4 py-4">
                            <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-contain object-center"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                            <p className="text-sm text-gray-500">{item.desiredSize}</p>
                          </td>
                          <td className="px-4 py-4">
                            <div className="relative flex items-center max-w-[100px] border-2 border-gray-300 rounded-lg">
                              <button
                                type="button"
                                onClick={() => handleDecrement(item)}
                                className="bg-white hover:bg-gray-200 rounded-s-lg p-2 h-9"
                              >
                                <svg
                                  className="w-3 h-3 text-gray-900"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 2"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1h16"
                                  />
                                </svg>
                              </button>
                              <input
                                type="number"
                                value={item.quantity}
                                readOnly
                                className="bg-gray-50 border-x-0 pl-3 border-gray-300 h-9 font-medium text-center text-gray-900 text-sm w-full"
                              />
                              <button
                                type="button"
                                onClick={() => handleIncrement(item)}
                                className="bg-white hover:bg-gray-200 rounded-e-lg p-2 h-9"
                              >
                                <svg
                                  className="w-3 h-3 text-gray-900"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 18 18"
                                >
                                  <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 1v16M1 9h16"
                                  />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </td>
                          <td className="px-4 py-4">
                            <button
                              onClick={() => handleDelete(item)}
                              className="text-gray-400 hover:text-gray-700"
                            >
                              <svg
                                width="15"
                                height="15"
                                viewBox="0 0 15 15"
                                fill="currentColor"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path d="M11.1274 4.59992V12.0306C11.1274 12.102 11.1118 12.1734 11.0805 12.2449C11.0493 12.3163 11.0069 12.3787 10.9533 12.4323C10.9087 12.4858 10.8507 12.526 10.7793 12.5528C10.7079 12.5796 10.632 12.593 10.5517 12.593H4.84809C4.76775 12.593 4.69188 12.5796 4.62048 12.5528C4.54907 12.526 4.49105 12.4858 4.44643 12.4323C4.39287 12.3787 4.35047 12.3163 4.31923 12.2449C4.28799 12.1734 4.27237 12.102 4.27237 12.0306V4.59992H11.1274ZM10.5517 3.46188V2.88617C10.5517 2.6541 10.507 2.43319 10.4178 2.22343C10.3285 2.01368 10.208 1.83293 10.0563 1.68119C9.89562 1.52053 9.71264 1.39557 9.50734 1.30631C9.30205 1.21705 9.07891 1.17242 8.83791 1.17242H6.56184C6.32084 1.17242 6.09546 1.21705 5.88571 1.30631C5.67595 1.39557 5.49521 1.52053 5.34347 1.68119C5.19173 1.83293 5.07123 2.01368 4.98197 2.22343C4.89271 2.43319 4.84809 2.6541 4.84809 2.88617V3.46188H2.55862C2.39796 3.46188 2.26184 3.51767 2.15027 3.62924C2.0387 3.74082 1.98291 3.87247 1.98291 4.02421C1.98291 4.18487 2.0387 4.32099 2.15027 4.43256C2.26184 4.54414 2.39796 4.59992 2.55862 4.59992H3.13434V12.0306C3.13434 12.2627 3.17896 12.4836 3.26822 12.6934C3.35748 12.9031 3.47798 13.0839 3.62972 13.2356C3.79038 13.3874 3.97336 13.5101 4.17865 13.6038C4.38395 13.6975 4.60709 13.7444 4.84809 13.7444H10.5517C10.7927 13.7444 11.018 13.6998 11.2278 13.6105C11.4375 13.5212 11.6183 13.3963 11.77 13.2356C11.9218 13.0839 12.0423 12.9031 12.1315 12.6934C12.2208 12.4836 12.2654 12.2627 12.2654 12.0306V4.59992H12.8411C13.0018 4.59992 13.1379 4.54414 13.2495 4.43256C13.361 4.32099 13.4168 4.18487 13.4168 4.02421C13.4168 3.87247 13.361 3.74082 13.2495 3.62924C13.1379 3.51767 13.0018 3.46188 12.8411 3.46188H10.5517ZM5.98612 3.46188V2.88617C5.98612 2.80584 6.00174 2.7322 6.03298 2.66526C6.06422 2.59832 6.10662 2.53807 6.16018 2.48451C6.2048 2.43096 6.26282 2.38856 6.33423 2.35732C6.40563 2.32608 6.4815 2.31046 6.56184 2.31046H8.83791C8.91824 2.31046 8.99411 2.32608 9.06552 2.35732C9.13692 2.38856 9.19494 2.43096 9.23957 2.48451C9.29313 2.53807 9.33552 2.59832 9.36676 2.66526C9.398 2.7322 9.41362 2.80584 9.41362 2.88617V3.46188H5.98612ZM5.98612 6.88938V10.3169C5.98612 10.4686 6.04191 10.6003 6.15348 10.7119C6.26505 10.8234 6.40117 10.8792 6.56184 10.8792C6.71357 10.8792 6.84523 10.8234 6.9568 10.7119C7.06837 10.6003 7.12416 10.3169V6.88938C7.12416 6.72872 7.06837 6.5926 6.9568 6.48103C6.84523 6.36946 6.71357 6.31367 6.56184 6.31367C6.40117 6.31367 6.26505 6.36946 6.15348 6.48103C6.04191 6.5926 5.98612 6.72872 5.98612 6.88938ZM8.27559 6.88938V10.3169C8.27559 10.4686 8.33137 10.6003 8.44294 10.7119C8.55452 10.8234 8.68617 10.8792 8.83791 10.8792C8.99857 10.8792 9.13469 10.8234 9.24626 10.7119C9.35784 10.6003 9.41362 10.4686 9.41362 10.3169V6.88938C9.41362 6.72872 9.35784 6.5926 9.24626 6.48103C9.13469 6.36946 8.99857 6.31367 8.83791 6.31367C8.68617 6.31367 8.55452 6.36946 8.44294 6.48103C8.33137 6.5926 8.27559 6.72872 8.27559 6.88938Z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Sidebar for Delivery Details, Subtotal, and Checkout */}
              <div className="col-span-1 bg-white border border-gray-300 rounded-md p-6">
                <div className="flex flex-col gap-4 w-full">
                  <div className="border-b border-gray-300 pb-4">
                    <h2 className="text-sm font-medium text-gray-900">DELIVERY TO:</h2>
                    {selectedAddress && (
                      <div>
                        <p className="text-sm text-gray-600">
                          {selectedAddress.address}, {selectedAddress.city}, {selectedAddress.state}{" "}
                          {selectedAddress.pinCode}, {selectedAddress.country}
                          <br />
                          Contact: {selectedAddress.phoneNumber}
                        </p>
                        <select
                          className="mt-2 w-full py-2 border border-gray-300 rounded-md text-sm text-gray-700"
                          value={selectedAddress.id || ""}
                          onChange={(e) => {
                            const address = addresses.find((addr) => addr.id === e.target.value);
                            setSelectedAddress(address);
                          }}
                        >
                          {addresses.map((address) => (
                            <option key={address.id} value={address.id}>
                              {address.address}, {address.city}, {address.state}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <button
                      onClick={() => setIsAddAddressModalOpen(true)}
                      className="mt-2 w-full py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ADD NEW ADDRESS
                    </button>
                    <p className="text-sm text-gray-600 mt-2">Free</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-medium text-gray-900">SUBTOTAL</h2>
                    <p className="text-sm text-gray-600">Rs. {subtotal.toLocaleString()}</p>
                  </div>
                  <p className="text-xs text-gray-500">TAX & SHIPPING CALCULATED AT CHECKOUT</p>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 mt-4 text-sm rounded-md bg-black text-white hover:bg-gray-800 transition-all duration-300"
                  >
                    CHECKOUT
                  </button>
                </div>
              </div>
            </div>

            {/* Add Address Modal */}
            {isAddAddressModalOpen && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
                <div className="bg-white w-[90%] max-w-2xl p-6 rounded-lg">
                  <h2 className="text-lg font-medium mb-4">Add New Address</h2>
                  <form className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input
                          type="text"
                          value={newAddress.firstName}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, firstName: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                        <input
                          type="text"
                          value={newAddress.lastName}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, lastName: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address Type</label>
                        <select
                          value={newAddress.type}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, type: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        >
                          <option value="new">New</option>
                          <option value="home">Home</option>
                          <option value="work">Work</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input
                          type="text"
                          value={newAddress.address}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, address: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, city: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, state: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Pin Code</label>
                        <input
                          type="text"
                          value={newAddress.pinCode}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, pinCode: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Country</label>
                        <input
                          type="text"
                          value={newAddress.country}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, country: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                        <input
                          type="text"
                          value={newAddress.phoneNumber}
                          onChange={(e) =>
                            setNewAddress({ ...newAddress, phoneNumber: e.target.value })
                          }
                          className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-6">
                      <button
                        type="button"
                        onClick={() => setIsAddAddressModalOpen(false)}
                        className="py-2 px-4 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleAddAddress}
                        className="py-2 px-4 bg-black text-white rounded-md text-sm hover:bg-gray-800"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};

export default Cart;