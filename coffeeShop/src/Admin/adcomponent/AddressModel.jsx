// components/AddressModal.jsx
import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddressModal = ({ isOpen, onClose, onSaveAddress }) => {
    const [addressData, setAddressData] = useState({
        fullName: '',
        phone: '',
        addressLine1: '',
        city: '',
        state: '',
        pincode: '',
        addressLine2: '' // Optional
    });
    const [errors, setErrors] = useState({});

    // Handle input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAddressData(prev => ({
            ...prev,
            [name]: value
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
        
        if (!addressData.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(addressData.phone.trim())) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        
        if (!addressData.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address line 1 is required';
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
                fullName: addressData.fullName.trim(),
                phone: addressData.phone.trim(),
                addressLine1: addressData.addressLine1.trim(),
                city: addressData.city.trim(),
                state: addressData.state.trim(),
                pincode: addressData.pincode.trim(),
                addressLine2: addressData.addressLine2?.trim() || '' // Optional
            };
            
            console.log("📦 Delivery Address:", deliveryAddress);
            onSaveAddress(deliveryAddress);
            
            // Reset form after successful submission
            setAddressData({
                fullName: '',
                phone: '',
                addressLine1: '',
                city: '',
                state: '',
                pincode: '',
                addressLine2: ''
            });
        }
    };

    // Close modal
    const handleClose = () => {
        setAddressData({
            fullName: '',
            phone: '',
            addressLine1: '',
            city: '',
            state: '',
            pincode: '',
            addressLine2: ''
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

                    {/* Address Line 1 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 1 *
                        </label>
                        <input
                            type="text"
                            name="addressLine1"
                            value={addressData.addressLine1}
                            onChange={handleInputChange}
                            placeholder="Enter street address"
                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C53] transition-all ${
                                errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        {errors.addressLine1 && (
                            <p className="text-xs text-red-500 mt-1">{errors.addressLine1}</p>
                        )}
                    </div>

                    {/* Address Line 2 (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address Line 2 (Optional)
                        </label>
                        <input
                            type="text"
                            name="addressLine2"
                            value={addressData.addressLine2}
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