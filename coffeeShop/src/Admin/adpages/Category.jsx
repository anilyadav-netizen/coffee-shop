import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEye, FaTrash, FaEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    getCategories,
    deleteCategory,
    clearCategoryError
} from "../../redux/Slicer/categorySlice";

const Category = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { categories, loading, error } = useSelector(
        (state) => state.category
    );
    const [search, setSearch] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    // Handle errors
    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearCategoryError());
        }
    }, [error, dispatch]);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id, name) => {
        if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
            try {
                setDeleteLoading(true);
                const result = await dispatch(deleteCategory(id)).unwrap();
                toast.success(`Category "${name}" deleted successfully!`);
                // Refresh the list after deletion
                await dispatch(getCategories());
            } catch (error) {
                toast.error(error || "Failed to delete category");
            } finally {
                setDeleteLoading(false);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/admin/update-category/${id}`);
    };

    // Loading state
    if (loading && categories.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#6F4E37] dark:border-[#C68E5C] mx-auto"></div>
                    <p className="mt-4 text-[#8B7355] dark:text-[#C4A882] text-sm sm:text-base">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#261810] rounded-xl p-3 sm:p-4 md:p-6 border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] shadow-[0_2px_8px_rgba(44,24,16,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-[#2C1810] dark:text-[#F5EDE3]">
                        Categories
                    </h1>
                    <p className="text-xs sm:text-sm text-[#8B7355] dark:text-[#C4A882]">
                        Total {categories.length} Categories
                    </p>
                </div>

                <Link
                    to="/admin/add-category"
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#6F4E37] dark:bg-[#C68E5C] text-[#F5EDE3] dark:text-[#1A0F0A] rounded-lg hover:bg-[#5C4033] dark:hover:bg-[#D4A574] transition text-sm sm:text-base"
                >
                    <FaPlus className="text-xs sm:text-sm" />
                    <span className="hidden xs:inline">Add Category</span>
                    <span className="xs:hidden">Add</span>
                </Link>
            </div>

            {/* Search - Responsive */}
            <div className="flex flex-col sm:flex-row justify-end mb-4 sm:mb-6">
                <div className="w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <FaSearch className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#8B7355] dark:text-[#C4A882] text-xs sm:text-sm" />
                        <input
                            type="text"
                            placeholder="Search Category"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[200px] md:w-[250px] pl-7 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-md outline-none text-[#2C1810] dark:text-[#F5EDE3] placeholder-[#8B7355] dark:placeholder-[#C4A882] text-xs sm:text-sm bg-white dark:bg-[#1A0F0A]"
                        />
                    </div>
                </div>
            </div>

            {/* Table with Horizontal Scroll */}
            <div className="overflow-x-auto border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-lg">
                <table className="w-full min-w-[600px] sm:min-w-full">
                    <thead>
                        <tr className="border-b border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] bg-[#F5EDE3] dark:bg-[#3D2317]">
                            <th className="p-2 sm:p-3 md:p-4 text-left text-[#5C4033] dark:text-[#C4A882] text-xs sm:text-sm whitespace-nowrap">Icon</th>
                            <th className="p-2 sm:p-3 md:p-4 text-left text-[#5C4033] dark:text-[#C4A882] text-xs sm:text-sm whitespace-nowrap">Category Name</th>
                            <th className="hidden md:table-cell p-2 sm:p-3 md:p-4 text-left text-[#5C4033] dark:text-[#C4A882] text-xs sm:text-sm whitespace-nowrap">Created At</th>
                            <th className="p-2 sm:p-3 md:p-4 text-left text-[#5C4033] dark:text-[#C4A882] text-xs sm:text-sm whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <tr
                                    key={category._id}
                                    className="border-b border-[rgba(44,24,16,0.05)] dark:border-[rgba(245,237,227,0.05)] hover:bg-[#FDF8F3] dark:hover:bg-[#3D2317] transition-colors duration-150"
                                >
                                    <td className="p-1.5 sm:p-2 md:p-4">
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg object-cover"
                                        />
                                    </td>

                                    <td className="p-1.5 sm:p-2 md:p-4 font-medium text-[#2C1810] dark:text-[#F5EDE3] text-xs sm:text-sm md:text-base max-w-[100px] sm:max-w-[150px] md:max-w-none truncate">
                                        {category.name}
                                    </td>

                                    <td className="hidden md:table-cell p-1.5 sm:p-2 md:p-4 text-[#5C4033] dark:text-[#C4A882] text-xs sm:text-sm whitespace-nowrap">
                                        {new Date(
                                            category.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-1.5 sm:p-2 md:p-4">
                                        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEdit(category._id)}
                                                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-md hover:bg-[#F5EDE3] dark:hover:bg-[#3D2317] transition-colors duration-200"
                                                title="Edit category"
                                            >
                                                <FaEdit className="text-[#6F4E37] dark:text-[#C68E5C] text-[10px] sm:text-xs md:text-sm" />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(category._id, category.name)}
                                                disabled={deleteLoading}
                                                className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 flex items-center justify-center border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                title="Delete category"
                                            >
                                                <FaTrash className="text-[10px] sm:text-xs md:text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-6 sm:py-8 text-[#8B7355] dark:text-[#C4A882] text-xs sm:text-sm"
                                >
                                    {search ? "No categories found matching your search" : "No Categories Found"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Category;