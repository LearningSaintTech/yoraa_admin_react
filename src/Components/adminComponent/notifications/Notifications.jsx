import React, { useEffect, useState } from "react";
import { fetchNotifications, sendNotificationRequest } from "../../commonComponent/Api";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const data = await fetchNotifications();
        setNotifications(data.notifications);
      } catch (err) {
        setError("Failed to fetch notifications");
      } finally {
        setLoading(false);
      }
    };

    getNotifications();
  }, []);

  const handleSendNotification = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      await sendNotificationRequest({ title, body });
      setTitle("");
      setBody("");
      setNotifications((prev) => [
        { title, body, sentAt: new Date().toISOString() },
        ...prev,
      ]);
    } catch (err) {
      alert("Failed to send notification");
    } finally {
      setSending(false);
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
        <button
          type="submit"
          disabled={sending}
          className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400 transition-colors duration-200"
        >
          {sending ? "Sending..." : "Send Notification"}
        </button>
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
              <h3 className="text-lg font-semibold text-gray-900">{notification.title}</h3>
              <p className="text-sm text-gray-700 mt-1">{notification.body}</p>
              <p className="text-xs text-gray-500 mt-2">
                Sent at: {new Date(notification.sentAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;