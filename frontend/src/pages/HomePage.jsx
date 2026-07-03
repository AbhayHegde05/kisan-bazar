"use client";

import { Suspense, lazy, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaHandshake,
  FaLeaf,
  FaSeedling,
  FaShoppingBasket,
  FaTruck,
  FaUsers,
} from "react-icons/fa";
import { getProducts } from "../redux/slices/productSlice";
import { getAllFarmers } from "../redux/slices/farmerSlice";
import { getCategories } from "../redux/slices/categorySlice";
import ProductCard from "../components/ProductCard";
import FarmerCard from "../components/FarmerCard";
import Loader from "../components/Loader";

const HeroScene3D = lazy(() => import("../components/HeroScene3D"));

const featureCards = [
  {
    icon: FaLeaf,
    titleKey: "fresh_local",
    title: "Fresh & Local",
    descKey: "fresh_local_desc",
    desc: "Get the freshest produce harvested directly from local farms.",
  },
  {
    icon: FaUsers,
    titleKey: "support_farmers",
    title: "Support Local Farmers",
    descKey: "support_farmers_desc",
    desc: "Help sustain local agriculture and support farming families in your community.",
  },
  {
    icon: FaShoppingBasket,
    titleKey: "seasonal_variety",
    title: "Seasonal Variety",
    descKey: "seasonal_variety_desc",
    desc: "Discover seasonal fruits, vegetables, grains, and farm products.",
  },
  {
    icon: FaHandshake,
    titleKey: "direct_comm",
    title: "Direct Communication",
    descKey: "direct_comm_desc",
    desc: "Connect directly with farmers to learn about their growing practices.",
  },
];

const journeySteps = [
  { icon: FaSeedling, label: "Harvested today", tone: "from-green-400 to-emerald-600" },
  { icon: FaTruck, label: "Packed with care", tone: "from-orange-400 to-amber-500" },
  { icon: FaShoppingBasket, label: "Delivered fresh", tone: "from-lime-400 to-green-600" },
];

