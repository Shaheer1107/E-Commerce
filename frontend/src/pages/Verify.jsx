import React, { useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// This page is never seen by the user — Stripe redirects here after payment
// and we immediately verify the result, then redirect to /orders or /cart

const Verify = () => {
  const { backendUrl, token, setCartItems, userId } = useContext(ShopContext); // 1. grab userId
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const success   = searchParams.get('success');
  const orderId   = searchParams.get('orderId');
  const sessionId = searchParams.get('sessionId'); // 2. grab sessionId from URL

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/verifyStripe`,
          { success, orderId, sessionId, userId }, // 3. send all required fields
          { headers: { token } }
        );

        if (response.data.success) {
          setCartItems({});
          toast.success('Payment successful!');
          navigate('/orders');
        } else {
          toast.error('Payment cancelled.');
          navigate('/cart');
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        navigate('/cart');
      }
    };

    if (success && orderId && sessionId && token) { // 4. also guard on sessionId
      verifyPayment();
    }
  }, [token]);


  return (
    <div className='min-h-[60vh] flex items-center justify-center'>
      <div className='flex flex-col items-center gap-3'>
        <div className='w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin'></div>
        <p className='text-gray-500 text-sm'>Verifying your payment...</p>
      </div>
    </div>
  );
};

export default Verify;