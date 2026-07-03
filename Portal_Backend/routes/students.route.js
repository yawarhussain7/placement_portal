import express from "express";
import {
  getStudents,
  getStudentCount,
} from '../controller/userController/students.controller.js'

const router = express.Router();

router.get("/students", getStudents);

// Get student count
router.get("/count", getStudentCount);

export default router;