const HomePage = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

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

  const featuredProducts = Array.isArray(products) ? products.slice(0, 4) : [];
  const featuredFarmers = Array.isArray(farmers) ? farmers.slice(0, 3) : [];

  return (
    <div className="overflow-hidden bg-[#f7fbf4] text-slate-950">
      <section className="relative min-h-[calc(100vh-64px)] overflow-hidden bg-[radial-gradient(circle_at_75%_20%,rgba(249,168,38,0.22),transparent_28%),linear-gradient(135deg,#f8fff5_0%,#eef8e8_48%,#dbeebf_100%)]">
        <div className="absolute inset-0 opacity-[0.18] farm-grid" aria-hidden="true" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#f7fbf4] to-transparent" aria-hidden="true" />

        <div className="container relative z-10 mx-auto grid min-h-[calc(100vh-64px)] grid-cols-1 items-center gap-8 px-4 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:py-10">
          <div className="max-w-2xl animate-rise-in">
            <h1 className="max-w-3xl text-5xl font-black leading-[1.02] text-[#132416] md:text-6xl lg:text-7xl">
              {t("hero_title_part1", "Connect Directly with")}
              <span className="block text-[#4f7942]">
                {t("hero_title_part2", "Local Farmers")}
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-slate-700 md:text-xl">
              {t(
                "hero_subtitle",
                "Get fresh, locally grown produce delivered straight from farm to your table. Support local agriculture and enjoy seasonal variety."
              )}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/products"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-[#31572c] px-7 py-4 text-base font-bold text-white shadow-[0_18px_45px_rgba(49,87,44,0.28)] transition duration-300 hover:-translate-y-1 hover:bg-[#243f21]"
              >
                {t("shop_now", "Shop Now")}
                <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/farmers"
                className="inline-flex items-center justify-center rounded-full border border-[#31572c]/35 bg-white/70 px-7 py-4 text-base font-bold text-[#31572c] shadow-[0_18px_45px_rgba(49,87,44,0.12)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:bg-white"
              >
                {t("meet_farmers", "Meet Our Farmers")}
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-3">
              {[
                ["250+", "Farmers"],
                ["24h", "Fresh cycle"],
                ["4.8", "Avg rating"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur">
                  <div className="text-2xl font-black text-[#31572c]">{value}</div>
                  <div className="mt-1 text-xs font-semibold uppercase text-slate-500">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[440px] min-h-[360px] lg:h-[620px]">
            <div className="absolute inset-0 scale-100 lg:scale-110">
              <Suspense fallback={<div className="h-full w-full animate-pulse rounded-[2rem] bg-white/20" />}>
                <HeroScene3D />
              </Suspense>
            </div>
            <div className="absolute right-2 top-8 hidden rounded-3xl border border-white/70 bg-white/60 p-5 shadow-[0_24px_70px_rgba(49,87,44,0.18)] backdrop-blur-md md:block">
              <div className="text-sm font-bold text-slate-900">Live market freshness</div>
              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full bg-orange-400 shadow-[0_0_0_6px_rgba(249,115,22,0.15)]" />
                Produce moving from farm to cart
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-4 pb-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-4 rounded-[2rem] border border-white bg-white/80 p-4 shadow-[0_30px_90px_rgba(49,87,44,0.12)] backdrop-blur md:grid-cols-3">
            {journeySteps.map(({ icon: Icon, label, tone }) => (
              <div key={label} className="group relative overflow-hidden rounded-[1.5rem] bg-[#f8fff5] p-6">
                <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${tone}`} />
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tone} text-white shadow-lg transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105`}>
                    <Icon className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-lg font-black text-slate-900">{label}</p>
                    <p className="mt-1 text-sm text-slate-500">A shorter path from soil to kitchen.</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
              {t("why_choose", "Why Choose KisanBazar?")}
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Built for buyers who want better food and farmers who deserve better reach.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {featureCards.map(({ icon: Icon, titleKey, title, descKey, desc }) => (
              <div
                key={titleKey}
                className="group rounded-[1.75rem] border border-green-900/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(49,87,44,0.16)]"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf7df] text-[#31572c] transition duration-300 group-hover:bg-[#31572c] group-hover:text-white">
                  <Icon className="text-3xl" />
                </div>
                <h3 className="text-xl font-black text-slate-950">{t(titleKey, title)}</h3>
                <p className="mt-3 leading-7 text-slate-600">{t(descKey, desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-24">
        <div className="absolute inset-0 bg-[#172815]" aria-hidden="true" />
        <div className="absolute inset-0 opacity-30 farm-grid-dark" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black text-white md:text-5xl">
                {t("featured_products", "Featured Products")}
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-green-50/75">
                Farm-picked essentials with richer stories, cleaner sourcing, and fresher arrivals.
              </p>
            </div>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 self-start rounded-full bg-white px-6 py-3 font-bold text-[#31572c] transition duration-300 hover:-translate-y-1 hover:bg-[#f7fbf4]"
            >
              {t("view_all_products", "View All Products")}
              <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {productLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <div key={product._id} className="product-showcase-card">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl border border-white/10 bg-white/10 p-10 text-center text-white">
                <h3 className="text-2xl font-bold">{t("no_featured_products", "No Featured Products Available")}</h3>
                <p className="mt-3 text-green-50/75">{t("check_back_soon", "Check back soon for new products!")}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
                {t("browse_category", "Browse By Category")}
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                Move through the market by harvest type, from crisp vegetables to grains, fruits, and daily staples.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {categoryLoading ? (
                <div className="col-span-full flex justify-center py-12">
                  <Loader />
                </div>
              ) : !Array.isArray(categories) || categories.length === 0 ? (
                <div className="col-span-full rounded-3xl bg-white p-10 text-center shadow-lg">
                  <h3 className="text-2xl font-semibold text-gray-700">
                    {t("categories_coming_soon", "Categories Coming Soon")}
                  </h3>
                </div>
              ) : (
                categories.slice(0, 6).map((category, index) => (
                  <Link
                    key={category._id}
                    to={`/products?category=${category._id}`}
                    className="group relative min-h-40 overflow-hidden rounded-[1.5rem] bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-2 hover:shadow-[0_28px_80px_rgba(49,87,44,0.16)]"
                  >
                    <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#edf7df] transition duration-300 group-hover:scale-125" />
                    <div className="relative text-4xl">{category.icon || ["Leaf", "Fresh", "Farm"][index % 3]}</div>
                    <h3 className="relative mt-8 text-lg font-black text-slate-950">{category.name}</h3>
                    <p className="relative mt-2 text-sm text-slate-500">Explore harvest</p>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-black text-slate-950 md:text-5xl">
                {t("our_farmers", "Our Farmers")}
              </h2>
              <p className="mt-4 max-w-2xl text-lg text-slate-600">
                Real growers, verified practices, and direct conversations before every order.
              </p>
            </div>
            <Link
              to="/farmers"
              className="inline-flex items-center gap-3 self-start rounded-full border border-[#31572c]/30 px-6 py-3 font-bold text-[#31572c] transition duration-300 hover:-translate-y-1 hover:bg-[#edf7df]"
            >
              {t("view_all_farmers", "View All Farmers")}
              <FaArrowRight />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {farmerLoading ? (
              <div className="col-span-full flex justify-center py-12">
                <Loader />
              </div>
            ) : featuredFarmers.length > 0 ? (
              featuredFarmers.map((farmer) => (
                <div key={farmer._id} className="farmer-showcase-card">
                  <FarmerCard farmer={farmer} />
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-3xl bg-[#f7fbf4] p-10 text-center">
                <h3 className="text-2xl font-semibold text-gray-700">
                  {t("no_farmers_yet", "No Farmers Available Yet")}
                </h3>
                <p className="mt-3 text-gray-500">
                  {t("no_farmers_yet_desc", "We're working on connecting with local farmers.")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#f97316] py-24 text-white">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-white/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-[#31572c]/35 blur-3xl" aria-hidden="true" />
        <div className="container relative z-10 mx-auto px-4 text-center">
          <h2 className="mx-auto max-w-3xl text-4xl font-black md:text-6xl">
            {t("ready_get_started", "Ready to Get Started?")}
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-white/90">
            {t(
              "ready_get_started_desc",
              "Join our community today and start enjoying fresh, local produce while supporting farmers in your area."
            )}
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/register"
              className="rounded-full bg-white px-8 py-4 text-lg font-black text-[#31572c] shadow-xl transition duration-300 hover:-translate-y-1"
            >
              {t("sign_up_now", "Sign Up Now")}
            </Link>
            <Link
              to="/about"
              className="rounded-full border border-white/70 px-8 py-4 text-lg font-black text-white transition duration-300 hover:-translate-y-1 hover:bg-white/15"
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
