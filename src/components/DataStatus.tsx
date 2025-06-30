import type React from "react";
import { useDataAvailability } from "../services/data-service";

const DataStatus: React.FC = () => {
	const { data: availability, isLoading, error } = useDataAvailability();

	if (isLoading) return null;
	if (error || !availability?.available) {
		return (
			<div className="fixed bottom-4 right-4 bg-red-500 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
				⚠️ Data unavailable
			</div>
		);
	}

	if (availability.source === "api") {
		return (
			<div className="fixed bottom-4 right-4 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm shadow-lg">
				🌐 Using API data
			</div>
		);
	}

	// For local data, show nothing (default state)
	return null;
};

export default DataStatus;
