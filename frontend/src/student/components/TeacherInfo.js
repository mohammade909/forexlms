'use client'

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function TeacherInfo({open, setOpen, teacherData}) {

  // Example teacher data to be displayed in the dialog
 

  return (
    <Dialog open={open} onClose={setOpen} className="relative z-10">
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
              {/* <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon aria-hidden="true" className="h-6 w-6 text-red-600" />
              </div> */}
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Teacher Information
                </DialogTitle>
                <div className="mt-2 space-y-4">
                  {/* Display teacher details */}
                  <div className="text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <img
                          src={teacherData?.profile_photo}
                          alt={`${teacherData?.first_name} ${teacherData?.last_name}`}
                          className="h-24 w-24 rounded-md border border-gray-300"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Personal Information</p>
                        <p><span className="font-semibold">Name:</span> {teacherData?.first_name} {teacherData?.middle_name} {teacherData?.last_name}</p>
                        <p><span className="font-semibold">Gender:</span> {teacherData?.gender}</p>
                        <p><span className="font-semibold">Date of Birth:</span> {new Date(teacherData?.date_of_birth).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Blood Group:</span> {teacherData?.blood_group}</p>
                        <p><span className="font-semibold">Phone:</span> {teacherData?.phone}</p>
                      </div>
                    </div>

                    <hr className="my-2" />

                    <p className="font-semibold text-gray-700">Address & Contact</p>
                    <p><span className="font-semibold">Address:</span> {teacherData?.address}</p>

                    <hr className="my-2" />

                    <p className="font-semibold text-gray-700">Employment Details</p>
                    <p><span className="font-semibold">Employee Code:</span> {teacherData?.employee_code}</p>
                    <p><span className="font-semibold">Position:</span> {teacherData?.current_position}</p>
                    <p><span className="font-semibold">Qualification:</span> {teacherData?.qualification}</p>
                    <p><span className="font-semibold">Hire Date:</span> {new Date(teacherData?.hire_date).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Status:</span> {teacherData?.status}</p>

                    <hr className="my-2" />

                    <p className="font-semibold text-gray-700">Class & Section Details</p>
                    <p><span className="font-semibold">Class:</span> {teacherData?.class_name}</p>
                    <p><span className="font-semibold">Section:</span> {teacherData?.section_name}</p>

                    <hr className="my-2" />

                    <p className="font-semibold text-gray-700">Subject & Book Details</p>
                    <p><span className="font-semibold">Subject Name:</span> {teacherData?.subject_name}</p>
                    <p><span className="font-semibold">Subject Code:</span> {teacherData?.subject_code}</p>
                    <p><span className="font-semibold">Book Name:</span> {teacherData?.book_name}</p>
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
