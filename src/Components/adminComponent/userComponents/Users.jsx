import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../commonComponent/Api";
import { FaTimes } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [modalUser, setModalUser] = useState(null);
  const [modalImage, setModalImage] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const openUserModal = (user) => {
    setModalUser(user);
  };

  const closeUserModal = () => {
    setModalUser(null);
  };

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 sm:text-3xl">
        Users List
      </h2>

      {/* Users Table */}
      <div className="overflow-hidden rounded-lg shadow-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Profile</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Phone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Verified</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Admin</th>
                <th className="px-6 py-3 text-right text-sm font-semibold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr key={user._id} className="transition-colors hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt="Profile"
                          className="h-12 w-12 rounded-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => openImageModal(user.imageUrl)}
                        />
                      ) : (
                        <span className="text-gray-500 text-sm">No Image</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {user.user?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.user?.phNo || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.user?.isVerified ? (
                        <span className="text-green-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-red-600 font-medium">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {user.user?.isAdmin ? (
                        <span className="text-indigo-600 font-medium">Yes</span>
                      ) : (
                        <span className="text-gray-500 font-medium">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openUserModal(user)}
                        className="text-indigo-600 hover:text-indigo-800 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md px-2 py-1 transition-colors duration-200"
                      >
                        More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-sm text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Modal */}
      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-60 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden transform transition-all duration-300 scale-95 hover:scale-100 max-h-[90vh] overflow-y-auto">
            <div className="relative p-6 sm:p-8">
              {/* Close Button */}
              <button
                onClick={closeUserModal}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full transition-colors duration-200"
              >
                <FaTimes className="h-6 w-6" />
              </button>

              {/* Header */}
              <h3 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
                {modalUser.user?.name || "User Details"}
              </h3>

              {/* Content */}
              <div className="space-y-6">
                {modalUser.imageUrl && (
                  <div className="flex justify-center mb-6">
                    <img
                      src={modalUser.imageUrl}
                      alt="User Profile"
                      className="h-32 w-32 rounded-full object-cover shadow-md hover:scale-105 transition-transform duration-200 cursor-pointer"
                      onClick={() => openImageModal(modalUser.imageUrl)}
                    />
                  </div>
                )}
                <div className="space-y-4">
                  {/* Basic Info */}
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Email:</p>
                    <p className="text-sm text-gray-900 flex-1">{modalUser.email}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Phone:</p>
                    <p className="text-sm text-gray-900 flex-1">{modalUser.user?.phNo || "N/A"}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Verified:</p>
                    <p className="text-sm text-gray-900 flex-1">
                      {modalUser.user?.isVerified ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Admin:</p>
                    <p className="text-sm text-gray-900 flex-1">
                      {modalUser.user?.isAdmin ? (
                        <span className="text-indigo-600">Yes</span>
                      ) : (
                        <span className="text-gray-500">No</span>
                      )}
                    </p>
                  </div>

                  {/* Additional Verification Flags */}
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Phone Verified:</p>
                    <p className="text-sm text-gray-900 flex-1">
                      {modalUser.user?.isPhoneVerified ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Email Verified:</p>
                    <p className="text-sm text-gray-900 flex-1">
                      {modalUser.user?.isEmailVerified ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Profile Complete:</p>
                    <p className="text-sm text-gray-900 flex-1">
                      {modalUser.user?.isProfile ? (
                        <span className="text-green-600">Yes</span>
                      ) : (
                        <span className="text-red-600">No</span>
                      )}
                    </p>
                  </div>

                  {/* Personal Details */}
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Address:</p>
                    <p className="text-sm text-gray-900 flex-1">{modalUser.address || "N/A"}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Date of Birth:</p>
                    <p className="text-sm text-gray-900 flex-1">
                      {modalUser.dob ? new Date(modalUser.dob).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Anniversary:</p>
                    <p className="text-sm text-gray-900 flex-1">
                      {modalUser.anniversary ? new Date(modalUser.anniversary).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Gender:</p>
                    <p className="text-sm text-gray-900 flex-1">{modalUser.gender || "N/A"}</p>
                  </div>

            
                  <div className="flex items-start gap-3">
                    <p className="text-sm font-medium text-gray-600 min-w-[120px]">Style Preferences:</p>
                    <p className="text-sm text-gray-900 flex-1">
                      {modalUser.stylePreferences?.length > 0
                        ? modalUser.stylePreferences.join(", ")
                        : "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          onClick={closeImageModal}
        >
          <div
            className="relative bg-white rounded-xl shadow-2xl p-6 max-w-3xl w-full transform transition-all duration-300 scale-95 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full transition-colors duration-200"
            >
              <FaTimes className="h-6 w-6" />
            </button>
            <img
              src={modalImage}
              alt="Full Size"
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;