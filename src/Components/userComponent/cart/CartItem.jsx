import React from "react";

const CartItem = ({ item, onIncrement, onDecrement, onDelete }) => {
  return (
    <tr className="border-b">
      <td className="p-4 border-gray-300 border-y-2 border-l-2">
        <div className="w-24 h-32 rounded-md bg-gradient-to-t from-gray-200 to-gray-300 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={item.image}
            alt={item.name}
          />
        </div>
      </td>
      <td className="px-4 py-4 border-gray-300 border-y-2">
        <p className="text-lg text-center font-light break-words">{item.name}</p>
        <div className="mt-2">
          <dd className="text-gray-500 text-center">{item.size}</dd>
        </div>
        <p className="font-light mt-3 text-gray-700 text-center">
          Rs. {item.price.toFixed(2)}
        </p>
      </td>
      <td className="hidden lg:table-cell px-4 py-4 border-gray-300 border-2">
        <div className="flex justify-center items-center">
          <div className="relative flex items-center mx-auto max-w-[132px] border-2 border-gray-300 rounded-lg">
            <button
              type="button"
              onClick={() => onDecrement(item)}
              className="bg-gray-100 hover:bg-gray-200 rounded-s-lg p-3 h-11"
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
              className="bg-gray-50 border-x-0 pl-3 border-gray-300 h-11 font-medium text-center text-gray-900 text-sm w-full"
            />
            <button
              type="button"
              onClick={() => onIncrement(item)}
              className="bg-gray-100 hover:bg-gray-200 rounded-e-lg p-3 h-11"
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
      </td>
      <td className="hidden lg:table-cell px-2 py-4 border-gray-300 border-2 text-right">
        <div className="flex justify-center items-center">
          <span className="font-semibold">
            Rs. {(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </td>
      <td className="px-4 py-4 border-gray-300 border-2">
        <div className="flex justify-center items-center">
          <button onClick={() => onDelete(item)}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.1274 4.59992V12.0306C11.1274 12.102 11.1118 12.1734 11.0805 12.2449C11.0493 12.3163 11.0069 12.3787 10.9533 12.4323C10.9087 12.4858 10.8507 12.526 10.7793 12.5528C10.7079 12.5796 10.632 12.593 10.5517 12.593H4.84809C4.76775 12.593 4.69188 12.5796 4.62048 12.5528C4.54907 12.526 4.49105 12.4858 4.44643 12.4323C4.39287 12.3787 4.35047 12.3163 4.31923 12.2449C4.28799 12.1734 4.27237 12.102 4.27237 12.0306V4.59992H11.1274ZM10.5517 3.46188V2.88617C10.5517 2.6541 10.507 2.43319 10.4178 2.22343C10.3285 2.01368 10.208 1.83293 10.0563 1.68119C9.89562 1.52053 9.71264 1.39557 9.50734 1.30631C9.30205 1.21705 9.07891 1.17242 8.83791 1.17242H6.56184C6.32084 1.17242 6.09546 1.21705 5.88571 1.30631C5.67595 1.39557 5.49521 1.52053 5.34347 1.68119C5.19173 1.83293 5.07123 2.01368 4.98197 2.22343C4.89271 2.43319 4.84809 2.6541 4.84809 2.88617V3.46188H2.55862C2.39796 3.46188 2.26184 3.51767 2.15027 3.62924C2.0387 3.74082 1.98291 3.87247 1.98291 4.02421C1.98291 4.18487 2.0387 4.32099 2.15027 4.43256C2.26184 4.54414 2.39796 4.59992 2.55862 4.59992H3.13434V12.0306C3.13434 12.2627 3.17896 12.4836 3.26822 12.6934C3.35748 12.9031 3.47798 13.0839 3.62972 13.2356C3.79038 13.3874 3.97336 13.5101 4.17865 13.6038C4.38395 13.6975 4.60709 13.7444 4.84809 13.7444H10.5517C10.7927 13.7444 11.018 13.6998 11.2278 13.6105C11.4375 13.5212 11.6183 13.3963 11.77 13.2356C11.9218 13.0839 12.0423 12.9031 12.1315 12.6934C12.2208 12.4836 12.2654 12.2627 12.2654 12.0306V4.59992H12.8411C13.0018 4.59992 13.1379 4.54414 13.2495 4.43256C13.361 4.32099 13.4168 4.18487 13.4168 4.02421C13.4168 3.87247 13.361 3.74082 13.2495 3.62924C13.1379 3.51767 13.0018 3.46188 12.8411 3.46188H10.5517ZM5.98612 3.46188V2.88617C5.98612 2.80584 6.00174 2.7322 6.03298 2.66526C6.06422 2.59832 6.10662 2.53807 6.16018 2.48451C6.2048 2.43096 6.26282 2.38856 6.33423 2.35732C6.40563 2.32608 6.4815 2.31046 6.56184 2.31046H8.83791C8.91824 2.31046 8.99411 2.32608 9.06552 2.35732C9.13692 2.38856 9.19494 2.43096 9.23957 2.48451C9.29313 2.53807 9.33552 2.59832 9.36676 2.66526C9.398 2.7322 9.41362 2.80584 9.41362 2.88617V3.46188H5.98612ZM5.98612 6.88938V10.3169C5.98612 10.4686 6.04191 10.6003 6.15348 10.7119C6.26505 10.8234 6.40117 10.8792 6.56184 10.8792C6.71357 10.8792 6.84523 10.8234 6.9568 10.7119C7.06837 10.6003 7.12416 10.4686 7.12416 10.3169V6.88938C7.12416 6.72872 7.06837 6.5926 6.9568 6.48103C6.84523 6.36946 6.71357 6.31367 6.56184 6.31367C6.40117 6.31367 6.26505 6.36946 6.15348 6.48103C6.04191 6.5926 5.98612 6.72872 5.98612 6.88938ZM8.27559 6.88938V10.3169C8.27559 10.4686 8.33137 10.6003 8.44294 10.7119C8.55452 10.8234 8.68617 10.8792 8.83791 10.8792C8.99857 10.8792 9.13469 10.8234 9.24626 10.7119C9.35784 10.6003 9.41362 10.4686 9.41362 10.3169V6.88938C9.41362 6.72872 9.35784 6.5926 9.24626 6.48103C9.13469 6.36946 8.99857 6.31367 8.83791 6.31367C8.68617 6.31367 8.55452 6.36946 8.44294 6.48103C8.33137 6.5926 8.27559 6.72872 8.27559 6.88938Z"
                fill="#555555"
              />
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default CartItem;