import React, { useEffect, useState } from "react";
import { fetchNotifications, sendNotificationRequest, uploadNotificationImage } from "../../commonComponent/Api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [imageFile, setImageFile] = useState(null); // Store the selected image file
  const [imageUrl, setImageUrl] = useState(""); // Store the S3 URL after upload
  const [deepLink, setDeepLink] = useState("");
  const [targetPlatform, setTargetPlatform] = useState("both");
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        console.log("Fetched notifications:", data);
        setNotifications(data.notifications);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("Selected file:", file); // Debug: Log the selected file
    if (file) {
      setImageFile(file);
      setImageUrl(""); // Reset the URL until upload is complete
    } else {
      console.log("No file selected");
      setImageFile(null);
    }
  };

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      // Upload image to S3 if selected
      let finalImageUrl = imageUrl;
      console.log("Image file before upload:", imageFile); // Debug: Log the image file
      if (imageFile) {
        setUploading(true);
        finalImageUrl = await uploadNotificationImage(imageFile);
        console.log("Uploaded image URL:", finalImageUrl); // Debug: Log the returned URL
        setUploading(false);
        setImageUrl(finalImageUrl);
      } else {
        console.log("No image file to upload");
      }

      console.log("Sending notification with data:", {
        title,
        body,
        imageUrl: finalImageUrl,
        deepLink,
        targetPlatform,
      }); // Debug: Log the notification data

      await sendNotificationRequest({
        title,
        body,
        imageUrl: finalImageUrl,
        deepLink,
        targetPlatform,
      });

      setTitle("");
      setBody("");
      setImageFile(null);
      setImageUrl("");
      setDeepLink("");
      setTargetPlatform("both");
      setNotifications((prev) => [
        { title, body, imageUrl: finalImageUrl, deepLink, sentAt: new Date().toISOString(), platform: targetPlatform },
        ...prev,
      ]);
    } catch (err) {
      console.error("Error in handleSendNotification:", err); // Debug: Log the error
      alert("Failed to send notification: " + (err.message || "Unknown error"));
    } finally {
      setSending(false);
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 sm:text-3xl">
        Admin Notifications
      </h2>

      {/* Notification Form */}
      <form
        onSubmit={handleSendNotification}
        className="mb-8 rounded-xl bg-gray-50 p-6 shadow-lg space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Title
          </label>
          <input
            type="text"
            placeholder="Enter notification title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Body
          </label>
          <textarea
            placeholder="Enter notification message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="4"
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none resize-y"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notification Image (Optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="Preview" className="w-32 h-32 object-cover rounded-md" />
            </div>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deep Link (Optional, e.g., yoraa://product/123)
          </label>
          <input
            type="text"
            placeholder="Enter deep link (e.g., yoraa://product/123)"
            value={deepLink}
            onChange={(e) => setDeepLink(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Target Platform
          </label>
          <select
            value={targetPlatform}
            onChange={(e) => setTargetPlatform(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          >
            <option value="both">Both Android and iOS</option>
            <option value="android">Android Only</option>
            <option value="ios">iOS Only</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={sending || uploading}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors duration-200"
        >
          {uploading ? "Uploading Image..." : sending ? "Sending..." : "Send Notification"}
        </button>
        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
      </form>

      {/* Notification List */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-gray-600 text-center">Loading notifications...</p>
        ) : error ? (
          <p className="text-red-600 text-center font-medium">{error}</p>
        ) : notifications.length === 0 ? (
          <p className="text-gray-500 text-center">No notifications found.</p>
        ) : (
          notifications.map((notification, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border border-gray-200"
            >
              {notification.imageUrl && (
                <img
                  src={notification.imageUrl}
                  alt="Notification"
                  className="w-full h-40 object-cover rounded-md mb-4"
                />
              )}
              <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{notification.body}</p>
              {notification.deepLink && (
                <p className="text-xs text-blue-500 mt-2">
                  Deep Link: <a href={notification.deepLink}>{notification.deepLink}</a>
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Sent at: {new Date(notification.sentAt).toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Platform: {notification.platform || "Both"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;