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

    const handleEdit = (id) => {
        navigate(`/admin/update-product/${id}`);
    };

    const filteredProducts = products.filter((product) =>
        product.name?.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="bg-white dark:bg-[#261810] rounded-xl p-6 border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] shadow-[0_2px_8px_rgba(44,24,16,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-4 border-[#6F4E37] dark:border-[#C68E5C] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-[#261810] rounded-xl p-4 md:p-6 border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] shadow-[0_2px_8px_rgba(44,24,16,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)]">
            {/* Header - Responsive */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-xl md:text-2xl font-semibold text-[#2C1810] dark:text-[#F5EDE3]">
                        Products
                    </h1>
                    <p className="text-sm text-[#8B7355] dark:text-[#C4A882]">
                        Total {totalProducts} products
                    </p>
                </div>

                <Link
                    to="/admin/add-product"
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-[#6F4E37] dark:bg-[#C68E5C] text-[#F5EDE3] dark:text-[#1A0F0A] rounded-lg hover:bg-[#5C4033] dark:hover:bg-[#D4A574] transition-colors duration-200 text-sm md:text-base"
                >
                    <FaPlus />
                    Add Product
                </Link>
            </div>

            {/* Filters - Responsive */}
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="flex flex-wrap gap-2 md:gap-4 text-xs md:text-sm text-[#5C4033] dark:text-[#C4A882]">
                    <span className="dark:bg-[#3D2317] px-3 py-1 rounded-full">All ({products.length})</span>
                    <span className="dark:bg-[#3D2317] px-3 py-1 rounded-full">
                        In Stock ({products.filter((p) => p.stock > 0).length})
                    </span>
                    <span className="dark:bg-[#3D2317] px-3 py-1 rounded-full">
                        Out Of Stock ({products.filter((p) => p.stock === 0).length})
                    </span>
                </div>

                <div className="w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8B7355] dark:text-[#C4A882]" />
                        <input
                            type="text"
                            placeholder="Search Product"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full sm:w-[200px] md:w-[250px] pl-9 pr-4 py-2 border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-md outline-none text-[#2C1810] dark:text-[#F5EDE3] placeholder-[#8B7355] dark:placeholder-[#C4A882] text-sm bg-white dark:bg-[#1A0F0A]"
                        />
                    </div>
                </div>
            </div>

            {/* Table with Horizontal Scroll */}
            <div className="overflow-x-auto border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-lg">
                <table className="w-full min-w-[750px]">
                    <thead>
                        <tr className="border-b border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] bg-[#F5EDE3] dark:bg-[#3D2317]">
                            <th className="p-3 md:p-4 text-left text-xs md:text-sm text-[#5C4033] dark:text-[#C4A882]">Image</th>
                            <th className="p-3 md:p-4 text-left text-xs md:text-sm text-[#5C4033] dark:text-[#C4A882]">Name</th>
                            <th className="p-3 md:p-4 text-left text-xs md:text-sm text-[#5C4033] dark:text-[#C4A882]">Price</th>
                            <th className="p-3 md:p-4 text-left text-xs md:text-sm text-[#5C4033] dark:text-[#C4A882]">Stock</th>
                            <th className="p-3 md:p-4 text-left text-xs md:text-sm text-[#5C4033] dark:text-[#C4A882]">Status</th>
                            <th className="p-3 md:p-4 text-left text-xs md:text-sm text-[#5C4033] dark:text-[#C4A882]">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product._id}
                                    className="border-b border-[rgba(44,24,16,0.05)] dark:border-[rgba(245,237,227,0.05)] hover:bg-[#FDF8F3] dark:hover:bg-[#3D2317] transition-colors duration-150"
                                >
                                    <td className="p-2 md:p-4">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-10 h-10 md:w-12 md:h-12 rounded-md object-cover"
                                        />
                                    </td>

                                    <td className="p-2 md:p-4 font-medium text-[#2C1810] dark:text-[#F5EDE3] text-sm md:text-base">
                                        {product.name}
                                    </td>

                                    <td className="p-2 md:p-4 text-[#2C1810] dark:text-[#F5EDE3] text-sm md:text-base whitespace-nowrap">
                                        ₹{product.price}
                                    </td>

                                    <td className="p-2 md:p-4">
                                        <span
                                            className={`px-2 py-1 text-xs border rounded-md ${
                                                product.stock === 0
                                                    ? "text-red-600 border-red-300 dark:border-red-700"
                                                    : "text-[#6F4E37] dark:text-[#C68E5C] border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)]"
                                            }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>

                                    <td className="p-2 md:p-4">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                product.status === "active"
                                                    ? "bg-[#F5EDE3] dark:bg-[#3D2317] text-[#6F4E37] dark:text-[#C68E5C]"
                                                    : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {product.status === "active" ? "Active" : "Inactive"}
                                        </span>
                                    </td>

                                    <td className="p-2 md:p-4">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <button
                                                onClick={() => handleEdit(product._id)}
                                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-md hover:bg-[#F5EDE3] dark:hover:bg-[#3D2317] transition-colors duration-200"
                                                title="Edit Product"
                                            >
                                                <FaEye className="text-[#6F4E37] dark:text-[#C68E5C] text-xs md:text-sm" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)] rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200"
                                                title="Delete Product"
                                            >
                                                <FaTrash className="text-xs md:text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-8 text-[#8B7355] dark:text-[#C4A882] text-sm">
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