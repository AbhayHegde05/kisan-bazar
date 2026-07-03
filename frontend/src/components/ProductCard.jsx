import { Link } from "react-router-dom";
import { placeholder } from "../assets";

const ProductCard = ({ product }) => {
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = placeholder;
  };

  return (
    <div className="card transition-transform duration-300">
      <div className="relative h-52 overflow-hidden rounded-t-[inherit]">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            onError={handleImageError}
            className="h-full w-full object-cover transition duration-500 hover:scale-105"
          />
        ) : (
          <img
            src={placeholder}
            alt="placeholder"
            className="h-full w-full object-cover"
          />
        )}
        {product.isOrganic && (
          <span className="absolute right-3 top-3 badge badge-green shadow-sm">
            Organic
          </span>
        )}
      </div>
      <div className="p-5">
        <h3 className="mb-1 truncate text-lg font-black text-slate-950">{product.name}</h3>
        <p className="mb-3 text-sm text-gray-500">
          {product.category?.name || "General"}
        </p>
        <div className="flex items-center justify-between gap-3">
          <span className="font-black text-green-600">
            Rs. {product.price.toFixed(2)} / {product.unit}
          </span>
          <Link
            to={`/products/${product._id}`}
            className="shrink-0 text-sm font-bold text-green-600 hover:text-green-800"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
