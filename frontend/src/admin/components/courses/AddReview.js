"use client";
import { useState, useEffect } from "react";
import { useFormik } from "formik";
import {
  FaceSmileIcon as FaceSmileIconOutline,
  PaperClipIcon,
} from "@heroicons/react/24/outline";
import { Label, Listbox } from "@headlessui/react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

import Spinner from "../../../components/Spinner";
import ErrorModal from "../../../admin/components/ErrorModal";
import SuccessModal from "../../../admin/components/SuccessModal";

import { resetState, addReviews } from "../../../redux/reviewSlice";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={classNames(
            rating >= star ? "text-yellow-400" : "text-gray-300",
            "h-6 w-6"
          )}
        >
          {rating >= star ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
              />
            </svg>
          )}
        </button>
      ))}
    </div>
  );
};

export default function AddReview({ reload }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [selected, setSelected] = useState();
  const [rating, setRating] = useState(0);
  const { id } = useParams();

  const { loading, error, message } = useSelector((state) => state.reviews);
  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);
  const formik = useFormik({
    initialValues: {
      comment: "",
      rating: rating,
      user_id: 1,
    },
    onSubmit: (values) => {
      dispatch(addReviews({ course_id: id, values }));
    },
  });

  return (
    <div className="border shadow p-5">
      <div className="flex gap-10">
        <p className="text-sm text-gray-600 tracking-wider">
          Give us ratings :
        </p>
        <StarRating
          rating={rating}
          setRating={(value) => {
            setRating(value);
            formik.setFieldValue("rating", value);
          }}
        />
      </div>
      <SuccessModal open={open} setOpen={setOpen} message={message} reset={resetState} />
      <ErrorModal open={openError} setOpen={setOpenError} error={error} reset={resetState} />
      <div className="flex items-start space-x-4  py-10">
        <div className="flex-shrink-0">
          <img
            alt=""
            src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            className="inline-block h-10 w-10 rounded-full"
          />
        </div>
        <div className="min-w-0 flex-1">
          <form onSubmit={formik.handleSubmit}>
            <div className="border-b border-gray-200 focus-within:border-indigo-600">
              <label htmlFor="comment" className="sr-only">
                Add your comment
              </label>
              <textarea
                id="comment"
                name="comment"
                rows={3}
                placeholder="Add your comment..."
                className="block p-5 w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-0 sm:text-sm sm:leading-6"
                onChange={formik.handleChange}
                value={formik.values.comment}
              />
            </div>
            <div className="flex justify-between pt-2">
              <div className="flex items-center space-x-5">
                <div className="flow-root">
                  <button
                    type="button"
                    className="-m-2 inline-flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                  >
                    <PaperClipIcon aria-hidden="true" className="h-6 w-6" />
                    <span className="sr-only">Attach a file</span>
                  </button>
                </div>
                <div className="flow-root">
                  <Listbox
                    value={selected}
                    onChange={(value) => {
                      setSelected(value);
                      formik.setFieldValue("mood", value.value);
                    }}
                  >
                    <Label className="sr-only">Your mood</Label>
                  </Listbox>
                </div>
              </div>

              <div className="flex-shrink-0">
                <button
                  type="submit"
                  disabled={loading}
                  className={`inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-opacity duration-300 ${
                    loading ? "opacity-50" : "opacity-100"
                  }`}
                >
                  {loading ? <Spinner /> : "Post"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
