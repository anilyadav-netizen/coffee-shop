// src/pages/admin/AddProduct.jsx
import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaImage, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addProduct, updateProduct, getSingleProduct, clearProduct } from "../../redux/Slicer/adminProductSlice";
import { ToastContainer } from "react-toastify"; 
import { toast } from "react-toastify";
const AddProduct = () => {
    const { id } = useParams(); // ✅ Agar URL mein id hai toh Update Mode
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { product, loading } = useSelector((state) => state.adminProducts);
    const isEditMode = Boolean(id);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        status: "active",
    });

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditMode);

    // ✅ Agar Edit Mode hai toh product fetch karo
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

    // ==================== HANDLE IMAGE UPLOAD ====================
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

    // ==================== HANDLE SUBMIT ====================
    const handleSubmit = async (e) => {
        e.preventDefault();

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

        // ✅ Image validation - Add mode mein compulsory, Update mode mein optional
        if (!isEditMode && !imageFile) {
            toast.error("Please upload a product image");
            return;
        }

        setIsLoading(true);

        try {
            const submitData = new FormData();
            submitData.append("name", formData.name);
            submitData.append("description", formData.description);
            submitData.append("price", formData.price);
            submitData.append("stock", formData.stock);
            submitData.append("status", formData.status);

            // ✅ Agar nayi image select ki hai toh bhejo, warna mat bhejo
            if (imageFile) {
                submitData.append("image", imageFile);
            }

            let result;
            if (isEditMode) {
                result = await dispatch(updateProduct({ id, formData: submitData })).unwrap();
                toast.success("Product updated successfully!");
            } else {
                result = await dispatch(addProduct(submitData)).unwrap();
                toast.success("Product added successfully!");
            }

            navigate("/admin/products");
        } catch (error) {
            console.error("❌ Error:", error);
            toast.error(typeof error === "string" ? error : "Failed to save product");
        } finally {
            setIsLoading(false);
        }
    };

    // ✅ Loading state
    if (isFetching || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-4 md:p-6 flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 p-4 md:p-6">
            <div className="max-w-4xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate("/admin/products")}
                        className="w-10 h-10 rounded-xl border border-gray-200 dark:border-zinc-700 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                    >
                        <FaArrowLeft className="text-gray-600 dark:text-gray-400" />
                    </button>

                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
                            {isEditMode ? "Update Product" : "Add Product"}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {isEditMode ? "Edit product details" : "Create a new coffee product for your store"}
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-zinc-800 rounded-2xl border border-gray-200 dark:border-zinc-700 shadow-sm p-6 md:p-8"
                >
                    <div className="space-y-6">
                        {/* IMAGE UPLOAD */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Product Image {!isEditMode && <span className="text-red-500">*</span>}
                            </label>

                            {imagePreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Product Preview"
                                        className="w-48 h-48 rounded-xl object-cover border-2 border-gray-200 dark:border-zinc-600"
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
                                    className="relative border-2 border-dashed border-gray-300 dark:border-zinc-600 rounded-xl p-8 text-center cursor-pointer hover:border-[#0D7C53] dark:hover:border-[#0D7C53] transition-all duration-300"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <FaImage className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-3" />
                                    <p className="text-gray-600 dark:text-gray-400 font-medium">
                                        {isEditMode ? "Click to change image" : "Click to upload image"}
                                    </p>
                                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                                        PNG, JPG, WEBP (Max 5MB)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* PRODUCT NAME */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Classic Espresso"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent transition-all duration-300"
                                required
                            />
                        </div>

                        {/* DESCRIPTION */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows="4"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Write a brief description of the product..."
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent resize-none transition-all duration-300"
                                required
                            />
                        </div>

                        {/* PRICE & STOCK */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent transition-all duration-300"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-700 border border-gray-200 dark:border-zinc-600 rounded-xl text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0D7C53] focus:border-transparent transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* STATUS */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
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
                                        className="w-4 h-4 text-[#0D7C53] focus:ring-[#0D7C53]"
                                    />
                                    <span className="text-gray-700 dark:text-gray-300">Active</span>
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
                                    <span className="text-gray-700 dark:text-gray-300">Inactive</span>
                                </label>
                            </div>
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200 dark:border-zinc-700">
                            <button
                                type="button"
                                onClick={() => navigate("/admin/products")}
                                className="px-6 py-3 border border-gray-300 dark:border-zinc-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all duration-200 font-medium"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-6 py-3 bg-[#0D7C53] hover:bg-[#0a6a45] text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[140px]"
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