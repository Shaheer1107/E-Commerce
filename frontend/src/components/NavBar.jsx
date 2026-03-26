import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setShowSearch, getCartCount, token, setToken, setCartItems } =
    useContext(ShopContext);
  const navigate = useNavigate();

  const location = useLocation();
  const isCollection = location.pathname.includes("collection");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest("#profile-wrap")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <>
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-[#faf8f5] border-b border-[#e8e4de]">
        <div className="flex items-center justify-between px-6 sm:px-12 h-16">
          {/* Logo */}
          <Link
            to="/"
            className="text-[#1c1c1a] text-lg font-bold tracking-[0.18em] uppercase"
          >
            {assets.logo ? (
              <img src={assets.logo} className="w-32" alt="Logo" />
            ) : (
              <>
                Textiles<span className="text-[#b8a97a]">.</span>
              </>
            )}
          </Link>

          {/* Desktop Nav Links */}
          <ul className="hidden sm:flex gap-8 list-none">
            {[
              ["/", "Home"],
              ["/collection", "Collection"],
              ["/about", "About"],
              ["/contact", "Contact"],
            ].map(([path, label]) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `relative text-[10px] font-medium tracking-[0.2em] uppercase pb-0.5 transition-colors duration-150
                     after:absolute after:bottom-[-2px] after:left-0 after:h-px after:bg-[#1c1c1a] after:transition-all after:duration-200
                     ${isActive ? "text-[#1c1c1a] after:w-full" : "text-[#888] hover:text-[#1c1c1a] after:w-0 hover:after:w-full"}`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* Search */}
            {isCollection && (
              <button
                onClick={() => setShowSearch(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ede9e2] transition-colors"
              >
                <img src={assets.search_icon} className="w-4" alt="Search" />
              </button>
            )}

            {isCollection && <div className="w-px h-5 bg-[#e2ddd6] mx-1" />}

            {/* Profile dropdown */}
            <div className="relative" id="profile-wrap">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!token) {
                    navigate("/login");
                    return;
                  }
                  setDropdownOpen((prev) => !prev);
                }}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ede9e2] transition-colors"
              >
                <img src={assets.profile_icon} className="w-4" alt="Profile" />
              </button>

              {token && dropdownOpen && (
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#e8e4de] overflow-hidden z-50"
                  style={{ borderRadius: "2px" }}
                >
                  <div className="px-4 py-2.5 text-[11px] tracking-widest text-[#555] hover:bg-[#faf8f5] hover:text-[#1c1c1a] hover:pl-5 transition-all duration-150 cursor-pointer border-b border-[#f4f1ec]">
                    My Profile
                  </div>
                  <div
                    onClick={() => {
                      navigate("/orders");
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2.5 text-[11px] tracking-widest text-[#555] hover:bg-[#faf8f5] hover:text-[#1c1c1a] hover:pl-5 transition-all duration-150 cursor-pointer border-b border-[#f4f1ec]"
                  >
                    Orders
                  </div>
                  <div
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="px-4 py-2.5 text-[11px] tracking-widest text-red-400 hover:bg-[#faf8f5] hover:text-red-600 hover:pl-5 transition-all duration-150 cursor-pointer"
                  >
                    Logout
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ede9e2] transition-colors"
            >
              <img src={assets.cart_icon} className="w-4" alt="Cart" />
              {getCartCount() > 0 && (
                <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#1c1c1a] text-[#faf8f5] text-[7px] font-semibold rounded-full flex items-center justify-center">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setVisible(true)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ede9e2] transition-colors sm:hidden ml-1"
            >
              <img src={assets.menu_icon} className="w-4" alt="Menu" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-0 z-[60] transition-all duration-300 ${visible ? "visible" : "invisible"}`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setVisible(false)}
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${visible ? "opacity-30" : "opacity-0"}`}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-[#faf8f5] transition-transform duration-300 ${visible ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Drawer header */}
          <div className="flex items-center justify-between px-6 h-16 border-b border-[#e8e4de]">
            <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-[#888]">
              Menu
            </span>
            <button
              onClick={() => setVisible(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#ede9e2] transition-colors"
            >
              <img
                src={assets.dropdown_icon}
                className="h-3 rotate-180"
                alt="Close"
              />
            </button>
          </div>

          {/* Drawer links */}
          <nav className="flex flex-col mt-2">
            {[
              ["/", "Home"],
              ["/collection", "Collection"],
              ["/about", "About"],
              ["/contact", "Contact"],
            ].map(([path, label]) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setVisible(false)}
                className={({ isActive }) =>
                  `px-6 py-4 text-[11px] font-medium tracking-[0.2em] uppercase border-b border-[#f0ede8] transition-colors
                   ${isActive ? "text-[#1c1c1a] bg-white" : "text-[#888] hover:text-[#1c1c1a] hover:bg-white"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;