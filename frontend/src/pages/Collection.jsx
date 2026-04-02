import React, { useState, useContext, useEffect } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItem from "../components/ProductItem";

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subcategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState("relevant");

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subcategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();
    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );
    }
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category),
      );
    }
    if (subcategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subcategory.includes(item.subCategory),
      ); // fixed
    }
    setFilterProducts(productsCopy);
  };
  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "low-high":
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;
      case "high-low":
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subcategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]); // Fixed: wrapped in array

  return (
    <div
      className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t"
      // style={{ background: "#faf8f5" }}
    >
      {/*Filter options */}
      {/* Filter Sidebar */}
      <div className="min-w-[240px] w-[240px]">
        {/* Mobile toggle */}
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xs tracking-[0.18em] uppercase font-medium flex items-center justify-between cursor-pointer sm:cursor-default text-gray-400"
        >
          Filters
          <img
            className={`h-3 sm:hidden transition-transform duration-200 ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>

        {/* Panel card */}
        <div className={`${showFilter ? "block" : "hidden"} sm:block bg-white overflow-hidden`}
          style={{ borderRadius: "2px", border: "1px solid #e2ddd6" }}
        >
          {/* Dark header */}
          <div className="bg-[#1c1c1a] px-5 py-4 flex items-center justify-between">
            <span className="text-[11px] font-medium tracking-[0.18em] uppercase text-white">
              Filters
            </span>
            {category.length + subcategory.length > 0 && (
              <button
                onClick={() => {
                  setCategory([]);
                  setSubCategory([]);
                }}
                className="text-[10px] tracking-widest uppercase text-gray-500 hover:text-white transition-colors bg-transparent border-none"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Categories */}
          <div className="px-5 pt-5 pb-4 border-b border-[#f0ede8]">
            <p className="text-[9px] tracking-[0.18em] uppercase font-medium text-[#b0ada6] mb-3">
              Categories
            </p>
            <div className="flex flex-col gap-1.5">
              {["Men", "Women", "Kids"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => toggleCategory({ target: { value: cat } })}
                  className={`flex items-center justify-between px-3 py-2.5 border transition-all duration-150 text-left w-full
              ${
                category.includes(cat)
                  ? "bg-[#1c1c1a] border-[#1c1c1a]"
                  : "bg-white border-[#e8e4de] hover:border-[#1c1c1a]"
              }`}
                  style={{ borderRadius: "2px" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${category.includes(cat) ? "bg-white" : "bg-[#d0cdc6]"}`}
                    />
                    <span
                      className={`text-[12px] tracking-wide transition-colors ${category.includes(cat) ? "text-white" : "text-[#2c2c2a]"}`}
                    >
                      {cat}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Type */}
          <div className="px-5 pt-5 pb-4">
            <p className="text-[9px] tracking-[0.18em] uppercase font-medium text-[#b0ada6] mb-3">
              Type
            </p>
            <div className="flex flex-col gap-1.5">
              {["Topwear", "Bottomwear", "Winterwear"].map((type) => (
                <button
                  key={type}
                  onClick={() => toggleSubCategory({ target: { value: type } })}
                  className={`flex items-center justify-between px-3 py-2.5 border transition-all duration-150 text-left w-full
              ${
                subcategory.includes(type)
                  ? "bg-[#1c1c1a] border-[#1c1c1a]"
                  : "bg-white border-[#e8e4de] hover:border-[#1c1c1a]"
              }`}
                  style={{ borderRadius: "2px" }}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${subcategory.includes(type) ? "bg-white" : "bg-[#d0cdc6]"}`}
                    />
                    <span
                      className={`text-[12px] tracking-wide transition-colors ${subcategory.includes(type) ? "text-white" : "text-[#2c2c2a]"}`}
                    >
                      {type}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Footer count */}
          <div className="px-5 py-3 bg-[#faf8f5] flex items-center justify-between">
            <span className="text-[10px] tracking-wide text-[#888]">
              Active filters
            </span>
            <span className="text-[10px] font-medium tracking-wide text-[#1c1c1a] bg-[#e8e4de] px-2 py-0.5 rounded-full">
              {category.length + subcategory.length === 0
                ? "None"
                : `${category.length + subcategory.length} selected`}
            </span>
          </div>
        </div>
      </div>
      {/*Right side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"}></Title>
          {/*Product sort */}
          <div className="relative">
            <select
              onChange={(e) => setSortType(e.target.value)}
              className="appearance-none bg-white border border-gray-300 text-sm text-gray-700 pl-4 pr-10 py-2.5 rounded-none cursor-pointer hover:border-gray-500 focus:outline-none focus:border-gray-800 transition-colors duration-200"
              style={{ fontFamily: "inherit", letterSpacing: "0.03em" }}
            >
              <option value="relevant">Sort by: Relevant</option>
              <option value="low-high">Sort by: Low to High</option>
              <option value="high-low">Sort by: High to Low</option>
            </select>
            {/* Custom chevron icon */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2 4L6 8L10 4"
                  stroke="#555"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        {/*Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.images}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
