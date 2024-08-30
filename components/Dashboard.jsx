"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchRecords } from "@/lib/airtable"; // Adjust the path accordingly

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [filter, setFilter] = useState({
    name: "",
    location: "",
    email: "",
    number: "",
    institution: "",
    others: "",
    course: "",
    level: "",
    matric: "",
    jamb: "",
  });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchRecords();
      setRecords(data);
      aggregateLocations(data); // Call the aggregateLocations function
    };
    getData();
  }, []);

  const aggregateLocations = (data) => {
    const locationCounts = {};

    data.forEach((record) => {
      const location = record.location;

      if (location) {
        if (locationCounts[location]) {
          locationCounts[location]++;
        } else {
          locationCounts[location] = 1;
        }
      }
    });

    const aggregatedData = Object.keys(locationCounts).map((location) => {
      return {
        location,
        amount: locationCounts[location],
        ...getCoordinates(location), // Map location to coordinates
      };
    });

    setLocationData(aggregatedData);
  };

  const getCoordinates = (location) => {
    // Mapping location names to their corresponding lat/lng coordinates
    const coordinatesMap = {
      //... existing mappings
    };

    return coordinatesMap[location] || { lat: 0, lng: 0 };
  };

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
      ) &&
      (record.email?.toLowerCase() || "").includes(
        filter.email.toLowerCase()
      ) &&
      (record.number?.toLowerCase() || "").includes(
        filter.number.toLowerCase()
      ) &&
      (record.institution?.toLowerCase() || "").includes(
        filter.institution.toLowerCase()
      ) &&
      (record.others?.toLowerCase() || "").includes(
        filter.others.toLowerCase()
      ) &&
      (record.course?.toLowerCase() || "").includes(
        filter.course.toLowerCase()
      ) &&
      (record.level?.toLowerCase() || "").includes(
        filter.level.toLowerCase()
      ) &&
      (record.matric?.toLowerCase() || "").includes(
        filter.matric.toLowerCase()
      ) &&
      (record.jamb?.toLowerCase() || "").includes(filter.jamb.toLowerCase())
  );

  const getColor = (amount) => {
    switch (true) {
      case amount >= 1 && amount <= 100:
        return "green";
      case amount > 100 && amount <= 500:
        return "blue";
      case amount > 500 && amount <= 1000:
        return "orange";
      default:
        return "red"; // For amounts outside the specified ranges
    }
  };

  return (
    <div className="p-6 bg-gray-50 m flex flex-col">
      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          name="name"
          placeholder="Filter by name"
          value={filter.name}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="location"
          placeholder="Filter by state"
          value={filter.location}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="email"
          placeholder="Filter by email"
          value={filter.email}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="number"
          placeholder="Filter by number"
          value={filter.number}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="institution"
          placeholder="Filter by institution"
          value={filter.institution}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="others"
          placeholder="Filter by others"
          value={filter.others}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="course"
          placeholder="Filter by course"
          value={filter.course}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="level"
          placeholder="Filter by level"
          value={filter.level}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="matric"
          placeholder="Filter by matric"
          value={filter.matric}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
        <input
          type="text"
          name="jamb"
          placeholder="Filter by jamb"
          value={filter.jamb}
          onChange={handleFilter}
          className="border p-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg">
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

      {/* Map */}

      {/* <div className="flex-grow">
        <MapContainer
          center={[9.082, 8.6753]}
          zoom={6}
          minZoom={5}
          maxZoom={6}
          style={{ height: "500px", width: "100%" }}
          className="shadow-lg rounded-lg overflow-hidden"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locationData.map((location, index) => (
            <Circle
              key={index}
              center={[location.lat, location.lng]}
              color={getColor(location.amount)}
              fillColor={getColor(location.amount)}
              fillOpacity={0.7}
              radius={10000}
            >
              <Popup>
                <strong>{location.location}</strong>
                <br />
                Number of Candidates: {location.amount}
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div> */}
    </div>
  );
};

export default Dashboard;
