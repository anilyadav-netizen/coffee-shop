// src/pages/admin/AddProduct.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaImage, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, getSingleProduct, clearProduct } from "../../redux/Slicer/adminProductSlice";
import { ToastContainer } from "react-toastify";
import { toast } from "react-toastify";
import { getCategories } from "../../redux/Slicer/categorySlice";

const AddProduct = () => {

    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { categories } = useSelector(
        (state) => state.category
    )

    useEffect(() => {
        dispatch(getCategories())
    }, [dispatch])

    const { product, loading } = useSelector((state) => state.adminProducts);
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "active",
        category: "",
        discountPercentage: 0,
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditMode);

    // 🔥 Calculate discount price for display
    const calculateDiscountPrice = () => {
        const price = parseFloat(formData.price) || 0;
        const discount = parseFloat(formData.discountPercentage) || 0;
        if (discount > 0 && price > 0) {
            return (price - (price * discount / 100)).toFixed(2);
        }
        return price.toFixed(2);
    };

    useEffect(() => {
        if (isEditMode && id) {
            dispatch(getSingleProduct(id))
                .unwrap()
                .then((data) => {
                    setFormData({
                        name: data.name || "",
                        description: data.description || "",
                        price: data.price || "",
                        stock: data.stock || "",
                        status: data.status || "active",
                        category: data.category?._id || data.category || "",
                        discountPercentage: data.discountPercentage || 0,
                    });
                    if (data.image) {
                        setImagePreview(data.image);
                    }
                    setIsFetching(false);
                })
                .catch((error) => {
                    toast.error(error || "Failed to fetch product");
                    navigate("/admin/products");
                });

            return () => {
                dispatch(clearProduct());
            };
        }
    }, [dispatch, id, isEditMode, navigate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }

            if (!file.type.startsWith("image/")) {
                toast.error("Please upload a valid image file");
                return;
            }

            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.name.trim()) {
            toast.error("Product name is required");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Product description is required");
            return;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            toast.error("Please enter a valid price");
            return;
        }

        if (!formData.stock || parseInt(formData.stock) < 0) {
            toast.error("Please enter a valid stock quantity");
            return;
        }

        if (!formData.category) {
            toast.error("Please select a category");
            return;
        }

        if (!isEditMode && !imageFile) {
            toast.error("Please upload a product image");
            return;
        }

        setIsLoading(true);

        try {
            const submitData = new FormData();
            
            // Basic fields
            submitData.append("name", formData.name);
            submitData.append("description", formData.description);
            submitData.append("price", formData.price);
            submitData.append("stock", formData.stock);
            submitData.append("status", formData.status);
            submitData.append("category", formData.category);
            submitData.append("discountPercentage", formData.discountPercentage);
            
            // ✅ Calculate and append discount price
            const price = parseFloat(formData.price) || 0;
            const discount = parseFloat(formData.discountPercentage) || 0;
            const discountPrice = discount > 0 ? price - (price * discount / 100) : price;
            submitData.append("discountPrice", Math.round(discountPrice));

            // Image
            if (imageFile) {
                submitData.append("image", imageFile);
            }

            // Debug log
            console.log("📦 Sending product data:", {
                name: formData.name,
                price: formData.price,
                discountPercentage: formData.discountPercentage,
                discountPrice: Math.round(discountPrice),
                hasImage: !!imageFile,
                isEditMode
            });

            let result;
            if (isEditMode) {
                result = await dispatch(updateProduct({ id, formData: submitData })).unwrap();
                toast.success("Product updated successfully!");
            } else {
                result = await dispatch(addProduct(submitData)).unwrap();
                toast.success("Product added successfully!");
            }

            // Log response
            console.log("✅ Product saved:", result);

            navigate("/admin/products");
        } catch (error) {
            console.error("❌ Error:", error);
            toast.error(typeof error === "string" ? error : "Failed to save product");
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching || loading) {
        return (
            <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-bg p-4 md:p-6 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#4F46E5] dark:border-dark-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-bg p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate("/admin/products")}
                        className="w-10 h-10 rounded-xl border border-[#E2E8F0] dark:border-dark-border flex items-center justify-center hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-200"
                    >
                        <FaArrowLeft className="text-[#64748B] dark:text-dark-text" />
                    </button>

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-dark-heading">
                            {isEditMode ? "Update Product" : "Add Product"}
                        </h1>
                        <p className="text-sm text-[#64748B] dark:text-dark-text">
                            {isEditMode ? "Edit product details" : "Create a new coffee product for your store"}
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-dark-card rounded-2xl border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl p-6 md:p-8"
                >
                    <div className="space-y-6">
                        {/* IMAGE UPLOAD */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                Product Image {!isEditMode && <span className="text-red-500">*</span>}
                            </label>

                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Product Preview"
                                        className="w-48 h-48 rounded-xl object-cover border-2 border-[#E2E8F0] dark:border-dark-border"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-colors duration-200"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative border-2 border-dashed border-[#E2E8F0] dark:border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-[#4F46E5] dark:hover:border-dark-primary transition-all duration-300"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <FaImage className="w-12 h-12 mx-auto text-[#64748B] dark:text-dark-text mb-3" />
                                    <p className="text-[#0F172A] dark:text-dark-heading font-medium">
                                        {isEditMode ? "Click to change image" : "Click to upload image"}
                                    </p>
                                    <p className="text-sm text-[#64748B] dark:text-dark-text mt-1">
                                        PNG, JPG, WEBP (Max 5MB)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* PRODUCT NAME */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Classic Espresso"
                                className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-[#4F46E5] dark:focus:ring-dark-primary focus:border-transparent transition-all duration-300"
                                required
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows="4"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Write a brief description of the product..."
                                className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-[#4F46E5] dark:focus:ring-dark-primary focus:border-transparent resize-none transition-all duration-300"
                                required
                            />
                        </div>

                        {/* CATEGORY DROPDOWN */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#0F172A] dark:text-dark-heading focus:outline-none focus:ring-2 focus:ring-[#4F46E5] dark:focus:ring-dark-primary focus:border-transparent transition-all duration-300 appearance-none"
                                required
                            >
                                <option value="" className="dark:bg-dark-bg">Select a category</option>
                                {categories && categories.map((category) => (
                                    <option key={category._id} value={category._id} className="dark:bg-dark-bg">
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            {categories && categories.length === 0 && (
                                <p className="text-sm text-[#4F46E5] dark:text-dark-primary mt-1">
                                    No categories found. Please add a category first.
                                </p>
                            )}
                        </div>

                        {/* PRICE, DISCOUNT PERCENTAGE, DISCOUNT PRICE & STOCK */}
                        <div className="grid md:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                    Price (₹) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="199"
                                    min="0"
                                    step="1"
                                    className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-[#4F46E5] dark:focus:ring-dark-primary focus:border-transparent transition-all duration-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="discountPercentage"
                                    value={formData.discountPercentage}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    max="100"
                                    step="1"
                                    className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-[#4F46E5] dark:focus:ring-dark-primary focus:border-transparent transition-all duration-300"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                    Discount Price (₹)
                                </label>
                                <input
                                    type="text"
                                    value={`₹ ${calculateDiscountPrice()}`}
                                    disabled
                                    className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#0F172A] dark:text-dark-heading cursor-not-allowed opacity-75"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="20"
                                    min="0"
                                    step="1"
                                    className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-[#4F46E5] dark:focus:ring-dark-primary focus:border-transparent transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* STATUS */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                Status
                            </label>
                            <div className="flex gap-4">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="active"
                                        checked={formData.status === "active"}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-[#4F46E5] dark:text-dark-primary focus:ring-[#4F46E5] dark:focus:ring-dark-primary"
                                    />
                                    <span className="text-[#64748B] dark:text-dark-text">Active</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="status"
                                        value="inactive"
                                        checked={formData.status === "inactive"}
                                        onChange={handleChange}
                                        className="w-4 h-4 text-red-500 focus:ring-red-500"
                                    />
                                    <span className="text-[#64748B] dark:text-dark-text">Inactive</span>
                                </label>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#E2E8F0] dark:border-dark-border">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/products")}
                                className="px-6 py-3 border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#64748B] dark:text-dark-text hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 bg-[#4F46E5] dark:bg-dark-primary hover:bg-[#4338CA] dark:hover:bg-[#6366F1] text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isEditMode ? "Updating..." : "Adding..."}
                                    </>
                                ) : (
                                    isEditMode ? "Update Product" : "Add Product"
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;