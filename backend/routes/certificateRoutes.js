const express = require("express");
const router = express.Router();
const certificatesController = require("../controllers/certificatesController");

router.post("/", certificatesController.createCertificate); // Upload and create a certificate
router.get("/", certificatesController.getCertificates); // Get all certificates
router.put("/:certificate_id/revoke", certificatesController.revokeCertificate); // Revoke a certificate
router.delete("/:certificate_id", certificatesController.deleteCertificate); // Delete a certificate
router.get("/user/:user_id", certificatesController.getCertificatesByUserId);

module.exports = router;
