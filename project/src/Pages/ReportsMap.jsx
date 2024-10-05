import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { database } from "../firebase";
import { ref, onValue, off } from 'firebase/database';
import markerIconPng from "leaflet/dist/images/marker-icon.png"; // Default Leaflet marker icon
import backgroundImage from '../assets/bgofficials.png'; // Replace with your actual path

const ReportsMap = () => {
    const [reports, setReports] = useState([]);
    const mapCenter = [10.3059, 123.8910]; // Sambag 2 Urgellio latitude and longitude

    useEffect(() => {
        const fetchReports = () => {
            const reportsRef = ref(database, 'led/reports');

            try {
                onValue(reportsRef, (snapshot) => {
                    const fetchedData = snapshot.val();
                    const reportsArray = Object.entries(fetchedData || {}).map(([key, value]) => ({
                        key,
                        ...value,
                        latitude: parseFloat(value.location?.split(",")[0].split(":")[1].trim()),
                        longitude: parseFloat(value.location?.split(",")[1].split(":")[1].trim()),
                    }));
                    setReports(reportsArray);
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            return () => {
                off(reportsRef);
            };
        };

        fetchReports();
    }, []);

    return (
        <div id="events" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', padding: '2rem' }}>
            <div className="text-center text-5xl font-bold text-white mb-10">
                PREVIOUS ALERT
            </div>
            <div className="flex justify-center">
                <div className="w-full max-w-5xl rounded-lg overflow-hidden shadow-lg">
                    <MapContainer
                        center={mapCenter}
                        zoom={16}
                        style={{ height: '500px', width: '100%' }}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        {reports.map((report) => (
                            report.latitude && report.longitude && (
                                <Marker
                                    key={report.key}
                                    position={[report.latitude, report.longitude]}
                                    icon={L.icon({
                                        iconUrl: markerIconPng,
                                        iconSize: [25, 41],
                                        iconAnchor: [12, 41],
                                    })}
                                >
                                    <Popup>
                                        <div>
                                            <h3 className="font-bold">Report Type</h3>
                                            <p>{report.type}</p>
                                        </div>
                                    </Popup>
                                </Marker>
                            )
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
}

export default ReportsMap;
