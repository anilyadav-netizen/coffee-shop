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

    };

    const handleEdit = (id) => {
        navigate(`/admin/update-category/${id}`);
    };

    // Loading state
    if (loading && categories.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-[#4F46E5] dark:border-dark-primary mx-auto"></div>
                    <p className="mt-4 text-[#64748B] dark:text-dark-text text-base sm:text-lg">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className=" rounded-xl p-3 sm:p-4 md:p-6 shadow-sm dark:shadow-xl">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div>
                    <h1 className="text-xl sm:text-2xl md:text-2xl font-semibold text-[#0F172A] dark:text-dark-heading">
                        Categories
                    </h1>
                    <p className="text-xs sm:text-sm text-[#64748B] dark:text-dark-text">
                        Total {categories.length} Categories
                    </p>
                </div>

                <Link
                    to="/admin/add-category"
                    className="flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#4F46E5] dark:bg-dark-primary text-white rounded-lg hover:bg-[#4338CA] dark:hover:bg-[#6366F1] transition text-sm sm:text-base"
                >
                    <FaPlus className="text-base sm:text-xl" />
                    <span className="">Add Category</span>
                </Link>
            </div>

            {/* Search - Responsive */}
            <div className="flex flex-col sm:flex-row justify-end mb-4 sm:mb-6">
                <div className="w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <FaSearch className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text text-sm sm:text-base" />
                        <input
                            type="text"
                            placeholder="Search Category"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[200px] md:w-[250px] pl-7 sm:pl-9 pr-3 sm:pr-4 py-1.5 sm:py-2 border border-[#E2E8F0] dark:border-dark-border rounded-md outline-none text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-xs sm:text-sm bg-white dark:bg-dark-bg"
                        />
                    </div>
                </div>
            </div>

            {/* Table with Horizontal Scroll */}
            <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-lg">
                <table className="w-full min-w-[600px] sm:min-w-full">
                    <thead>
                        <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                            <th className="p-2 sm:p-3 md:p-4 text-left text-[#64748B] dark:text-dark-text text-sm sm:text-base whitespace-nowrap">Icon</th>
                            <th className="p-2 sm:p-3 md:p-4 text-left text-[#64748B] dark:text-dark-text text-sm sm:text-base whitespace-nowrap">Category Name</th>
                            <th className="hidden md:table-cell p-2 sm:p-3 md:p-4 text-left text-[#64748B] dark:text-dark-text text-sm sm:text-base whitespace-nowrap">Created At</th>
                            <th className="p-2 sm:p-3 md:p-4 text-left text-[#64748B] dark:text-dark-text text-sm sm:text-base whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <tr
                                    key={category._id}
                                    className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150"
                                >
                                    <td className="p-1.5 sm:p-2 md:p-4">
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg object-cover"
                                        />
                                    </td>

                                    <td className="p-1.5 sm:p-2 md:p-4 font-medium text-[#0F172A] dark:text-dark-heading text-sm sm:text-base md:text-lg max-w-[100px] sm:max-w-[150px] md:max-w-none truncate">
                                        {category.name}
                                    </td>

                                    <td className="hidden md:table-cell p-1.5 sm:p-2 md:p-4 text-[#64748B] dark:text-dark-text text-base sm:text-lg whitespace-nowrap">
                                        {new Date(
                                            category.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-1.5 sm:p-2 md:p-4">
                                        <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() => handleEdit(category._id)}
                                                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-md hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-200"
                                                title="Edit category"
                                            >
                                                <FaEdit className="text-[#4F46E5] dark:text-dark-primary text-[10px] sm:text-xs md:text-sm" />
                                            </button>

                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(category._id, category.name)}
                                                disabled={deleteLoading}
                                                className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-md text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                                                title="Delete category"
                                            >
                                                <FaTrash className="text-[10px] sm:text-sm md:text-base" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-6 sm:py-8 text-[#64748B] dark:text-dark-text text-xs sm:text-sm"
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