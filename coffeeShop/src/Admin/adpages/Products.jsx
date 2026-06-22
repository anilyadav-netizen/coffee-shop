import React, { useEffect, useState } from "react";
import { FaPlus, FaSearch, FaEye, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/Slicer/adminProductSlice";


const Products = () => {

    const dispatch = useDispatch()
    const { products, loading, totolProducts } = useSelector(
        (state) => state.adminProducts
    )

    useEffect(() => {
        dispatch(getProducts())
    }, [dispatch])
    const [search, setSearch] = useState("");


    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id))
                .unwrap()
                .then(() => {
                    toast.success('Product deleted successfully!');
                })
                .catch((error) => {
                    toast.error(error || 'Failed to delete product');
                });
        }
    };



    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white">
                    Products
                </h1>

                <Link to="/admin/add-product" className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
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

                    <span>Trash (0)</span>
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

                    <button className="px-4 py-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                        Search
                    </button>
                </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2 mb-4">
                <select className="px-3 py-2 border rounded-md dark:bg-zinc-800 dark:border-zinc-700">
                    <option>Bulk Actions</option>
                    <option>Delete</option>
                </select>

                <button className="px-4 py-2 border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                    Apply
                </button>
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
                            <th className="p-4 text-left">Created At</th>
                            <th className="p-4 text-left">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <tr
                                    key={product.id}
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
                                        <span className="px-2 py-1 text-xs border rounded-md">
                                            {product.stock}
                                        </span>
                                    </td>

                                    <td className="p-4">{product.createdAt}</td>

                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button className="w-9 h-9 flex items-center justify-center border rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800">
                                                <FaEye />
                                            </button>

                                            <button className="w-9 h-9 flex items-center justify-center border rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="text-center py-8 text-zinc-500"
                                >
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