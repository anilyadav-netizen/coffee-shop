import React, { useState } from "react";
import {
  FaUserCircle,
  FaEnvelope,
  FaPhone,
  FaUserShield,
  FaEdit,
  FaCamera,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClipboardList,
  FaStar,
  FaCheckCircle,
} from "react-icons/fa";
import { useSelector } from "react-redux";

const AdminProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);


  const adminInfo = [
    {
      label: "Full Name",
      value: user?.name || "Admin User",
      icon: FaUserCircle,
    },
    {
      label: "Email Address",
      value: user?.email || "admin@coffee.com",
      icon: FaEnvelope,
    },
    {
      label: "Phone Number",
      value: user?.mobile || "+1 (555) 123-4567",
      icon: FaPhone,
    },
    {
      label: "Role",
      value: user?.role || "Super Admin",
      icon: FaUserShield,
    },
    {
      label: "Location",
      value: "New York, USA",
      icon: FaMapMarkerAlt,
    },
    {
      label: "Member Since",
      value: "January 2024",
      icon: FaCalendarAlt,
    },
  ];

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white">
              Profile Settings
            </h2>
            <p className="text-[#64748B] dark:text-[#94A3B8] mt-1">
              Manage your personal information and preferences
            </p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-4 md:mt-0 flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white rounded-xl hover:shadow-lg hover:shadow-[#4F46E5]/25 transition-all duration-300 font-medium"
          >
            <FaEdit className="text-sm" />
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>


      {/* Profile Card */}
      <div className="bg-white dark:bg-[#1E293B] rounded-2xl shadow-sm border border-[#E2E8F0] dark:border-[#334155] overflow-hidden">
        {/* Cover Image */}
        <div className="h-32 bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#4F46E5] relative">
          <div className="absolute -bottom-12 left-8 flex items-end gap-4">
            <div className="relative">
              <FaUserCircle className="text-7xl text-white bg-[#0F172A] dark:bg-[#0F172A] rounded-full shadow-2xl" />
              <button className="absolute bottom-0 right-0 p-1.5 bg-[#4F46E5] text-white rounded-full hover:bg-[#4338CA] transition-colors duration-200 shadow-lg">
                <FaCamera className="text-xs" />
              </button>
            </div>
            <div className="hidden sm:block">
              <h3 className="text-xl font-bold text-white">
                {user?.name || "Admin User"}
              </h3>
              <p className="text-sm text-white/80">
                {user?.role || "Super Admin"}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-16 pb-8 px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 ${isEditing
                    ? "bg-[#F8FAFC] dark:bg-[#0F172A] border-2 border-[#4F46E5]/30 dark:border-[#4F46E5]/20"
                    : "bg-[#F8FAFC] dark:bg-[#0F172A]"
                    }`}
                >
                  <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E293B] shadow-sm">
                    <Icon className="text-[#4F46E5] dark:text-[#818CF8] text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider font-semibold">
                      {item.label}
                    </p>
                    {isEditing && item.label !== "Role" && item.label !== "Member Since" ? (
                      <input
                        type="text"
                        defaultValue={item.value}
                        className="w-full mt-0.5 bg-transparent border-b-2 border-[#4F46E5]/40 dark:border-[#4F46E5]/30 focus:border-[#4F46E5] dark:focus:border-[#818CF8] outline-none text-[#0F172A] dark:text-white font-medium py-0.5 transition-colors duration-200"
                      />
                    ) : (
                      <p className="text-[#0F172A] dark:text-white font-medium truncate">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#334155] flex flex-wrap gap-3">
            <button className="px-6 py-2.5 bg-[#4F46E5] text-white rounded-xl hover:bg-[#4338CA] transition-colors duration-200 font-medium shadow-sm hover:shadow-md">
              Change Password
            </button>

            <button className="px-6 py-2.5 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-950/30 transition-colors duration-200 font-medium">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;