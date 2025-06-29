"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import apiFetch from "../../../utils/axios";
import { toast } from "react-toastify";
import { useAuthContext } from "../../../context/authContext";
import clsx from "clsx";
import TableRowSkeleton from "../../skeletons/TableRowSkeleton";
import useDotLoader from "../../../hooks/useDotLoader";
import { Link } from "react-router-dom";

const Students = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(
    null
  );
  const dots = useDotLoader(!!deletingStudentId);
  const { user } = useAuthContext();

  const getStudents = useCallback(() => {
    setIsLoading(true);
    apiFetch
      .get("/admin/students")
      .then((res) => {
        setStudentsData(res.data.students);
      })
      .catch(() => {
        toast("Something went wrong, please try again later", {
          type: "error",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const approveCredentials = useCallback((credentialsId: string) => {
    const newStatus = "approved";
    let originalStatus;
    setStudentsData((students) => {
      const student = students.find((student) => student._id === credentialsId);
      originalStatus = student.status;
      student.status = newStatus;
      return [...students];
    });
    apiFetch
      .post("/admin/credentials-status/approved", { credentialsId })
      .then(() => {
        toast("Student approved successfully", { type: "success" });
      })
      .catch(() => {
        toast("Error while approving student, please try again later", {
          type: "error",
        });
        setStudentsData((students) => {
          const student = students.find(
            (student) => student._id === credentialsId
          );
          student.status = originalStatus;
          return [...students];
        });
      });
  }, []);

  const rejectCredentials = useCallback((credentialsId: string) => {
    const newStatus = "rejected";
    let originalStatus;
    setStudentsData((students) => {
      const student = students.find((student) => student._id === credentialsId);
      originalStatus = student.status;
      student.status = newStatus;
      return [...students];
    });
    apiFetch
      .post("/admin/credentials-status/rejected", { credentialsId })
      .then(() => {
        toast("Student rejected successfully", { type: "success" });
      })
      .catch(() => {
        toast("Error while rejecting student, please try again later", {
          type: "error",
        });
        setStudentsData((students) => {
          const student = students.find(
            (student) => student._id === credentialsId
          );
          student.status = originalStatus;
          return [...students];
        });
      });
  }, []);

  const deleteStudent = (studentId: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    setDeletingStudentId(studentId);

    apiFetch
      .delete(`/admin/students/${studentId}`)
      .then(() => {
        toast("Student deleted successfully", { type: "success" });
        setStudentsData((students) =>
          students.filter((s) => s._id !== studentId)
        );
      })
      .catch(() => {
        toast("Error deleting student. Please try again later.", {
          type: "error",
        });
        getStudents();
      })
      .finally(() => {
        setDeletingStudentId(null);
      });
  };

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-secondary">
        Students Credentials
      </h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="border border-gray-300 p-2 text-left">Name</th>
              <th className="border border-gray-300 p-2 text-left">Email</th>
              <th className="border border-gray-300 p-2 text-left">
                Qualification
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Institution
              </th>
              <th className="border border-gray-300 p-2 text-left">
                Expertise
              </th>
              <th className="border border-gray-300 p-2 text-left">Status</th>
              <th className="border border-gray-300 p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <TableRowSkeleton columns={7} rows={5} />
            ) : (
              studentsData?.map((student) => (
                <React.Fragment key={student._id}>
                  {/* Main Row */}
                  <tr className="hover:bg-gray-50">
                    <td className="border border-gray-300 relative p-3 cursor-pointer hover:underline">
                      <button
                        onClick={() => toggleExpand(student.id)}
                        className="flex items-center"
                      >
                        {expandedRow === student.id ? (
                          <FaChevronUp className="mr-2" />
                        ) : (
                          <FaChevronDown className="mr-2" />
                        )}
                        <Link to={`/dashboard/users/${student.userId._id}`}>
                          {student.name}
                        </Link>
                      </button>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {student.userId?.email}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {student.credentials}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {student.institution}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {student.expertise}
                    </td>
                    <td
                      className={clsx("border border-gray-300 p-2", {
                        "bg-green-500 text-white":
                          student.status === "approved",
                        "bg-red-500 text-white": student.status === "rejected",
                        "bg-gray-500 text-white": student.status === "pending",
                      })}
                    >
                      {student.status.charAt(0).toUpperCase() +
                        student.status.slice(1)}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex justify-center gap-2">
                        {(student.status === "pending" ||
                          student.status === "rejected") && (
                          <button
                            onClick={() => approveCredentials(student._id)}
                            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition w-[80px]"
                          >
                            Approve
                          </button>
                        )}
                        {(student.status === "pending" ||
                          student.status === "approved") && (
                          <button
                            onClick={() => rejectCredentials(student._id)}
                            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition w-[80px]"
                          >
                            Reject
                          </button>
                        )}

                        {user.type === "admin" && (
                          <button
                            onClick={() => deleteStudent(student._id)}
                            disabled={deletingStudentId === student._id}
                            className={clsx(
                              "text-white py-1 rounded-lg px-3 font-medium transition-all duration-300",
                              deletingStudentId === student._id
                                ? "bg-gray-500 cursor-not-allowed"
                                : "bg-gray-700 hover:bg-gray-900"
                            )}
                            style={{ width: "100px" }}
                          >
                            {deletingStudentId === student._id
                              ? `Deleting${dots}`
                              : "Delete"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Row */}
                  {expandedRow === student.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="border border-gray-300 p-4">
                        <p>
                          <strong>Bio:</strong> {student.bio}
                        </p>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            )}
            {!isLoading && !studentsData.length ? (
              <tr>
                <td colSpan={7} className="p-4 text-center">
                  No Students data found
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
