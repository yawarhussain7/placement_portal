import {getAllStudents,getStudentCountService} from '../../service/user/students.service.js'

// GET all students
export const getStudents = async (req, res) => {
  try {
    const students = await getAllStudents();

    res.status(200).json({
      success: true,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// GET student count
export const getStudentCount = async (req, res) => {
  try {
    const count = await getStudentCountService();

    res.status(200).json({
      success: true,
      totalStudents: count,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
