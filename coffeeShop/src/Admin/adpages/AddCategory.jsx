import React, { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaImage, FaTimes } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
    createCategory,
    updateCategory,
    getCategoryById,
    clearSelectedCategory,
} from "../../redux/Slicer/categorySlice";

const AddCategory = () => {

    const { id } = useParams();
    const { selectedCategory } = useSelector(
        (state) => state.category
    );

    useEffect(() => {
        if (selectedCategory) {
            setName(selectedCategory.name);
            setIconPreview(selectedCategory.icon);
        }
    }, [selectedCategory]);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const { loading, error } = useSelector(
        (state) => state.category
    );

    const [name, setName] = useState("");
    const [iconFile, setIconFile] = useState(null);
    const [iconPreview, setIconPreview] = useState(null);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    useEffect(() => {
        if (id) {
            dispatch(getCategoryById(id));
        }
    }, [id, dispatch]);

    // ================= IMAGE UPLOAD =================
    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Icon size should be less than 5MB");
            return;
        }

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload a valid image");
            return;
        }

        setIconFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setIconPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // ================= REMOVE IMAGE =================
    const removeImage = () => {
        setIconFile(null);
        setIconPreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // ================= SUBMIT =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Category name is required");
            return;
        }

        if (!iconFile && !iconPreview) {
            toast.error("Category icon is required");
            return;
        }

        try {
            const formData = new FormData();

            formData.append("name", name);

            // sirf new image select hui ho tab bhejo
            if (iconFile) {
                formData.append("icon", iconFile);
            }

            if (id) {
                await dispatch(
                    updateCategory({
                        id,
                        formData,
                    })
                ).unwrap();

                toast.success("Category updated successfully");
            } else {
                await dispatch(createCategory(formData)).unwrap();

                toast.success("Category created successfully");
            }

            navigate("/admin/category");
        } catch (err) {
            toast.error(
                typeof err === "string"
                    ? err
                    : id
                        ? "Failed to update category"
                        : "Failed to create category"
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-dark-bg p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate("/admin/category")}
                        className="w-10 h-10 rounded-xl border border-[#E2E8F0] dark:border-dark-border flex items-center justify-center hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition"
                    >
                        <FaArrowLeft className="text-[#64748B] dark:text-dark-text" />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-[#0F172A] dark:text-dark-heading">
                            {id ? "Update Category" : "Add Category"}
                        </h1>

                        <p className="text-sm text-[#64748B] dark:text-dark-text">
                            {id
                                ? "Update category details"
                                : "Create a new category for products"}
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-dark-card rounded-2xl border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl p-6 md:p-8"
                >
                    <div className="space-y-6">
                        {/* ICON */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                Category Icon
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            {iconPreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={iconPreview}
                                        alt="Category Preview"
                                        className="w-40 h-40 rounded-xl object-cover border-2 border-[#E2E8F0] dark:border-dark-border"
                                    />

                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    className="border-2 border-dashed border-[#E2E8F0] dark:border-dark-border rounded-xl p-8 text-center cursor-pointer hover:border-[#4F46E5] dark:hover:border-dark-primary transition"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    <FaImage className="w-12 h-12 mx-auto text-[#64748B] dark:text-dark-text mb-3" />

                                    <p className="font-medium text-[#0F172A] dark:text-dark-heading">
                                        Click to upload category icon
                                    </p>

                                    <p className="text-sm text-[#64748B] dark:text-dark-text mt-1">
                                        PNG, JPG, WEBP (Max 5MB)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* NAME */}
                        <div>
                            <label className="block text-sm font-semibold text-[#0F172A] dark:text-dark-heading mb-2">
                                Category Name
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            <input
                                type="text"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="e.g. Coffee"
                                className="w-full px-4 py-3 bg-[#F8FAFC] dark:bg-dark-bg border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text focus:outline-none focus:ring-2 focus:ring-[#4F46E5] dark:focus:ring-dark-primary"
                            />
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[#E2E8F0] dark:border-dark-border">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/admin/category")
                                }
                                className="px-6 py-3 border border-[#E2E8F0] dark:border-dark-border rounded-xl text-[#64748B] dark:text-dark-text hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-[#4F46E5] dark:bg-dark-primary hover:bg-[#4338CA] dark:hover:bg-[#6366F1] text-white rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px] shadow-md hover:shadow-lg transition"
                            >
                                {loading
                                    ? id
                                        ? "Updating..."
                                        : "Creating..."
                                    : id
                                        ? "Update Category"
                                        : "Create Category"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCategory;