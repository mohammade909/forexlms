"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function TeacherInfo({ open, setOpen, teacherData }) {
  return (
    <Dialog open={open} onClose={setOpen} className="relative z-50">
    <DialogBackdrop className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:w-full sm:max-w-2xl sm:p-6">
          <div className="absolute right-0 top-0 hidden pr-4 pt-4 sm:block">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <span className="sr-only">Close</span>
              <XMarkIcon aria-hidden="true" className="h-6 w-6" />
            </button>
          </div>
          <div className="sm:flex sm:items-start">
            {/* Teacher Info */}
            <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
              <DialogTitle
                as="h3"
                className="text-base font-semibold leading-6 text-gray-900"
              >
                Teacher Information
              </DialogTitle>
              <div className="mt-2 space-y-4">
                <div className="text-xs">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      {/* Show Profile Photo or Default Placeholder */}
                      <img
                        src={
                          teacherData?.profile_photo || "/default-profile.jpg"
                        }
                        alt={`${teacherData?.first_name} ${teacherData?.last_name}`}
                        className="h-24 w-24 rounded-md border border-gray-300"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-700">
                        Personal Information
                      </p>
                      <p>
                        <span className="font-semibold">Name:</span>{" "}
                        {teacherData?.first_name} {teacherData?.middle_name}{" "}
                        {teacherData?.last_name}
                      </p>
                      <p>
                        <span className="font-semibold">Gender:</span>{" "}
                        {teacherData?.gender || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Date of Birth:</span>{" "}
                        {teacherData?.date_of_birth
                          ? new Date(
                              teacherData?.date_of_birth
                            ).toLocaleDateString()
                          : "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Blood Group:</span>{" "}
                        {teacherData?.blood_group || "N/A"}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {teacherData?.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <hr className="my-2" />

                  <p className="font-semibold text-gray-700">
                    Address & Contact
                  </p>
                  <p>
                    <span className="font-semibold">Address:</span>{" "}
                    {teacherData?.address || "N/A"}
                  </p>

                  <hr className="my-2" />

                  <p className="font-semibold text-gray-700">
                    Employment Details
                  </p>
                  <p>
                    <span className="font-semibold">Qualification:</span>{" "}
                    {teacherData?.qualification || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Hire Date:</span>{" "}
                    {teacherData?.hire_date
                      ? new Date(
                          teacherData?.hire_date
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Status:</span>{" "}
                    {teacherData?.status || "N/A"}
                  </p>

                  <hr className="my-2" />

                  <p className="font-semibold text-gray-700">Class Details</p>
                  {teacherData?.classes?.length > 0 ? (
                    teacherData?.classes.map((cls) => (
                      <div key={cls?.class_id} className="space-y-2">
                        <p>
                          <span className="font-semibold">Class Name:</span>{" "}
                          {cls?.class_name || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Class Starting On:
                          </span>{" "}
                          {cls?.class_starting_on
                            ? new Date(
                                cls?.class_starting_on
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Class Ending On:
                          </span>{" "}
                          {cls?.class_ending_on
                            ? new Date(
                                cls?.class_ending_on
                              ).toLocaleDateString()
                            : "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Course Name:</span>{" "}
                          {cls?.course?.course_name || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">
                            Course Description:
                          </span>{" "}
                          {cls?.course?.course_description || "N/A"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p>No Classes Assigned</p>
                  )}

                  <hr className="my-2" />

                  <p className="font-semibold text-gray-700">User Details</p>
                  <p>
                    <span className="font-semibold">Username:</span>{" "}
                    {teacherData?.user?.username || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    {teacherData?.user?.email || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">User Type:</span>{" "}
                    {teacherData?.user?.user_type || "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Account Created On:</span>{" "}
                    {teacherData?.user?.user_created_at
                      ? new Date(
                          teacherData?.user?.user_created_at
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                  <p>
                    <span className="font-semibold">Account Updated On:</span>{" "}
                    {teacherData?.user?.user_updated_at
                      ? new Date(
                          teacherData?.user?.user_updated_at
                        ).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
  );
}
