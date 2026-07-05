// components/AddressModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddressModal = ({ isOpen, onClose, onSaveAddress }) => {
    const [addressData, setAddressData] = useState({
        type: 'home',
        fullName: '',
        email: '',
        phone: '',
        secondPhone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        isDefault: false
    });
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    // Validate form according to backend requirements
    const validateForm = () => {
        const newErrors = {};
        
        if (!addressData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        
        if (!addressData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addressData.email.trim())) {
            newErrors.email = 'Please enter a valid email address';
        }
        
        if (!addressData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(addressData.phone.trim())) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        
        if (addressData.secondPhone.trim() && !/^[0-9]{10}$/.test(addressData.secondPhone.trim())) {
            newErrors.secondPhone = 'Please enter a valid 10-digit phone number';
        }
        
        if (!addressData.address.trim()) {
            newErrors.address = 'Address is required';
        }
        
        if (!addressData.city.trim()) {
            newErrors.city = 'City is required';
        }
        
        if (!addressData.state.trim()) {
            newErrors.state = 'State is required';
        }
        
        if (!addressData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(addressData.pincode.trim())) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            // Format address object according to backend requirements
            const deliveryAddress = {
                type: addressData.type,
                fullName: addressData.fullName.trim(),
                email: addressData.email.trim(),
                phone: addressData.phone.trim(),
                secondPhone: addressData.secondPhone.trim(),
                address: addressData.address.trim(),
                city: addressData.city.trim(),
                state: addressData.state.trim(),
                pincode: addressData.pincode.trim(),
                landmark: addressData.landmark.trim(),
                isDefault: addressData.isDefault
            };
            
            console.log("📦 Delivery Address:", deliveryAddress);
            onSaveAddress(deliveryAddress);
            
            // Reset form after successful submission
            setAddressData({
                type: 'home',
                fullName: '',
                email: '',
                phone: '',
                secondPhone: '',
                address: '',
                city: '',
                state: '',
                pincode: '',
                landmark: '',
                isDefault: false
            });
        }
    };

    // Close modal
    const handleClose = () => {
        setAddressData({
            type: 'home',
            fullName: '',
            email: '',
            phone: '',
            secondPhone: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            landmark: '',
            isDefault: false
        });
        setErrors({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            ></div>
            
            {/* Modal */}
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold text-gray-800">
                        🚚 Delivery Address
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Address Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Type *
                        </label>
                        <select
                            name="type"
                            value={addressData.type}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all"
                        >
                            <option value="home">Home</option>
                            <option value="office">Office</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name *
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={addressData.fullName}
                            onChange={handleInputChange}
                            placeholder="Enter your full name"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.fullName ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.fullName && (
                            <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={addressData.email}
                            onChange={handleInputChange}
                            placeholder="Enter your email address"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.email ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={addressData.phone}
                            onChange={handleInputChange}
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.phone && (
                            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                        )}
                    </div>

                    {/* Second Phone (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Second Phone (Optional)
                        </label>
                        <input
                            type="tel"
                            name="secondPhone"
                            value={addressData.secondPhone}
                            onChange={handleInputChange}
                            placeholder="Enter 10-digit phone number"
                            maxLength="10"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.secondPhone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.secondPhone && (
                            <p className="text-xs text-red-500 mt-1">{errors.secondPhone}</p>
                        )}
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={addressData.address}
                            onChange={handleInputChange}
                            placeholder="Enter street address"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.address ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.address && (
                            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                        )}
                    </div>

                    {/* Landmark (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Landmark (Optional)
                        </label>
                        <input
                            type="text"
                            name="landmark"
                            value={addressData.landmark}
                            onChange={handleInputChange}
                            placeholder="Apartment, suite, floor, etc."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all"
                        />
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City *
                        </label>
                        <input
                            type="text"
                            name="city"
                            value={addressData.city}
                            onChange={handleInputChange}
                            placeholder="Enter your city"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.city && (
                            <p className="text-xs text-red-500 mt-1">{errors.city}</p>
                        )}
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            State *
                        </label>
                        <input
                            type="text"
                            name="state"
                            value={addressData.state}
                            onChange={handleInputChange}
                            placeholder="Enter your state"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.state ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.state && (
                            <p className="text-xs text-red-500 mt-1">{errors.state}</p>
                        )}
                    </div>

                    {/* Pincode */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pincode *
                        </label>
                        <input
                            type="text"
                            name="pincode"
                            value={addressData.pincode}
                            onChange={handleInputChange}
                            placeholder="Enter 6-digit pincode"
                            maxLength="6"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.pincode ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.pincode && (
                            <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>
                        )}
                    </div>

                    {/* Make Default Address */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isDefault"
                            checked={addressData.isDefault}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#0D7C53] border-gray-300 rounded focus:ring-[#0D7C53]"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700">
                            Make Default Address
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-[#0D7C53] to-green-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                        >
                            Save Address
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddressModal;