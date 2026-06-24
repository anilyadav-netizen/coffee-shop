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
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0D7C53] mx-auto"></div>
                    <p className="mt-4 text-zinc-600 dark:text-zinc-400">Loading categories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                        Categories
                    </h1>

                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Total {categories.length} Categories
                    </p>
                </div>

                <Link
                    to="/admin/add-category"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0D7C53] text-white rounded-lg hover:bg-[#0a6a45] transition"
                >
                    <FaPlus />
                    Add Category
                </Link>
            </div>

            {/* Search */}
            <div className="flex justify-end mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-3 text-zinc-400" />

                    <input
                        type="text"
                        placeholder="Search Category"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-md outline-none dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                            <th className="p-4 text-left">Icon</th>
                            <th className="p-4 text-left">Category Name</th>
                            <th className="p-4 text-left">Created At</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCategories.length > 0 ? (
                            filteredCategories.map((category) => (
                                <tr
                                    key={category._id}
                                    className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                >
                                    <td className="p-4">
                                        <img
                                            src={category.icon}
                                            alt={category.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    </td>

                                    <td className="p-4 font-medium text-zinc-900 dark:text-white">
                                        {category.name}
                                    </td>

                                    <td className="p-4 text-zinc-600 dark:text-zinc-400">
                                        {new Date(
                                            category.createdAt
                                        ).toLocaleDateString()}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() =>
                                                    handleEdit(category._id)
                                                }
                                                className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                                title="Edit category"
                                            >
                                                
                                                <FaEdit className="text-blue-500" />
                                            </button>

                                            <button
                                                onClick={() =>
                                                    handleDelete(category._id, category.name)
                                                }
                                                disabled={deleteLoading}
                                                className="w-9 h-9 flex items-center justify-center border rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                                title="Delete category"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="text-center py-8 text-zinc-500"
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