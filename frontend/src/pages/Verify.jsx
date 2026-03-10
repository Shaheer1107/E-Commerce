import React, { useContext, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import axios from 'axios';

// This page is never seen by the user — Stripe redirects here after payment
// and we immediately verify the result, then redirect to /orders or /cart

const Verify = () => {
  const { backendUrl, token, setCartItems } = useContext(ShopContext);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Stripe appends ?success=true&orderId=... or ?success=false&orderId=... to the URL
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/order/verifyStripe`,
          { success, orderId },
          { headers: { token } }
        );

        if (response.data.success) {
          // Payment confirmed — clear cart and go to orders page
          setCartItems({});
          toast.success('Payment successful!');
          navigate('/orders');
        } else {
          // Payment cancelled or failed — go back to cart
          toast.error('Payment cancelled.');
          navigate('/cart');
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
        navigate('/cart');
      }
    };

    // Only verify if we have both params — prevents running on accidental direct visits
    if (success && orderId && token) {
      verifyPayment();
    }
  }, [token]); // re-runs if token loads after mount (e.g. on page refresh)

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