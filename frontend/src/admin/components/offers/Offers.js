import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getOffers,
  deleteOffer,
  updateOffer,
} from "../../../redux/offersSlice"; // Adjust paths as needed
import ConfirmPopup from "../../../components/ConfirmPopup";
import { Link } from "react-router-dom";
const Offers = () => {
  const dispatch = useDispatch();
  const { offers, loading, error } = useSelector((state) => state.offers);
  const [open, setOpen] = useState(false);
  const [offerId, setOfferId] = useState(null);
  useEffect(() => {
    dispatch(getOffers());
  }, [dispatch]);

  const handleDelete = (offerId) => {
    // Dispatch delete action
    setOpen(true);
    setOfferId(offerId);
  };

  const handleUpdate = (offerId) => {
    // Navigate or open a modal for updating the offer
    console.log(`Update offer with ID: ${offerId}`);
  };



  if (loading) {
    return (
      <p className="text-center text-lg font-semibold">Loading offers...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 font-semibold">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Manage Offers</h2>
        <Link
          to="/dashboard/offers/create"
          className="py-2 px-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          Create Offer
        </Link>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <li
            key={offer.offer_id}
            className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
          >
            <img
              src={`/images/offers/${offer.image_url}`}
              alt={offer.title}
              className="w-full h-48 object-cover"
              onError={(e) => {
                e.target.src = '/default_offer.jpg';
                e.target.alt = 'Default Offer Image'; // Update the alt text for accessibility
              }}
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800 truncate">
                {offer.title}
              </h3>
              <p className="text-gray-600 mt-2">{offer.description}</p>
              <div className="flex justify-between items-center mt-4">
                <span className="text-gray-500 line-through text-lg">
                  ${offer.regular_price}
                </span>
                <span className="text-green-600 text-xl font-bold">
                  ${offer.offer_price}
                </span>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 flex space-x-4">
              <button
                onClick={() => handleUpdate(offer.offer_id)}
                className="flex-1 py-2 px-4 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-700 transition"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(offer.offer_id)}
                className="flex-1 py-2 px-4 bg-red-600 text-white text-sm font-medium rounded-lg shadow hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
        <ConfirmPopup
          isOpen={open}
          onClose={() => setOpen(false)}
          actionFunction={deleteOffer}
          message="Are you sure you want to delete this event?"
          id={offerId}
        />
      </ul>
    </div>
  );
};

export default Offers;
