import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  // Redux से logged-in user data प्राप्त करें
  const { user: reduxUser } = useSelector((store) => store.auth);
  // Local state में Redux user से शुरूआत करें
  const [user, setUser] = useState(reduxUser || {});
  const [isEditing, setIsEditing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // address को format करने वाला helper function
  const formatAddress = (address) => {
    if (typeof address === "object" && address !== null) {
      const { street = "", city = "", state = "", zipCode = "", country = "" } = address;
      // खाली जगह को trim करके comma से join करें
      return [street, city, state, zipCode, country].filter(Boolean).join(", ");
    }
    return address || "";
  };

  // Backend से user data fetch करें (GET /api/users/:id)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user._id) return; // अगर user._id नहीं है तो कुछ मत करो
        const token = localStorage.getItem("tokenid");
        const response = await fetch(`/api/users/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch user, status: ${response.status}, error: ${errorText}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setErrorMsg(error.message);
      }
    };
    fetchUserData();
  }, [user._id]);

  // Input change handler
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // Handle image change (upload image to backend at /api/upload)
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    
    formData.append("profilePic", file);
    formData.append("name", user.name); // Ensure other fields are appended correctly
    try {
      const token = localStorage.getItem("tokenid");

      const response = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`, // Ensure correct auth headers

        },
      });

      const data = await response.json();
      // console.log("Updated User profilePic:", data);
    } catch (error) {
      // console.error("Image upload failed:", error);
    }
  };


  // Handle update of profile (PUT /api/users/update/:id)
  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("tokenid");
      const formData = new FormData();
      formData.append("name", user.name);
      formData.append("phone", user.phone);
      // अगर address एक object है, तो इसे formatted string में convert करें
      formData.append("address", typeof user.address === "object" ? formatAddress(user.address) : user.address);
      // यदि profilePic एक string URL है, तो उसे formData में append करें
      if (user.profilePic && typeof user.profilePic === "string") {
        formData.append("profilePic", user.profilePic);
      }

      const response = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Content-Type नहीं जोड़ें क्योंकि हम FormData भेज रहे हैं
        },
        body: formData,
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update profile, status: ${response.status}, error: ${errorText}`);
      }
      const data = await response.json();
      console.log("Updated User:", data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto my-10 p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-gray-800 text-center mb-4">My Profile</h2>

      {errorMsg && (
        <div className="mb-4 text-red-600 text-center">
          {errorMsg}
        </div>
      )}

      <div className="flex flex-col items-center">
        {/* Profile image: if available, use user.profilePic; else, fallback image */}
        {user.profilePic ? (
          <img
            src={user.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
          />
        ) : (
          <img
            src="https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image"
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-300 shadow-md"
          />
        )}
        {isEditing && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 text-sm text-gray-600"
          />
        )}
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {/* Name Field */}
        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold">Name:</span>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-2/3 focus:ring focus:ring-green-400"
            />
          ) : (
            <span>{user.name}</span>
          )}
        </div>

        {/* Email Field (Disabled) */}
        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold">Email:</span>
          <input
            type="email"
            name="email"
            value={user.email || ""}
            disabled
            className="border px-2 py-1 rounded w-2/3 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Phone Field */}
        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold">Phone:</span>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={user.phone || ""}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-2/3 focus:ring focus:ring-green-400"
            />
          ) : (
            <span>{user.phone}</span>
          )}
        </div>

        {/* Address Field */}
        <div className="flex justify-between">
          <span className="text-gray-700 font-semibold">Address:</span>
          {isEditing ? (
            <input
              type="text"
              name="address"
              value={typeof user.address === "object" ? formatAddress(user.address) : user.address || ""}
              onChange={handleChange}
              className="border px-2 py-1 rounded w-2/3 focus:ring focus:ring-green-400"
            />
          ) : (
            <span>{typeof user.address === "object" ? formatAddress(user.address) : user.address}</span>
          )}
        </div>

        {/* Edit/Save Button */}
        <button
          onClick={() => {
            if (isEditing) handleUpdate();
            setIsEditing(!isEditing);
          }}
          className="px-4 py-2 mt-4 text-white bg-green-600 rounded-lg hover:bg-green-700 transition"
        >
          {isEditing ? "Save" : "Edit Profile"}
        </button>
      </div>
    </div>
  );
};

export default Profile;
