"use client";
import { createElement, useCallback, useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import React from "react";
import apiFetch from "../../../utils/axios";
import { toast } from "react-toastify";

const Students = () => {
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [studentsData, setStudentsData] = useState<any[]>([]);

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

  useEffect(() => {
    getStudents();
  }, [getStudents]);

  const toggleExpand = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-secondary">Students Credentials</h1>

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
              <tr>
                <td colSpan={7} className="text-center p-4">
                  Loading...
                </td>
              </tr>
            ) : (
              studentsData?.map((student) => (
                <>
                  {/* Main Row */}
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 relative p-3">
                      <button
                        onClick={() => toggleExpand(student.id)}
                        className="flex items-center"
                      >
                        {expandedRow === student.id ? (
                          <FaChevronUp className="mr-2" />
                        ) : (
                          <FaChevronDown className="mr-2" />
                        )}

                        {student.name}
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
                    <td className="border border-gray-300 p-2">
                      {student.status}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <div className="flex justify-center gap-2">
                        {student.status === "pending" ||
                        student.status === "rejected" ? (
                          <button
                            onClick={() => approveCredentials(student._id)}
                            className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition w-[80px]"
                          >
                            Approve
                          </button>
                        ) : null}
                        {student.status === "pending" ||
                        student.status === "approved" ? (
                          <button
                            onClick={() => rejectCredentials(student._id)}
                            className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition w-[80px]"
                          >
                            Reject
                          </button>
                        ) : null}
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
                </>
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
