import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaLeaf, FaCheckCircle, FaShieldAlt, FaStar } from "react-icons/fa";

const FarmerCard = ({ farmer }) => {
  // Check profile data if available (it should be now)
  const { profile } = farmer;
  const isTrusted = profile?.averageRating >= 4.5 && profile?.numReviews > 10;

  return (
    <div className="card transition-transform duration-300 hover:shadow-lg">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
              {profile?.farmImages?.length > 0 ? (
                <img src={profile.farmImages[0]} alt="Farm" className="w-full h-full object-cover" />
              ) : (
                <FaLeaf className="text-green-500 text-2xl" />
              )}
            </div>
            {profile?.isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5" title="Verified Farmer">
                <FaCheckCircle className="text-green-500 text-lg" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-xl font-semibold flex items-center">
              {farmer.name}
              {isTrusted && <FaShieldAlt className="text-blue-500 ml-2 text-sm" title="Trusted Farmer" />}
            </h3>
            <div className="flex items-center text-yellow-500 text-sm mb-1">
              <span className="font-bold mr-1">{profile?.averageRating?.toFixed(1) || "0.0"}</span>
              <FaStar />
              <span className="text-gray-400 text-xs ml-1">({profile?.numReviews || 0})</span>
            </div>
            {farmer.address && (
              <div className="flex items-center text-gray-500 text-sm">
                <FaMapMarkerAlt className="mr-1" />
                <span>
                  {farmer.address.city}, {farmer.address.state}
                </span>
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/farmers/${farmer._id}`}
          className="block w-full bg-green-500 text-white text-center py-2 rounded-lg hover:bg-green-600 transition-colors"
        >
          View Farm
        </Link>
      </div>
    </div>
  );
};

export default FarmerCard;
