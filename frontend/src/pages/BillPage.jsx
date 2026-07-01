import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getOrderDetails } from "../redux/slices/orderSlice";
import Loader from "../components/Loader";

const BillPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getOrderDetails(id));
  }, [dispatch, id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || !order) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <Link
          to={`/orders/${order._id}`}
          className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors duration-200"
        >
          Back to Order
        </Link>
        <button
          onClick={handlePrint}
          className="btn btn-primary"
        >
          Print Bill
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-2xl mb-8 overflow-hidden p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-3 text-gray-800">
              Invoice
            </h1>
            <p className="text-gray-500">
              Order #{order._id.substring(0, 8)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">
              Date: {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Billed To
            </h2>
            <p>{order.consumer.name}</p>
            <p>{order.consumer.email}</p>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Billed By
            </h2>
            <p>{order.farmer.name}</p>
            <p>{order.farmer.email}</p>
          </div>
        </div>

        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-2">Product</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item._id} className="border-b border-gray-200">
                <td className="py-2">{item.product.name}</td>
                <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-1/3">
            <div className="flex justify-between">
              <p>Subtotal</p>
              <p>₹{order.totalAmount.toFixed(2)}</p>
            </div>
            <div className="flex justify-between font-bold text-xl">
              <p>Total</p>
              <p>₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillPage;
