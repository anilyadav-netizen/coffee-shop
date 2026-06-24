import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../redux/Slicer/adminProductSlice";
import { getCategories } from "../../redux/Slicer/categorySlice";
import { useEffect } from "react";


const Dashboard = () => {
    const dispatch = useDispatch()
    const { products } = useSelector(
        (state) => state.adminProducts
    )
    const { categories } = useSelector(
        (state) => state.category
    )
    useEffect(() => {
        dispatch(getProducts())
        dispatch(getCategories)
    }, dispatch)
    console.log(products)

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                Welcome ! Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
                    <h3 className="text-gray-500">
                        Total Products
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                        {products?.length || 0}
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
                    <h3 className="text-gray-500">
                        Total Category
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                        {categories?.length || 0}
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow">
                    <h3 className="text-gray-500">
                        Total Users
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                        0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;