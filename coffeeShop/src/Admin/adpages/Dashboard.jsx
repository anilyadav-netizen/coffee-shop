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
            <h1 className="text-3xl font-bold mb-6 text-[#2C1810] dark:text-[#F5EDE3]">
                Welcome ! Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="bg-white dark:bg-[#261810] p-6 rounded-xl shadow-[0_2px_8px_rgba(44,24,16,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)]">
                    <h3 className="text-[#8B7355] dark:text-[#C4A882]">
                        Total Products
                    </h3>
                    <p className="text-3xl font-bold mt-2 text-[#2C1810] dark:text-[#F5EDE3]">
                        {products?.length || 0}
                    </p>
                </div>

                <div className="bg-white dark:bg-[#261810] p-6 rounded-xl shadow-[0_2px_8px_rgba(44,24,16,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)]">
                    <h3 className="text-[#8B7355] dark:text-[#C4A882]">
                        Total Category
                    </h3>
                    <p className="text-3xl font-bold mt-2 text-[#2C1810] dark:text-[#F5EDE3]">
                        {categories?.length || 0}
                    </p>
                </div>

                <div className="bg-white dark:bg-[#261810] p-6 rounded-xl shadow-[0_2px_8px_rgba(44,24,16,0.06)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.4)] border border-[rgba(44,24,16,0.08)] dark:border-[rgba(245,237,227,0.08)]">
                    <h3 className="text-[#8B7355] dark:text-[#C4A882]">
                        Total Users
                    </h3>
                    <p className="text-3xl font-bold mt-2 text-[#2C1810] dark:text-[#F5EDE3]">
                        0
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;