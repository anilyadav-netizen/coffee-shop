import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct } from "../../redux/Slicer/adminProductSlice";
import { toast } from "react-toastify";

const Products = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, loading, totalProducts } = useSelector(
        (state) => state.adminProducts
    );
    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteProduct(id))
            .unwrap()
            .then(() => {
                toast.success("Product deleted successfully!");
            })
            .catch((error) => {
                toast.error(error || "Failed to delete product");
            });
    };

    const handleEdit = (id) => {
        navigate(`/admin/update-product/${id}`);
    };

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
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
                        Products
                    </h1>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#F1F5F9] dark:bg-dark-bg/50 text-[#64748B] dark:text-dark-text border border-[#E2E8F0] dark:border-dark-border">
                        {totalProducts}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                    {/* Search */}
                    <div className="relative flex-1 sm:flex-none">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[220px] pl-9 pr-4 py-3 border border-[#E2E8F0] dark:border-dark-border rounded-lg bg-white dark:bg-dark-bg text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-sm outline-none focus:ring-2 focus:ring-[#3B82F6] dark:focus:ring-[#60A5FA] focus:border-transparent transition-all shadow-sm"
                        />
                    </div>

                    {/* Add Button */}
                    <Link
                        to="/admin/add-product"
                        className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#3B82F6] text-white rounded-lg hover:bg-[#2563EB] transition-colors duration-200 text-sm font-medium shadow-md shadow-[#3B82F6]/20 dark:shadow-[#3B82F6]/10 whitespace-nowrap"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-xl bg-white dark:bg-dark-card shadow-sm">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Image</th>
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Name</th>
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Original Price</th>
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Discount</th>
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Final Price</th>
                            <th className="p-4 text-left text-sm font-medium text-[#64748B] dark:text-dark-text">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts?.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150"
                                >
                                    <td className="p-3">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-lg object-cover border border-[#E2E8F0] dark:border-dark-border"
                                        />
                                    </td>
                                    <td className="p-3 font-medium text-[#0F172A] dark:text-dark-heading">
                                        {product.name}
                                    </td>
                                    <td className="p-3 text-[#0F172A] dark:text-dark-heading whitespace-nowrap">
                                        ₹{product.price}
                                    </td>
                                    <td className="p-3">
                                        {product.discountPercentage ? (
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                -{product.discountPercentage}%
                                            </span>
                                        ) : (
                                            <span className="text-[#94A3B8] dark:text-dark-text text-sm">No discount</span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        {product.discountPrice ? (
                                            <div className="flex flex-col">
                                                <span className="text-[#0F172A] dark:text-dark-heading font-medium">
                                                    ₹{product.discountPrice}
                                                </span>
                                                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                                                    Save ₹{product.price - product.discountPrice}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[#0F172A] dark:text-dark-heading">
                                                ₹{product.price}
                                            </span>
                                        )}
                                    </td>
                                    <td className="p-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(product._id)}
                                                className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-lg hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-200 group"
                                                title="Edit Product"
                                            >
                                                <FaEye className="text-[#3B82F6] dark:text-[#60A5FA] group-hover:scale-110 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="w-9 h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200 group"
                                                title="Delete Product"
                                            >
                                                <FaTrash className="group-hover:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-10 text-[#64748B] dark:text-dark-text">
                                    {search ? "No products found matching your search" : "No Products Found"}
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
                        {Array.from({ length: totalPages }, (_, i) => i + 1)?.map((page) => (
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

export default Products;