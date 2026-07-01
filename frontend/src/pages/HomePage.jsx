"use client";

import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";
import { FaLeaf, FaUsers, FaShoppingBasket, FaHandshake } from "react-icons/fa";

const HomePage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Safe defaults so .length never crashes
  const { products = [], loading: productLoading } =
    useSelector((state) => state.products || {});

  const { farmers = [], loading: farmerLoading } =
    useSelector((state) => state.farmers || {});

  const { categories = [], loading: categoryLoading } =
    useSelector((state) => state.categories || {});

  useEffect(() => {
    dispatch(getProducts({ limit: 8 }));
    dispatch(getAllFarmers());
    dispatch(getCategories());
  }, [dispatch]);

  return (
    <div>
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative z-10 w-full">
          <div className="max-w-2xl mx-auto text-center px-4">
            <div className="inline-block bg-green-100 text-green-800 text-xs font-semibold rounded-full px-3 py-1 mb-6 shadow-sm border border-green-200">
              <span className="uppercase tracking-wider">
                {t("announcement", "KisanBazar Announcement")}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900">
              {t("hero_title_part1", "Connect Directly with")}
              <br className="hidden md:block" /> {t("hero_title_part2", "Local Farmers")}
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-10">
              {t("hero_subtitle", "Get fresh, locally grown produce delivered straight from farm to your table. Support local agriculture and enjoy seasonal variety.")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/products"
                className="btn btn-primary px-8 py-3 text-lg rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {t("shop_now", "Shop Now")}
              </Link>
              <Link
                to="/farmers"
                className="btn btn-outline px-8 py-3 text-lg rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {t("meet_farmers", "Meet Our Farmers")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">
            {t("why_choose", "Why Choose KisanBazar?")}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            <div className="glass p-4 rounded-2xl text-center transition-transform duration-300 shadow-lg hover:shadow-xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaLeaf className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("fresh_local", "Fresh & Local")}</h3>
              <p className="text-gray-600">
                {t("fresh_local_desc", "Get the freshest produce harvested directly from local farms.")}
              </p>
            </div>

            <div className="glass p-4 rounded-2xl text-center transition-transform duration-300 shadow-lg hover:shadow-xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t("support_farmers", "Support Local Farmers")}
              </h3>
              <p className="text-gray-600">
                {t("support_farmers_desc", "Help sustain local agriculture and support farming families in your community.")}
              </p>
            </div>

            <div className="glass p-4 rounded-2xl text-center transition-transform duration-300 shadow-lg hover:shadow-xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBasket className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{t("seasonal_variety", "Seasonal Variety")}</h3>
              <p className="text-gray-600">
                {t("seasonal_variety_desc", "Discover a wide variety of seasonal fruits, vegetables, and farm products.")}
              </p>
            </div>

            <div className="glass p-4 rounded-2xl text-center transition-transform duration-300 shadow-lg hover:shadow-xl">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaHandshake className="text-green-500 text-3xl" />
              </div>
              <h3 className="text-xl font-semibold mb-4">
                {t("direct_comm", "Direct Communication")}
              </h3>
              <p className="text-gray-600">
                {t("direct_comm_desc", "Connect directly with farmers to learn about their growing practices.")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">
              {t("featured_products", "Featured Products")}
            </h2>
            <Link
              to="/products"
              className="text-green-600 hover:text-green-800 font-medium text-lg transition-all duration-300"
            >
              {t("view_all_products", "View All Products →")}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {productLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : Array.isArray(products) && products.length > 0 ? (
              products.slice(0, 4).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  {t("no_featured_products", "No Featured Products Available")}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t("check_back_soon", "Check back soon for new products!")}
                </p>
                <Link
                  to="/products"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  {t("browse_all_products", "Browse All Products →")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">
            {t("browse_category", "Browse By Category")}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categoryLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : !Array.isArray(categories) || categories.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  {t("categories_coming_soon", "Categories Coming Soon")}
                </h3>
                <p className="text-gray-500">
                  {t("categories_coming_soon_desc", "We're working on organizing our products into categories.")}
                </p>
              </div>
            ) : (
              categories.map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category._id}`}
                  className="glass p-6 rounded-2xl text-center transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-green-600 text-2xl font-bold">
                      {category.icon}
                    </span>
                  </div>
                  <h3 className="font-semibold text-base text-gray-700">
                    {category.name}
                  </h3>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Farmers */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800">{t("our_farmers", "Our Farmers")}</h2>
            <Link
              to="/farmers"
              className="text-green-600 hover:text-green-800 font-medium text-lg transition-all duration-300"
            >
              {t("view_all_farmers", "View All Farmers →")}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {farmerLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : Array.isArray(farmers) && farmers.length > 0 ? (
              farmers.slice(0, 3).map((farmer) => (
                <FarmerCard key={farmer._id} farmer={farmer} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                  {t("no_farmers_yet", "No Farmers Available Yet")}
                </h3>
                <p className="text-gray-500 mb-6">
                  {t("no_farmers_yet_desc", "We're working on connecting with local farmers.")}
                </p>
                <Link
                  to="/farmers"
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  {t("check_back_later", "Check Back Later →")}
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">{t("ready_get_started", "Ready to Get Started?")}</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            {t("ready_get_started_desc", "Join our community today and start enjoying fresh, local produce while supporting farmers in your area.")}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link
              to="/register"
              className="btn bg-white text-green-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg"
            >
              {t("sign_up_now", "Sign Up Now")}
            </Link>
            <Link
              to="/about"
              className="btn border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-3 rounded-lg font-bold text-lg"
            >
              {t("learn_more", "Learn More")}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
