import { createContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { setCartItems, addToCart as addToCartAction, updateQuantity as updateQtyAction, clearCart } from "../store/slices/cartSlice.js";
import { setToken as setTokenAction, logout } from "../store/slices/authSlice";
import { setProducts } from "../store/slices/productSlice";
import { setSearch as setSearchAction, setShowSearch as setShowSearchAction } from "../store/slices/uiSlice.js";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = '$';
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const dispatch = useDispatch();

  // Read from Redux instead of local useState
  const token = useSelector(state => state.auth.token);
  const cartItems = useSelector(state => state.cart.items);
  const products = useSelector(state => state.products.list);
  const search = useSelector(state => state.ui.search);
  const showSearch = useSelector(state => state.ui.showSearch);

  // Wrapper functions that dispatch to Redux
  const setToken = (val) => dispatch(setTokenAction(val));
  const setSearch = (val) => dispatch(setSearchAction(val));
  const setShowSearch = (val) => dispatch(setShowSearchAction(val));
  const setCartItemsContext = (val) => dispatch(setCartItems(val));

  const addToCart = async (itemId, size) => {
    if (!size) { toast.error('Select Product Size'); return; }
    dispatch(addToCartAction({ itemId, size }));
    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/add', { itemId, size }, { headers: { token } });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const updateQuantity = async (itemId, size, quantity) => {
    dispatch(updateQtyAction({ itemId, size, quantity }));
    if (token) {
      try {
        await axios.post(backendUrl + '/api/cart/update', { itemId, size, quantity }, { headers: { token } });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const getCartCount = () => {
    let count = 0;
    for (const id in cartItems)
      for (const size in cartItems[id])
        if (cartItems[id][size] > 0) count += cartItems[id][size];
    return count;
  };

  const getCartAmount = () => {
    let total = 0;
    for (const id in cartItems) {
      const product = products.find(p => p._id === id);
      if (!product) continue;
      for (const size in cartItems[id])
        if (cartItems[id][size] > 0)
          total += product.price * cartItems[id][size];
    }
    return total;
  };

  const getProductsData = async () => {
    try {
      const res = await axios.get(backendUrl + '/api/product/list');
      if (res.data.success) dispatch(setProducts(res.data.products));
      else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const loadUserCart = async (userToken) => {
    try {
      const res = await axios.post(backendUrl + '/api/cart/get', {}, { headers: { token: userToken } });
      if (res.data.success) dispatch(setCartItems(res.data.cartData));
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => { getProductsData(); }, []);
  useEffect(() => { if (token) loadUserCart(token); }, [token]);

  const value = {
    products, currency, delivery_fee,
    search, setSearch, showSearch, setShowSearch,
    cartItems, setCartItems: setCartItemsContext,
    addToCart, getCartCount, updateQuantity,
    getCartAmount, backendUrl,
    setToken, token,
    logout: () => { dispatch(logout()); dispatch(clearCart()); }
  };

  return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
};

export default ShopContextProvider;