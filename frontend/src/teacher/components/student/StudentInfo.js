import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchStudentAttendance } from '../../../redux/attandanceSlice';

export default function StudentInfo({ open, setOpen, studentData }) {
  const dispatch = useDispatch();
  const studentAttendance = useSelector((state) => state.attendances.attendances);

  useEffect(() => {
    if (studentData?.student_id) {
      dispatch(fetchStudentAttendance(studentData.student_id));
    }
  }, [dispatch, studentData?.student_id]);

  // Total absences count
  const totalAbsences = studentAttendance?.length;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-10">
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
            <div className="p-5">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold leading-6 text-gray-900">
                  Student Information
                </DialogTitle>

                {/* Personal Information */}
                <div className="mt-2 space-y-4">
                  <div className="text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <img
                          src={studentData?.profile_photo}
                          alt={`${studentData?.first_name} ${studentData?.last_name}`}
                          className="h-24 w-24 rounded-md border border-gray-300"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-700">Personal Information</p>
                        <p><span className="font-semibold">Name:</span> {studentData?.first_name} {studentData?.middle_name} {studentData?.last_name}</p>
                        <p><span className="font-semibold">Gender:</span> {studentData?.gender}</p>
                        <p><span className="font-semibold">Date of Birth:</span> {new Date(studentData?.date_of_birth).toLocaleDateString()}</p>
                        <p><span className="font-semibold">Blood Group:</span> {studentData?.blood_group}</p>
                        <p><span className="font-semibold">Phone:</span> {studentData?.phone}</p>
                      </div>
                    </div>

                    <hr className="my-2" />

                    {/* Address Information */}
                    <p className="font-semibold text-gray-700">Address</p>
                    <p><span className="font-semibold">Street Address:</span> {studentData?.street_address}</p>
                    <p><span className="font-semibold">City:</span> {studentData?.city}</p>
                    <p><span className="font-semibold">Pin Code:</span> {studentData?.pin_code}</p>

                    <hr className="my-2" />

                    {/* Parent Information */}
                    <p className="font-semibold text-gray-700">Parent Information</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <img
                          src={studentData?.parent?.profile_photo}
                          alt={`${studentData?.parent?.first_name} ${studentData?.parent?.last_name}`}
                          className="h-16 w-16 rounded-md border border-gray-300"
                        />
                      </div>
                      <div>
                        <p><span className="font-semibold">Parent Name:</span> {studentData?.parent?.first_name} {studentData?.parent?.middle_name} {studentData?.parent?.last_name}</p>
                        <p><span className="font-semibold">Phone:</span> {studentData?.parent?.phone}</p>
                        <p><span className="font-semibold">Profession:</span> {studentData?.parent?.profession}</p>
                      </div>
                    </div>

                    <hr className="my-2" />

                    {/* Attendance Information */}
                    <p className="font-semibold text-gray-700">Attendance Details</p>
                    <p><span className="font-semibold">Total Absences:</span> {totalAbsences}</p>

                    <ul className="list-disc ml-5">
                      {studentAttendance?.filter((record) => record.status === 'absent').map((record) => (
                        <li key={record.attendance_id}>
                          <span className="font-semibold">Date:</span> {new Date(record.attendance_date).toLocaleDateString()}
                          {record.reason && <> - <span className="font-semibold">Reason:</span> {record.reason}</>}
                        </li>
                      ))}
                    </ul>

                    <hr className="my-2" />

                    {/* Class & Section Information */}
                    <p className="font-semibold text-gray-700">Class & Section Details</p>
                    <p><span className="font-semibold">Class:</span> {studentData?.class?.class_name}</p>
                    <p><span className="font-semibold">Section:</span> {studentData?.section?.section_name}</p>

                    <hr className="my-2" />

                    {/* Additional Information */}
                    <p className="font-semibold text-gray-700">Additional Details</p>
                    <p><span className="font-semibold">Created At:</span> {new Date(studentData?.created_at).toLocaleDateString()}</p>
                    <p><span className="font-semibold">Updated At:</span> {new Date(studentData?.updated_at).toLocaleDateString()}</p>
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
