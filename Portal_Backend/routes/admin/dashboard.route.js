import express from "express";
import { dashboardStats } from '../../controller/admin/dashboard.controller.js'

const router = express.Router();

router.get("/dashboard/stats", dashboardStats);

export default router;