
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Loader2,
    Home,
    Briefcase,
    Building,
    MapPin,
    User,
    Mail,
    Phone,
    CheckCircle,
    X
} from 'lucide-react';
import { updateAddress, clearAddressState } from '../redux/Slicer/addressSlice';
import { getAllUsers } from '../redux/Slicer/userSlice';


const GlassCard = ({ children, className = '' }) => (
    <div className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/30 p-6 md:p-8 transition-all duration-300 hover:shadow-xl ${className}`}>
        {children}
    </div>
);

const InputField = ({ label, name, type = 'text', value, onChange, required = false, placeholder = '', icon: Icon, className = '' }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500`}
            />
        </div>
    </div>
);

const SelectField = ({ label, name, value, onChange, options, required = false, icon: Icon, className = '' }) => (
    <div className={className}>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                    <Icon className="w-5 h-5" />
                </div>
            )}
            <select
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                className={`w-full px-4 py-2.5 ${Icon ? 'pl-10' : ''} border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all appearance-none`}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 dark:text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    </div>
);

// --- Main Update Address Component ---

const UpdateAddress = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { addressId } = useParams();
    const { user, isLoading: authLoading } = useSelector((state) => state.auth);
    const { loading: addressLoading, success, error } = useSelector((state) => state.address);

    const [formData, setFormData] = useState({
        type: 'Home',
        name: '',
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

    const [formErrors, setFormErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Find the address to edit
    const addressToEdit = user?.addresses?.find(
        addr => (addr._id || addr.id) === addressId
    );

    // Pre-fill form when address is found
    useEffect(() => {
        if (addressToEdit) {
            setFormData({
                type: addressToEdit.type || 'Home',
                name: addressToEdit.name || '',
                email: addressToEdit.email || '',
                phone: addressToEdit.phone || '',
                secondPhone: addressToEdit.secondPhone || '',
                address: addressToEdit.address || '',
                city: addressToEdit.city || '',
                state: addressToEdit.state || '',
                pincode: addressToEdit.pincode || '',
                landmark: addressToEdit.landmark || '',
                isDefault: addressToEdit.isDefault || false
            });
        }
    }, [addressToEdit]);

    // Show toast notification
    useEffect(() => {
        if (success) {
            setToastMessage({ type: 'success', text: 'Address updated successfully!' });
            setIsSubmitting(false);

            // Navigate back to profile after a brief delay
            const timer = setTimeout(() => {
                dispatch(clearAddressState());
                navigate('/profile');
            }, 1500);

            return () => clearTimeout(timer);
        }
        if (error) {
            setToastMessage({ type: 'error', text: error });
            setIsSubmitting(false);
            setTimeout(() => {
                dispatch(clearAddressState());
            }, 4000);
        }
    }, [success, error, dispatch, navigate]);

    // Auto-close toast
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    // Handle form input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    // Validate form
    const validateForm = () => {
        const errors = {};

        if (!formData.name.trim()) errors.name = 'Full name is required';
        if (!formData.email.trim()) errors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
        if (!formData.phone.trim()) errors.phone = 'Phone number is required';
        else if (!/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(formData.phone)) {
            errors.phone = 'Phone number is invalid';
        }
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.state.trim()) errors.state = 'State is required';
        if (!formData.pincode.trim()) errors.pincode = 'Pincode is required';
        else if (!/^\d{5,6}$/.test(formData.pincode)) errors.pincode = 'Pincode must be 5-6 digits';

        return errors;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setIsSubmitting(true);

        try {
            // Prepare address data for API
            const addressData = {
                type: formData.type,
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                secondPhone: formData.secondPhone || undefined,
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                landmark: formData.landmark || undefined,
                isDefault: formData.isDefault
            };

            // Dispatch updateAddress thunk
            await dispatch(updateAddress({
                addressId: addressId,
                addressData
            })).unwrap();

            // Refresh profile to get updated data
            await dispatch(getProfile()).unwrap();

        } catch (error) {
            // Error is handled by the reducer
            console.error('Failed to update address:', error);
            setIsSubmitting(false);
        }
    };

    // Handle back navigation
    const handleBack = () => {
        navigate('/profile');
    };

    // Loading state
    if (authLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50/50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <GlassCard className="max-w-md w-full text-center">
                    <Loader2 className="w-12 h-12 mx-auto text-green-600 dark:text-green-400 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading address details...</p>
                </GlassCard>
            </div>
        );
    }

    // If address not found
    if (!addressToEdit) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50/50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                <GlassCard className="max-w-md w-full text-center">
                    <MapPin className="w-16 h-16 mx-auto text-red-400 dark:text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Address Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">The address you're looking for doesn't exist.</p>
                    <button
                        onClick={handleBack}
                        className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all hover:shadow-lg"
                    >
                        Return to Profile
                    </button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50/30 to-white dark:from-gray-900 dark:to-gray-800 p-4 md:p-8 transition-colors duration-300">
            {/* Toast Notification */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300 ${toastMessage.type === 'success'
                    ? 'bg-green-100 dark:bg-green-900/50 border-green-500 text-green-800 dark:text-green-200'
                    : 'bg-red-100 dark:bg-red-900/50 border-red-500 text-red-800 dark:text-red-200'
                    } border-l-4 px-4 py-3 rounded-lg shadow-lg max-w-md flex items-center gap-3`}>
                    {toastMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                    ) : (
                        <X className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                    )}
                    <span className="font-medium">{toastMessage.text}</span>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={handleBack}
                        className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        disabled={isSubmitting}
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </button>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Update Address</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Edit your address details below</p>
                    </div>
                </div>

                {/* Form Card */}
                <GlassCard>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Address Type */}
                            <SelectField
                                label="Address Type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                options={[
                                    { value: 'Home', label: '🏠 Home' },
                                    { value: 'Office', label: '💼 Office' },
                                    { value: 'Hostel', label: '🏢 Hostel' }
                                ]}
                                required
                                icon={Home}
                                className="md:col-span-2"
                            />

                            {/* Full Name */}
                            <InputField
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                                icon={User}
                                className={formErrors.name ? 'md:col-span-2' : 'md:col-span-2'}
                            />
                            {formErrors.name && (
                                <p className="text-red-500 text-sm -mt-3 md:col-span-2">{formErrors.name}</p>
                            )}

                            {/* Email */}
                            <InputField
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="john@example.com"
                                icon={Mail}
                                className="md:col-span-1"
                            />
                            {formErrors.email && (
                                <p className="text-red-500 text-sm -mt-3 md:col-span-1">{formErrors.email}</p>
                            )}

                            {/* Phone */}
                            <InputField
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="+1 234 567 8900"
                                icon={Phone}
                                className="md:col-span-1"
                            />
                            {formErrors.phone && (
                                <p className="text-red-500 text-sm -mt-3 md:col-span-1">{formErrors.phone}</p>
                            )}

                            {/* Second Phone */}
                            <InputField
                                label="Second Phone (Optional)"
                                name="secondPhone"
                                type="tel"
                                value={formData.secondPhone}
                                onChange={handleChange}
                                placeholder="+1 234 567 8901"
                                icon={Phone}
                                className="md:col-span-2"
                            />

                            {/* Address Line */}
                            <InputField
                                label="Address Line"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                placeholder="123 Main Street"
                                icon={MapPin}
                                className="md:col-span-2"
                            />
                            {formErrors.address && (
                                <p className="text-red-500 text-sm -mt-3 md:col-span-2">{formErrors.address}</p>
                            )}

                            {/* City */}
                            <InputField
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                placeholder="New York"
                                className="md:col-span-1"
                            />
                            {formErrors.city && (
                                <p className="text-red-500 text-sm -mt-3 md:col-span-1">{formErrors.city}</p>
                            )}

                            {/* State */}
                            <InputField
                                label="State"
                                name="state"
                                value={formData.state}
                                onChange={handleChange}
                                required
                                placeholder="NY"
                                className="md:col-span-1"
                            />
                            {formErrors.state && (
                                <p className="text-red-500 text-sm -mt-3 md:col-span-1">{formErrors.state}</p>
                            )}

                            {/* Pincode */}
                            <InputField
                                label="Pincode"
                                name="pincode"
                                type="text"
                                value={formData.pincode}
                                onChange={handleChange}
                                required
                                placeholder="10001"
                                className="md:col-span-1"
                            />
                            {formErrors.pincode && (
                                <p className="text-red-500 text-sm -mt-3 md:col-span-1">{formErrors.pincode}</p>
                            )}

                            {/* Landmark */}
                            <InputField
                                label="Landmark (Optional)"
                                name="landmark"
                                value={formData.landmark}
                                onChange={handleChange}
                                placeholder="Near Central Park"
                                className="md:col-span-1"
                            />

                            {/* Set as Default Address */}
                            <div className="md:col-span-2 flex items-center space-x-3 pt-2">
                                <input
                                    type="checkbox"
                                    name="isDefault"
                                    checked={formData.isDefault}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                                />
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                                    Set as default address
                                </label>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={handleBack}
                                className="w-full sm:w-auto px-6 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="w-full sm:w-auto px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </GlassCard>
            </div>
        </div>
    );
};

export default UpdateAddress;