import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCertificates, resetState } from "../../../redux/certificateSlice"; // Import the fetchCertificates action
import Button from "./Button"; // A reusable Button component
import { useState } from "react";
import Modal from "./Modal"; // Assume a Modal component is available
import IssueCertificateForm from "./IssueCertificateForm"; // IssueCertificateForm component for Formik form
import SuccessModal from '../SuccessModal'
import ErrorModal from '../ErrorModal'
const CertificatesList = () => {
  const dispatch = useDispatch();
  const { certificates, loading, error, message } = useSelector(
    (state) => state.certificates
  );
  
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (message) {
      setOpen(true);
    }
    if (error) {
      setOpenError(true);
    }
  }, [message, error]);

  useEffect(() => {
    dispatch(fetchCertificates()); // Fetch certificates when the component mounts
  }, [dispatch]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching certificates: {error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Issued Certificates</h1>
        <Button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white p-2 rounded"
        >
          Issue Certificate
        </Button>
      </div>
      <SuccessModal open={open} setOpen={setOpen} message={message} reset={resetState} />
      <ErrorModal open={openError} setOpen={setOpenError} error={error} reset={resetState} />

      {/* List of certificates */}
      <div className="overflow-x-auto shadow border">
        <table className="min-w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Certificate ID
              </th>
              <th scope="col" className="px-6 py-3">
                Recipient
              </th>
              <th scope="col" className="px-6 py-3">
                Course Name
              </th>
              <th scope="col" className="px-6 py-3">
                Issue Date
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr
                key={certificate.certificate_id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
              >
                <td className="px-6 py-4">{certificate.certificate_code}</td>
                <td className="px-6 py-4">
                  {certificate.student_first_name}{" "}
                  {certificate.student_last_name}
                </td>
                <td className="px-6 py-4">{certificate.course_name}</td>
                <td className="px-6 py-4">
                  {new Date(certificate.issued_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {/* Add actions such as view or download */}
                  <a
                    href={certificate.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal to issue new certificate */}
      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <IssueCertificateForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
};

export default CertificatesList;
