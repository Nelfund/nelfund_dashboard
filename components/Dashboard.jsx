"use client";

import { useEffect, useState } from "react";
import { fetchRecords } from "@/lib/airtable"; // Adjust the path accordingly

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [filter, setFilter] = useState({ name: "", location: "" });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchRecords();
      setRecords(data);
    };
    getData();
  }, []);

  const handleFilter = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({
      ...prevFilter,
      [name]: value,
    }));
  };

  const filteredRecords = records.filter(
    (record) =>
      (record.name?.toLowerCase() || "").includes(filter.name.toLowerCase()) &&
      (record.location?.toLowerCase() || "").includes(
        filter.location.toLowerCase()
      )
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={filter.name}
          onChange={handleFilter}
          className="border p-3 rounded w-full mb-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by state"
          value={filter.location}
          onChange={handleFilter}
          className="border p-3 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-lg">
        <thead>
          <tr className="bg-blue-100 border-b">
            {[
              "Name",
              "Email",
              "State",
              "Number",
              "Institution",
              "Others",
              "Course",
              "Level",
              "Matric",
              "Jamb",
            ].map((header) => (
              <th
                key={header}
                className="text-left p-3 text-gray-700 font-semibold"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record) => (
            <tr
              key={record.id}
              className="border-b hover:bg-blue-50 transition duration-300"
            >
              <td className="p-3 text-gray-600">{record.name}</td>
              <td className="p-3 text-gray-600">{record.email}</td>
              <td className="p-3 text-gray-600">{record.location}</td>
              <td className="p-3 text-gray-600">{record.number}</td>
              <td className="p-3 text-gray-600">{record.institution}</td>
              <td className="p-3 text-gray-600">{record.others}</td>
              <td className="p-3 text-gray-600">{record.course}</td>
              <td className="p-3 text-gray-600">{record.level}</td>
              <td className="p-3 text-gray-600">{record.matric}</td>
              <td className="p-3 text-gray-600">{record.jamb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
