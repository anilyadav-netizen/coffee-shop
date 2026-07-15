import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
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
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch(clearCategoryError());
        }
    }, [error, dispatch]);

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentCategories = filteredCategories.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDelete = async (id, name) => {
        try {
            setDeleteLoading(true);
            await dispatch(deleteCategory(id)).unwrap();
            toast.success(`Category "${name}" deleted successfully!`);
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

    if (loading && categories.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-[#3B82F6] dark:border-[#60A5FA] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            {/* ✨ New Header Design */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E2E8F0] dark:border-dark-border mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-dark-heading">
                        Categories
                    </h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] dark:bg-dark-bg/50 text-[#64748B] dark:text-dark-text border border-[#E2E8F0] dark:border-dark-border">
                        {categories.length}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:flex-none">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[220px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-sm outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    {/* Add Button */}
                    <Link
                        to="/admin/add-category"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200 text-sm font-medium shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10 whitespace-nowrap"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add Category
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-xl bg-white dark:bg-dark-card shadow-sm">
                <table className="w-full min-w-[700px]">
                    <thead>
                        <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Icon</th>
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Category Name</th>
                            <th className="hidden md:table-cell p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Created At</th>
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentCategories.length > 0 ? (
                            currentCategories.map((category) => (
                                <tr
                                    key={category._id}
                                    className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150"
                                >
                                    <td className="p-3">
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="w-12 h-12 rounded-lg object-cover border border-[#E2E8F0] dark:border-dark-border"
                                        />
                                    </td>
                                    <td className="p-3 font-medium text-[#0F172A] dark:text-dark-heading">
                                        {category.name}
                                    </td>
                                    <td className="hidden md:table-cell p-3 text-[#64748B] dark:text-dark-text whitespace-nowrap">
                                        {new Date(category.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(category._id)}
                                                className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-200 group"
                                                title="Edit Category"
                                            >
                                                <FaEdit className="text-[#3B82F6] dark:text-[#60A5FA] group-hover:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(category._id, category.name)}
                                                disabled={deleteLoading}
                                                className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 group"
                                                title="Delete Category"
                                            >
                                                <FaTrash className="group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="text-center py-10 text-[#64748B] dark:text-dark-text">
                                    {search ? "No categories found matching your search" : "No Categories Found"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border text-sm font-medium transition-colors duration-200 ${
                            currentPage === 1
                                ? "opacity-50 cursor-not-allowed text-[#94A3B8] dark:text-dark-text"
                                : "hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 text-[#0F172A] dark:text-dark-heading"
                        }`}
                    >
                        Previous
                    </button>

                    <div className="flex flex-wrap gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`w-10 h-10 rounded-lg border border-[#E2E8F0] dark:border-dark-border transition-colors duration-200 text-sm font-medium ${
                                    currentPage === page
                                        ? "bg-[#3B82F6] text-white border-[#3B82F6] dark:border-[#3B82F6] shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10"
                                        : "text-[#0F172A] dark:text-dark-heading hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50"
                                }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`px-4 py-2 rounded-lg border border-[#E2E8F0] dark:border-dark-border text-sm font-medium transition-colors duration-200 ${
                            currentPage === totalPages
                                ? "opacity-50 cursor-not-allowed text-[#94A3B8] dark:text-dark-text"
                                : "hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 text-[#0F172A] dark:text-dark-heading"
                        }`}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Category;