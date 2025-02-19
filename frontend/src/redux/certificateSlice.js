import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASEURL } from "../baseurl"; // Adjust the path based on your project structure

// Fetch all certificates
export const fetchCertificates = createAsyncThunk(
  "certificates/fetchCertificates",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASEURL}/api/v1/certificates`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch certificates by user_id (find student first, then certificates)
export const fetchCertificatesByUserId = createAsyncThunk(
  "certificates/fetchCertificatesByUserId",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASEURL}/api/v1/certificates/user/${userId}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Create a new certificate
export const createCertificate = createAsyncThunk(
  "certificates/createCertificate",
  async (certificateData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("student_id", certificateData.student_id);
      formData.append("course_id", certificateData.course_id);
      formData.append("certificate_code", certificateData.certificate_code);
      formData.append("issued_date", certificateData.issued_date);
      formData.append("pdf_url", certificateData.pdf_url); // The file itself

      // Send the form data to the server using axios

      const response = await axios.post(
        `${BASEURL}/api/v1/certificates`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important to set the content type for file uploads
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Update an existing certificate
export const updateCertificate = createAsyncThunk(
  "certificates/updateCertificate",
  async ({ certificateId, certificateData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${BASEURL}/api/v1/certificates/${certificateId}`,
        certificateData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Delete a certificate
export const deleteCertificate = createAsyncThunk(
  "certificates/deleteCertificate",
  async (certificateId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASEURL}/api/v1/certificates/${certificateId}`);
      return certificateId; // Return the deleted certificate's ID
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Initial state for certificates
const initialState = {
  certificates: [],
  loading: false,
  error: null,
  success: false,
  message: null,
  totalCertificates: null,
  totalPages: null,
  currentPage: null,
};

const certificatesSlice = createSlice({
  name: "certificates",
  initialState,
  reducers: {
    resetState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all certificates
    builder
      .addCase(fetchCertificates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificates.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.certificates;
        state.totalCertificates = action.payload.totalCertificates;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchCertificates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch certificates by user_id
    builder
      .addCase(fetchCertificatesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCertificatesByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.certificates = action.payload.certificates;
      })
      .addCase(fetchCertificatesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create certificate
    builder
      .addCase(createCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Certificate created successfully!";
        // Add the new certificate
      })
      .addCase(createCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update certificate
    builder
      .addCase(updateCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Certificate updated successfully!";
        // Update the certificate in the state
      })
      .addCase(updateCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete certificate
    builder
      .addCase(deleteCertificate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCertificate.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.message = "Certificate deleted successfully!";
        state.certificates = state.certificates.filter(
          (certificate) => certificate.certificate_id !== action.payload // Assuming the response returns the ID of the deleted certificate
        );
      })
      .addCase(deleteCertificate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetState } = certificatesSlice.actions;
export default certificatesSlice.reducer;
