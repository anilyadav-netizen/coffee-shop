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
  FaSpinner,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../redux/Slicer/authSlice";

const AdminProfile = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  // Uncomment if you want to fetch profile on mount
  // useEffect(() => {
  //   dispatch(getProfile());
  // }, [dispatch]);

  const adminInfo = useMemo(
    () => [
      {
        label: "Full Name",
        value: user?.name || "-",
        icon: FaUserCircle,
        editable: true,
      },
      {
        label: "Email Address",
        value: user?.email || "-",
        icon: FaEnvelope,
        editable: true,
      },
      {
        label: "Phone Number",
        value:
          user?.mobile ||
          user?.addresses?.[0]?.phone ||
          user?.addresses?.[0]?.secondPhone ||
          "-",
        icon: FaPhone,
        editable: true,
      },
      {
        label: "Role",
        value: user?.role || "-",
        icon: FaUserShield,
        editable: false,
      },
      {
        label: "Location",
        value: user?.addresses?.[0]?.city || user?.addresses?.[0]?.address || "-",
        icon: FaMapMarkerAlt,
        editable: true,
      },
      {
        label: "Member Since",
        value: user?.createdAt
          ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })
          : "-",
        icon: FaCalendarAlt,
        editable: false,
      },
    ],
    [user]
  );

  // Loading state with spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-10 h-10 border-4 border-[#3B82F6] dark:border-[#60A5FA] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    // ❌ No extra background — pure content
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-dark-border mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-dark-heading flex items-center gap-2">
            <FaUserCircle className="text-[#3B82F6] dark:text-[#60A5FA]" />
            Profile Settings
          </h1>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] dark:bg-dark-bg/50 text-[#64748B] dark:text-dark-text border border-[#E2E8F0] dark:border-dark-border">
            {user?.role || "Admin"}
          </span>
        </div>

        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium transition-all shadow-sm ${
            isEditing
              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200 dark:shadow-emerald-900/30"
              : "bg-[#3B82F6] hover:bg-[#2563EB] text-white shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10"
          }`}
        >
          <FaEdit className="w-4 h-4" />
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-dark-card rounded-xl border border-[#E2E8F0] dark:border-dark-border shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-[#3B82F6] via-[#60A5FA] to-[#3B82F6] relative">
          {/* Avatar and name overlay */}
          <div className="absolute left-8 -bottom-12 flex items-end gap-4">
            <div className="relative">
              <FaUserCircle className="text-7xl text-white bg-white/20 rounded-full backdrop-blur-sm" />
              <button className="absolute bottom-0 right-0 bg-[#3B82F6] p-2 rounded-full text-white border-2 border-white dark:border-[#0F172A] shadow-md">
                <FaCamera size={12} />
              </button>
            </div>
            <div className="hidden sm:block -mb-1">
              <h3 className="text-2xl font-bold text-white mt-3 drop-shadow">
                {user?.name || "Admin"}
              </h3>
              <p className="text-white/90 capitalize drop-shadow">
                {user?.role || "Administrator"}
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="pt-16 px-6 pb-6 md:px-8 md:pb-8">
          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {adminInfo.map((item, index) => {
              const Icon = item.icon;
              const isEditable = item.editable && isEditing;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 bg-[#F8FAFC] dark:bg-dark-bg/50 p-4 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-dark-bg transition-colors group"
                >
                  <div className="p-3 bg-white dark:bg-dark-card rounded-lg shadow-sm border border-[#E2E8F0] dark:border-dark-border">
                    <Icon className="text-[#3B82F6] dark:text-[#60A5FA]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-wider text-[#64748B] dark:text-dark-text font-medium">
                      {item.label}
                    </p>
                    {isEditable ? (
                      <input
                        type="text"
                        defaultValue={item.value}
                        className="mt-1 w-full bg-transparent border-b border-[#E2E8F0] dark:border-dark-border focus:border-[#3B82F6] outline-none text-[#0F172A] dark:text-dark-heading font-medium transition-colors"
                      />
                    ) : (
                      <p className="font-semibold text-[#0F172A] dark:text-dark-heading truncate">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="border-t border-[#E2E8F0] dark:border-dark-border mt-6 pt-6 flex flex-wrap gap-3">
            <button className="px-5 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition text-sm font-medium shadow-sm shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10">
              Change Password
            </button>
            <button className="px-5 py-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/30 transition text-sm font-medium border border-red-200 dark:border-red-800/30">
              Deactivate Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;