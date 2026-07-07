import React, { useEffect, useMemo, useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaEdit,
  FaCamera,
  FaMapMarkerAlt,
  FaCalendarAlt,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/Slicer/authSlice";

const AdminProfile = () => {
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);
  console.log("ADMIN PROFILE =", user);
  console.log("LocalStorage User:", JSON.parse(localStorage.getItem("user")));

  const [isEditing, setIsEditing] = useState(false);

  // useEffect(() => {
  //   dispatch(getProfile());
  // }, [dispatch]);

  const adminInfo = useMemo(
    () => [
      {
        label: "Full Name",
        value: user?.name || "-",
        icon: FaUserCircle,
      },
      {
        label: "Email Address",
        value: user?.email || "-",
        icon: FaEnvelope,
      },
      {
        label: "Phone Number",
        value:
          user?.mobile ||
          user?.addresses?.[0]?.phone ||
          user?.addresses?.[0]?.secondPhone ||
          "-",
        icon: FaPhone,
      },
      {
        label: "Role",
        value: user?.role || "-",
        icon: FaUserShield,
      },
      {
        label: "Location",
        value:
          user?.addresses?.[0]?.city ||
          user?.addresses?.[0]?.address ||
          "-",
        icon: FaMapMarkerAlt,
      },
      {
        label: "Member Since",
        value: user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString()
          : "-",
        icon: FaCalendarAlt,
      },
    ],
    [user]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-xl font-semibold">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#0F172A] dark:text-white">
            Profile Settings
          </h2>

          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your profile information
          </p>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className="mt-4 md:mt-0 px-6 py-2 rounded-xl bg-[#4F46E5] text-white"
        >
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow border overflow-hidden">

        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#4F46E5] relative">

          <div className="absolute left-8 -bottom-12 flex items-end gap-4">

            <div className="relative">
              <FaUserCircle className="text-7xl text-white rounded-full" />

              <button className="absolute bottom-0 right-0 bg-[#4F46E5] p-2 rounded-full text-white">
                <FaCamera size={12} />
              </button>
            </div>

            <div className="hidden sm:block -mb-1">
              <h3 className="text-2xl font-bold text-white mt-3">
                {user?.name}
              </h3>

              <p className="text-white/80 capitalize">
                {user?.role}
              </p>
            </div>

          </div>

        </div>

        {/* Body */}
        <div className="pt-16 px-8 pb-8">

          <div className="grid md:grid-cols-2 gap-5">

            {adminInfo.map((item, index) => {
              const Icon = item.icon;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-gray-50 dark:bg-[#0F172A] p-4 rounded-xl"
                >
                  <div className="p-3 bg-white dark:bg-[#1E293B] rounded-lg shadow">
                    <Icon className="text-[#4F46E5]" />
                  </div>

                  <div className="flex-1">
                    <p className="text-xs uppercase text-gray-500">
                      {item.label}
                    </p>

                    {isEditing &&
                      item.label !== "Role" &&
                      item.label !== "Member Since" ? (
                      <input
                        defaultValue={item.value}
                        className="mt-1 w-full border-b outline-none bg-transparent"
                      />
                    ) : (
                      <p className="font-semibold text-[#0F172A] dark:text-white">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}

          </div>

          <div className="border-t mt-8 pt-6 flex gap-4">

            <button className="px-6 py-2 bg-[#4F46E5] text-white rounded-lg">
              Change Password
            </button>

            <button className="px-6 py-2 bg-red-100 text-red-600 rounded-lg">
              Deactivate Account
            </button>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminProfile;