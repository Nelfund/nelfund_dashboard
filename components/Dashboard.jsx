"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchRecords } from "@/lib/airtable"; // Adjust the path accordingly

const Dashboard = () => {
  const [records, setRecords] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [filter, setFilter] = useState({ name: "", location: "" });

  useEffect(() => {
    const getData = async () => {
      const data = await fetchRecords();
      setRecords(data);
      aggregateLocations(data);
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
      Abia: { lat: 5.4527, lng: 7.5248 },
      Abuja: { lat: 9.0765, lng: 7.3986 },
      Adamawa: { lat: 9.3265, lng: 12.3984 },
      AkwaIbom: { lat: 5.0371, lng: 7.9128 },
      Anambra: { lat: 6.2106, lng: 7.0671 },
      Bauchi: { lat: 10.3103, lng: 9.8439 },
      Bayelsa: { lat: 4.7719, lng: 6.0846 },
      Benue: { lat: 7.1904, lng: 8.1317 },
      Borno: { lat: 11.8333, lng: 13.15 },
      CrossRiver: { lat: 4.9589, lng: 8.3269 },
      Delta: { lat: 5.7047, lng: 5.9336 },
      Ebonyi: { lat: 6.2649, lng: 8.0137 },
      Edo: { lat: 6.5244, lng: 5.8987 },
      Ekiti: { lat: 7.6218, lng: 5.3147 },
      Enugu: { lat: 6.5244, lng: 7.517 },
      Gombe: { lat: 10.2897, lng: 11.1673 },
      Imo: { lat: 5.572, lng: 7.0588 },
      Jigawa: { lat: 12.1475, lng: 9.757 },
      Kaduna: { lat: 10.5105, lng: 7.4165 },
      Kano: { lat: 12.0022, lng: 8.5919 },
      Katsina: { lat: 12.9908, lng: 7.6018 },
      Kebbi: { lat: 12.4504, lng: 4.1977 },
      Kogi: { lat: 7.7337, lng: 6.6912 },
      Kwara: { lat: 8.4966, lng: 4.5421 },
      Lagos: { lat: 6.5244, lng: 3.3792 },
      Nasarawa: { lat: 8.534, lng: 8.5227 },
      Niger: { lat: 9.9306, lng: 6.5531 },
      Ogun: { lat: 7.1604, lng: 3.5974 },
      Ondo: { lat: 7.1, lng: 4.8422 },
      Osun: { lat: 7.5629, lng: 4.52 },
      Oyo: { lat: 7.3775, lng: 3.947 },
      Plateau: { lat: 9.2182, lng: 9.517 },
      Rivers: { lat: 4.8156, lng: 7.0498 },
      Sokoto: { lat: 13.0627, lng: 5.2339 },
      Taraba: { lat: 8.8937, lng: 11.3602 },
      Yobe: { lat: 12.0, lng: 11.5 },
      Zamfara: { lat: 12.1227, lng: 6.2235 },
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
      )
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
    <div className="p-6 bg-gray-50 min-h-screen flex flex-col">
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
      <div className="flex-grow">
        <MapContainer
          center={[9.082, 8.6753]}
          zoom={6}
          minZoom={5}
          maxZoom={8}
          style={{ height: "500px", width: "100%" }}
          className="shadow-lg rounded-lg overflow-hidden"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locationData.map((location) => (
            <Circle
              key={location.location}
              center={[location.lat, location.lng]}
              radius={location.amount * 10000} // Adjust the radius multiplier as needed
              color={getColor(location.amount)}
              fillOpacity={0.5}
            >
              <Popup>
                {location.location}: {location.amount} candidates
              </Popup>
            </Circle>
          ))}
        </MapContainer>
      </div>

      {/* Legend */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Legend</h3>
        <ul className="flex flex-col space-y-1">
          <li className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-2"
              style={{ backgroundColor: "green" }}
            ></span>
            1 - 100 candidates
          </li>
          <li className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-2"
              style={{ backgroundColor: "blue" }}
            ></span>
            101 - 500 candidates
          </li>
          <li className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-2"
              style={{ backgroundColor: "orange" }}
            ></span>
            501 - 1000 candidates
          </li>
          <li className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-2"
              style={{ backgroundColor: "red" }}
            ></span>
            &gt; 1000 candidates
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
