const express = require("express");
const isAuthorized = require("../middleware/isAuthorized");
const { getCompanies, gestSingleCompany, registerCompany, updateCompany, deleteCompany } = require("../controllers/companyController");
const { companyLogo } = require("../middleware/multer");

const router = express.Router();


router.post("/register", isAuthorized, registerCompany)
router.get("/", isAuthorized, getCompanies)
router.patch("/update/:id", isAuthorized, companyLogo,updateCompany)
router.get("/:id", isAuthorized,gestSingleCompany)
router.delete("/delete/:id", isAuthorized,deleteCompany)



module.exports = router;