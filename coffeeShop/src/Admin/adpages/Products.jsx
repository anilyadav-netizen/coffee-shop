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

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    // ✅ Handle Delete
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id))
                .unwrap()
                .then(() => {
                    toast.success("Product deleted successfully!");
                })
                .catch((error) => {
                    toast.error(error || "Failed to delete product");
                });
        }
    };

    // ✅ Handle View/Edit
    const handleEdit = (id) => {
        navigate(`/admin/update-product/${id}`);
    };

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-[#0D7C53] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                        Products
                    </h1>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Total {totalProducts} products
                    </p>
                </div>

                <Link
                    to="/admin/add-product"
                    className="flex items-center gap-2 px-4 py-2 bg-[#0D7C53] text-white rounded-lg hover:bg-[#0a6a45] transition-colors duration-200"
                >
                    <FaPlus />
                    Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-300">
                    <span>All ({products.length})</span>
                    <span>
                        In Stock ({products.filter((p) => p.stock > 0).length})
                    </span>
                    <span>
                        Out Of Stock ({products.filter((p) => p.stock === 0).length})
                    </span>
                </div>

                <div className="flex gap-2">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-3 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search Product"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 border rounded-md outline-none dark:bg-zinc-800 dark:border-zinc-700"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800">
                            <th className="p-4 text-left">
                                <input type="checkbox" />
                            </th>
                            <th className="p-4 text-left">Image</th>
                            <th className="p-4 text-left">Name</th>
                            <th className="p-4 text-left">Price</th>
                            <th className="p-4 text-left">Stock</th>
                            <th className="p-4 text-left">Status</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                                >
                                    <td className="p-4">
                                        <input type="checkbox" />
                                    </td>

                                    <td className="p-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-md object-cover"
                                        />
                                    </td>

                                    <td className="p-4 font-medium text-zinc-900 dark:text-white">
                                        {product.name}
                                    </td>

                                    <td className="p-4">₹{product.price}</td>

                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-xs border rounded-md ${
                                                product.stock === 0
                                                    ? "text-red-500 border-red-300 dark:border-red-700"
                                                    : "text-green-500 border-green-300 dark:border-green-700"
                                            }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                product.status === "active"
                                                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}
                                        >
                                            {product.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {/* ✅ Edit Button - Eye Icon */}
                                            <button
                                                onClick={() => handleEdit(product._id)}
                                                className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                                                title="Edit Product"
                                            >
                                                <FaEye className="text-blue-500" />
                                            </button>

                                            {/* ✅ Delete Button */}
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="w-9 h-9 flex items-center justify-center border rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                                title="Delete Product"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="text-center py-8 text-zinc-500">
                                    No Products Found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Products;