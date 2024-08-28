"use client";

import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { fetchRecords } from "@/lib/airtable"; // Adjust the path accordingly
import { useEffect, useState } from "react";

import React from "react";

function Map() {
  const [locationData, setLocationData] = useState([]);
  const [records, setRecords] = useState([]);

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
    <>
      <div className=" flex grow px-10 py-16 ">
        <MapContainer
          center={[9.082, 8.6753]}
          zoom={6}
          minZoom={5}
          maxZoom={7}
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
      </div>
      {/* Legend */}
      <div className=" px-10 pb-10">
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
              style={{ backgroundColor: "orange" }}
            ></span>
            101 - 500 candidates
          </li>
          <li className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-2"
              style={{ backgroundColor: "red" }}
            ></span>
            501 - 1000 candidates
          </li>
          <li className="flex items-center">
            <span
              className="inline-block w-4 h-4 mr-2"
              style={{ backgroundColor: "gray" }}
            ></span>
            &gt; 1000 candidates
          </li>
        </ul>
      </div>
    </>
  );
}

export default Map;
