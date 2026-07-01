"use client";

import { useState, useEffect } from "react";
import Loader from "../../components/Loader";
import {
    FaCloudSun,
    FaSeedling,
    FaTemperatureHigh,
    FaTint,
    FaWind,
    FaBookOpen,
} from "react-icons/fa";

const ResourcesPage = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fallback location (Nagpur, India - Center)
    const [location, setLocation] = useState({ lat: 21.1458, lon: 79.0882 });

    useEffect(() => {
        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lon: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Continue with default
                }
            );
        }
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
                );
                const data = await response.json();
                setWeather(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching weather:", error);
                setLoading(false);
            }
        };

        fetchWeather();
    }, [location]);

    const resources = [
        {
            id: 1,
            title: "Sustainable Soil Management",
            category: "Soil Health",
            content:
                "Learn how to maintain soil health using organic compost, crop rotation, and cover cropping. Healthy soil leads to better yields and disease resistance.",
            link: "#",
        },
        {
            id: 2,
            title: "Natural Pest Control",
            category: "Pest Management",
            content:
                "Discover natural ways to control pests without harmful chemicals. Use neem oil, companion planting, and beneficial insects.",
            link: "#",
        },
        {
            id: 3,
            title: "Irrigation Best Practices",
            category: "Water Management",
            content:
                "Optimize water usage with drip irrigation and mulching. Save water and ensure your crops get consistent moisture.",
            link: "#",
        },
        {
            id: 4,
            title: "Organic Certification Guide",
            category: "Certification",
            content:
                "A step-by-step guide to getting your farm certified as organic. Access premium markets and build trust with consumers.",
            link: "#",
        },
    ];

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Farmer Resources & Knowledge Hub</h1>

            {/* Weather Section */}
            <div className="glass p-6 rounded-xl mb-8 bg-gradient-to-r from-blue-500 to-blue-400 text-white shadow-lg">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold flex items-center">
                        <FaCloudSun className="mr-3" /> Current Weather
                    </h2>
                    <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                        {location.lat.toFixed(2)}, {location.lon.toFixed(2)}
                    </span>
                </div>

                {weather && weather.current_weather ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <FaTemperatureHigh className="text-4xl mb-2" />
                            <span className="text-3xl font-bold">
                                {weather.current_weather.temperature}°C
                            </span>
                            <span className="text-sm opacity-80">Temperature</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <FaWind className="text-4xl mb-2" />
                            <span className="text-3xl font-bold">
                                {weather.current_weather.windspeed} km/h
                            </span>
                            <span className="text-sm opacity-80">Wind Speed</span>
                        </div>
                        <div className="flex flex-col items-center p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                            <FaTint className="text-4xl mb-2" />
                            <span className="text-3xl font-bold">
                                {weather.daily?.precipitation_sum?.[0] || 0} mm
                            </span>
                            <span className="text-sm opacity-80">Precipitation (Today)</span>
                        </div>
                    </div>
                ) : (
                    <p>Weather data unavailable</p>
                )}
            </div>

            {/* Resources Grid */}
            <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
                <FaBookOpen className="mr-3 text-green-500" /> Farming Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {resources.map((resource) => (
                    <div
                        key={resource.id}
                        className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded">
                                {resource.category}
                            </span>
                            <FaSeedling className="text-green-500 text-xl" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">
                            {resource.title}
                        </h3>
                        <p className="text-gray-600 mb-4">{resource.content}</p>
                        <button className="text-green-600 font-medium hover:text-green-800 transition-colors">
                            Read More →
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourcesPage;
