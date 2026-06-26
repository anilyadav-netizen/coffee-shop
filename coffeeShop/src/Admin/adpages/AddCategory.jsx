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
        <div className="min-h-screen bg-[#FDF8F3] dark:bg-[#1A0F0A] p-4 md:p-6">
            <div className="max-w-3xl mx-auto">
                {/* HEADER */}
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => navigate("/admin/category")}
                        className="w-10 h-10 rounded-xl border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] flex items-center justify-center hover:bg-[#F5EDE3] dark:hover:bg-[#3D2317] transition"
                    >
                        <FaArrowLeft className="text-[#5C4033] dark:text-[#C4A882]" />
                    </button>

                    <div>
                        <h1 className="text-3xl font-bold text-[#2C1810] dark:text-[#F5EDE3]">
                            {id ? "Update Category" : "Add Category"}
                        </h1>

                        <p className="text-sm text-[#8B7355] dark:text-[#C4A882]">
                            {id
                                ? "Update category details"
                                : "Create a new category for products"}
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleSubmit}
                    className="bg-white dark:bg-[#261810] rounded-2xl border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] shadow-[0_2px_8px_rgba(44,24,16,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] p-6 md:p-8"
                >
                    <div className="space-y-6">
                        {/* ICON */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2C1810] dark:text-[#F5EDE3] mb-2">
                                Category Icon
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            {iconPreview ? (
                                <div className="relative inline-block">
                                    <img
                                        src={iconPreview}
                                        alt="Category Preview"
                                        className="w-40 h-40 rounded-xl object-cover border-2 border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)]"
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
                                    className="border-2 border-dashed border-[rgba(44,24,16,0.15)] dark:border-[rgba(245,237,227,0.15)] rounded-xl p-8 text-center cursor-pointer hover:border-[#6F4E37] dark:hover:border-[#C68E5C] transition"
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />

                                    <FaImage className="w-12 h-12 mx-auto text-[#8B7355] dark:text-[#C4A882] mb-3" />

                                    <p className="font-medium text-[#5C4033] dark:text-[#C4A882]">
                                        Click to upload category icon
                                    </p>

                                    <p className="text-sm text-[#8B7355] dark:text-[#C4A882] mt-1">
                                        PNG, JPG, WEBP (Max 5MB)
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* NAME */}
                        <div>
                            <label className="block text-sm font-semibold text-[#2C1810] dark:text-[#F5EDE3] mb-2">
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
                                className="w-full px-4 py-3 bg-[#FDF8F3] dark:bg-[#1A0F0A] border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-xl text-[#2C1810] dark:text-[#F5EDE3] placeholder-[#8B7355] dark:placeholder-[#C4A882] focus:outline-none focus:ring-2 focus:ring-[#6F4E37] dark:focus:ring-[#C68E5C]"
                            />
                        </div>

                        {/* BUTTONS */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)]">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/admin/category")
                                }
                                className="px-6 py-3 border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-xl text-[#5C4033] dark:text-[#C4A882] hover:bg-[#F5EDE3] dark:hover:bg-[#3D2317]"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-[#6F4E37] dark:bg-[#C68E5C] hover:bg-[#5C4033] dark:hover:bg-[#D4A574] text-[#F5EDE3] dark:text-[#1A0F0A] rounded-xl font-semibold disabled:opacity-70 disabled:cursor-not-allowed min-w-[150px] shadow-[0_2px_8px_rgba(44,24,16,0.15)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] hover:shadow-lg transition"
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