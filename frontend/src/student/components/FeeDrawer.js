import { useState, useEffect } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import { BASEURL } from '../../baseurl';
const validationSchema = Yup.object({
  feeAmount: Yup.number().required('Fee amount is required').min(0, 'Fee amount must be positive'),
  dueDate: Yup.date().required('Due date is required'),
  status: Yup.string().required('Status is required'),
});

const statusOptions = [
  { value: '', label: 'Select a status' },
  { value: 'paid', label: 'Paid' },
  { value: 'due', label: 'Due' },
  { value: 'overdue', label: 'Overdue' },
];

export default function FeeDrawer({ open, setOpen, feeData }) {

  const initialValues = {
    feeAmount: '',
    dueDate: '',
    status: '',
  };

  const handleSubmit = async (values) => {
    const formattedDueDate = format(new Date(values.dueDate), 'yyyy-MM-dd');
    const formattedPaymentDate = format(new Date(), 'yyyy-MM-dd'); // Current date in 'YYYY-MM-DD' format

    const newFee = {
      child_id: feeData[feeData.length - 1]?.child_id || null, // Use null if feeData is empty
      course_id: feeData[feeData.length - 1]?.course_id || null, // Use null if feeData is empty
      fee_amount: feeData[feeData.length - 1]?.fee_amount || '0.00', // Default to '0.00' if feeData is empty
      due: formattedDueDate,
      paid: values.feeAmount,
      status: values.status,
      payment_date: formattedPaymentDate,
      payment_method: feeData[feeData.length - 1]?.payment_method || '', // Use empty string if feeData is empty
    };

    try {
      await axios.post(`${BASEURL}/api/v1/fee/add`, newFee);
      toast.success('Fee entry created successfully', { autoClose: 3000 });
      setOpen(false);
    } catch (error) {
      console.error('Error creating fee entry:', error);
      toast.error('Error creating fee entry');
    }
  };

  console.log(feeData);

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity duration-500 ease-in-out data-[closed]:opacity-0"
      />
      <ToastContainer />
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-[closed]:translate-x-full sm:duration-700"
            >
              <TransitionChild>
                <div className="absolute left-0 top-0 -ml-8 flex pr-2 pt-4 duration-500 ease-in-out data-[closed]:opacity-0 sm:-ml-10 sm:pr-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="relative rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                  >
                    <span className="absolute -inset-2.5" />
                    <span className="sr-only">Close panel</span>
                    <XMarkIcon aria-hidden="true" className="h-6 w-6" />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                <div className="px-4 sm:px-6">
                  <DialogTitle className="text-base font-semibold leading-6 text-gray-900">Fee Details</DialogTitle>
                </div>
                <div className="relative mt-6 flex-1 px-4 sm:px-6">
                  <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ isSubmitting }) => (
                      <Form>
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="fee_amount" className="block text-sm font-medium text-gray-700">
                              Fee Amount
                            </label>
                            <Field
                              type="number"
                              name="fee_amount"
                              id="fee_amount"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage name="fee_amount" component="div" className="text-red-600 text-sm mt-1" />
                          </div>

                          <div>
                            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                              Due Date
                            </label>
                            <Field
                              type="date"
                              name="dueDate"
                              id="dueDate"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                            <ErrorMessage name="dueDate" component="div" className="text-red-600 text-sm mt-1" />
                          </div>

                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <Field
                              as="select"
                              name="status"
                              id="status"
                              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            >
                              {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </Field>
                            <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
                          </div>

                          <div className="flex gap-4 mt-4">
                            <button
                              type="submit"
                              disabled={isSubmitting}
                              className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setOpen(false)}
                              className="inline-flex justify-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
}
