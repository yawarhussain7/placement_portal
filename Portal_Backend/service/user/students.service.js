import User from "../../model/auth/authUser.model.js";
// Get all students
export const getAllStudents = async () => {
  return await User.find();
};

// Get student count
export const getStudentCountService = async () => {
  return await User.countDocuments();
};