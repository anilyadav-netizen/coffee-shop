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

    // Filter products based on search
    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Reset to first page when search changes
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="bg-white dark:bg-dark-card rounded-xl p-6 border border-[#E2E8F0] dark:border-dark-border shadow-sm dark:shadow-xl flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-[#4F46E5] dark:border-dark-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="rounded-xl p-4 md:p-6 shadow-sm dark:shadow-xl">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold text-[#0F172A] dark:text-dark-heading">
                        Products
                    </h1>
                    <p className="text-base text-[#64748B] dark:text-dark-text">
                        Total {totalProducts} products
                    </p>
                </div>

                <Link
                    to="/admin/add-product"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#4F46E5] dark:bg-dark-primary text-white rounded-xl hover:bg-[#4338CA] dark:hover:bg-[#6366F1] transition-colors duration-200 text-base md:text-lg"
                >
                    <FaPlus />
                    Add Product
                </Link>
            </div>

            {/* Filters - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2 md:gap-4 text-base md:text-lg text-[#64748B] dark:text-dark-text">
                    <span className="bg-[#F8FAFC] dark:bg-dark-bg/50 px-3 py-1 rounded-full border border-[#E2E8F0] dark:border-dark-border">All ({products.length})</span>
                </div>

                <div className="w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#64748B] dark:text-dark-text" />
                        <input
                            type="text"
                            placeholder="Search Product"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[200px] md:w-[250px] pl-9 pr-4 py-2 border border-[#E2E8F0] dark:border-dark-border rounded-md outline-none text-[#0F172A] dark:text-dark-heading placeholder-[#64748B] dark:placeholder-dark-text text-base bg-white dark:bg-dark-bg"
                        />
                    </div>
                </div>
            </div>

            {/* Table with Horizontal Scroll */}
            <div className="overflow-x-auto border border-[#E2E8F0] dark:border-dark-border rounded-lg">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-[#E2E8F0] dark:border-dark-border bg-[#F8FAFC] dark:bg-dark-bg/50">
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Image</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Name</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Original Price</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Discount</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Final Price</th>
                            <th className="p-3 md:p-4 text-left text-sm md:text-lg text-[#64748B] dark:text-dark-text">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {currentProducts.length > 0 ? (
                            currentProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-[#E2E8F0] dark:border-dark-border hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-150"
                                >
                                    <td className="p-2 md:p-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover"
                                        />
                                    </td>

                                    <td className="p-2 md:p-4 font-medium text-[#0F172A] dark:text-dark-heading text-base md:text-lg">
                                        {product.name}
                                    </td>

                                    <td className="p-2 md:p-4 text-[#0F172A] dark:text-dark-heading text-base md:text-lg whitespace-nowrap">
                                        ₹{product.price}
                                    </td>

                                    <td className="p-2 md:p-4">
                                        {product.discountPercentage ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                -{product.discountPercentage}%
                                            </span>
                                        ) : (
                                            <span className="text-[#94A3B8] dark:text-dark-text text-sm">No discount</span>
                                        )}
                                    </td>

                                    <td className="p-2 md:p-4">
                                        {product.discountPrice ? (
                                            <div className="flex flex-col">
                                                <span className="text-[#0F172A] dark:text-dark-heading text-base md:text-lg font-medium">
                                                    ₹{product.discountPrice}
                                                </span>
                                                <span className="text-xs text-green-600 dark:text-green-400">
                                                    Save ₹{product.price - product.discountPrice}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-[#0F172A] dark:text-dark-heading text-base md:text-lg">
                                                ₹{product.price}
                                            </span>
                                        )}
                                    </td>

                                    <td className="p-2 md:p-4">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <button
                                                onClick={() => handleEdit(product._id)}
                                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-md hover:bg-[#F8FAFC] dark:hover:bg-dark-bg/50 transition-colors duration-200"
                                                title="Edit Product"
                                            >
                                                <FaEye className="text-[#4F46E5] dark:text-dark-primary text-sm md:text-base" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-[#E2E8F0] dark:border-dark-border rounded-md text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
                                                title="Delete Product"
                                            >
                                                <FaTrash className="text-sm md:text-base" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-[#64748B] dark:text-dark-text text-base">
                                    No Products Found
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
                        className={`px-4 py-2 rounded-md border border-[#E2E8F0] dark:border-dark-border text-base transition-colors duration-200 ${
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
                                className={`w-10 h-10 rounded-md border border-[#E2E8F0] dark:border-dark-border transition-colors duration-200 text-base ${
                                    currentPage === page
                                        ? "bg-[#4F46E5] dark:bg-dark-primary text-white border-[#4F46E5] dark:border-dark-primary"
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
                        className={`px-4 py-2 rounded-md border border-[#E2E8F0] dark:border-dark-border text-base transition-colors duration-200 ${
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