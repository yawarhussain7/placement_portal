import { getStudentCountService } from "../user/students.service.js";

export const getStudentCount = async () => {
  const count = await getStudentCountService();
  return { totalStudents: count };
};
