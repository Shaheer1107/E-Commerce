import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'

const statusColors = {
  'Order Placed':     'bg-blue-400',
  'Packing':          'bg-yellow-400',
  'Shipped':          'bg-orange-400',
  'Out for Delivery': 'bg-purple-400',
  'Delivered':        'bg-green-500',
  'Cancelled':        'bg-red-500',
}

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext)

  const [orderData, setOrderData] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadOrderData = async ({ silent = false } = {}) => {
    try {

      if (!token) return

      silent ? setRefreshing(true) : setLoading(true)

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { token } }
      )

      if (response.data.success) {

        let allOrderItems = []

        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {

            allOrderItems.push({
              ...item,
              status: order.status,
              payment: order.payment,
              paymentMethod: order.paymentMethod,
              date: order.date,
              orderId: order._id,
            })

          })
        })

        setOrderData(allOrderItems)

      } else {
        toast.error(response.data.message)
      }

    } catch (error) {
      console.error(error)
      toast.error(error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])


  if (loading) {
    return (
      <div className='border-t pt-16 min-h-[60vh] flex items-center justify-center'>
        <div className='w-8 h-8 border-4 border-gray-300 border-t-black rounded-full animate-spin' />
      </div>
    )
  }

  return (
    <div className='border-t pt-16'>

      <div className='text-2xl mb-6'>
        <Title text1='MY' text2='ORDERS' />
      </div>

      {orderData.length === 0 ? (

        <div className='text-center text-gray-400 py-20'>
          <p className='text-lg'>You have no orders yet.</p>
        </div>

      ) : (

        <div>

          {orderData.map((item, index) => {

            // ✅ Safe image handling
            let productImage = ''

            if (Array.isArray(item.image)) {
              productImage = item.image[0]
            } else if (Array.isArray(item.images)) {
              productImage = item.images[0]
            } else {
              productImage = item.image
            }

            return (

              <div
                key={index}
                className='py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'
              >

                {/* LEFT SIDE */}
                <div className='flex items-start gap-6 text-sm'>

                  <img
                    className='w-16 sm:w-20 object-cover'
                    src={productImage || '/placeholder.png'}
                    alt={item.name}
                  />

                  <div>

                    <p className='sm:text-base font-medium'>{item.name}</p>

                    <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                      <p>{currency}{item.price}</p>
                      <p>Qty: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>

                    <p className='mt-1 text-sm'>
                      Date: <span className='text-gray-400'>{new Date(item.date).toDateString()}</span>
                    </p>

                    <p className='mt-1 text-sm'>
                      Payment: <span className='text-gray-400'>{item.paymentMethod}</span>
                    </p>

                    <p className='mt-1 text-sm'>
                      Paid:{' '}
                      {item.payment
                        ? <span className='text-green-500 font-medium'>Confirmed</span>
                        : <span className='text-gray-400'>
                            {item.paymentMethod === 'COD'
                              ? 'Pay on delivery'
                              : 'Pending'}
                          </span>
                      }
                    </p>

                  </div>

                </div>

                {/* RIGHT SIDE */}
                <div className='md:w-1/2 flex justify-between items-center'>

                  <div className='flex items-center gap-2'>
                    <span className={`w-2 h-2 rounded-full ${statusColors[item.status] || 'bg-gray-400'}`} />
                    <p className='text-sm md:text-base font-medium'>{item.status}</p>
                  </div>

                  <button
                    onClick={() => loadOrderData({ silent: true })}
                    disabled={refreshing}
                    className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-50 flex items-center gap-2'
                  >

                    {refreshing && (
                      <span className='w-3 h-3 border-2 border-gray-400 border-t-black rounded-full animate-spin inline-block' />
                    )}

                    Track Order

                  </button>

                </div>

              </div>

            )

          })}

        </div>

      )}

    </div>
  )
}

export default Orders