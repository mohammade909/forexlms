import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEvents } from "../../../redux/eventSlice";

const EventsList
 = () => {
  const dispatch = useDispatch();
  const { events, loading } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Upcoming Events
      </h1>
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.event_id}
            className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
          >
            <div className="relative">
              <img
                src={event.image_url || "https://via.placeholder.com/400"}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 left-2 bg-indigo-600 text-white text-xs font-semibold py-1 px-3 rounded-full shadow-md">
                {new Date(event.start_date).toLocaleDateString()}
              </div>
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {event.description.length > 100
                  ? `${event.description.slice(0, 100)}...`
                  : event.description}
              </p>
              <div className="text-sm text-gray-500">
                <p>
                  <strong>Start:</strong>{" "}
                  {new Date(event.start_date).toLocaleString()}
                </p>
                <p>
                  <strong>End:</strong>{" "}
                  {new Date(event.end_date).toLocaleString()}
                </p>
                <p>
                  <strong>Location:</strong> {event.location}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsList
;
