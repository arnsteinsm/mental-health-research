import { motion } from "framer-motion";
import { AlertTriangle, Heart, Users } from "lucide-react";
import type React from "react";
import { countryNames } from "../data";
import { useResearchData } from "../services/data-service";

interface HumanImpactSummaryProps {
	selectedCountries: string[];
	selectedYear: string;
	selectedMetric: "est_alcohol_deaths" | "est_suicide_deaths";
}

const HumanImpactSummary: React.FC<HumanImpactSummaryProps> = ({
	selectedCountries,
	selectedYear,
	selectedMetric,
}) => {
	const { data: researchData = [] } = useResearchData();

	// Filter data for selected countries and year
	const filteredData = researchData.filter(
		(d) =>
			selectedCountries.includes(d.country) &&
			d.year === selectedYear &&
			d[selectedMetric],
	);

	// Calculate totals by gender
	const maleDeaths = filteredData
		.filter((d) => d.sex === "M")
		.reduce((sum, d) => sum + Number.parseFloat(d[selectedMetric] || "0"), 0);

	const femaleDeaths = filteredData
		.filter((d) => d.sex === "F")
		.reduce((sum, d) => sum + Number.parseFloat(d[selectedMetric] || "0"), 0);

	const totalDeaths = maleDeaths + femaleDeaths;
	const genderRatio = femaleDeaths > 0 ? maleDeaths / femaleDeaths : 0;

	// Get per-country breakdown
	const countryBreakdown = selectedCountries.map((country) => {
		const countryMale = filteredData.find(
			(d) => d.country === country && d.sex === "M",
		);
		const countryFemale = filteredData.find(
			(d) => d.country === country && d.sex === "F",
		);

		const maleCount = countryMale
			? Number.parseFloat(countryMale[selectedMetric] || "0")
			: 0;
		const femaleCount = countryFemale
			? Number.parseFloat(countryFemale[selectedMetric] || "0")
			: 0;

		return {
			country,
			countryName: countryNames[country] || country,
			maleDeaths: maleCount,
			femaleDeaths: femaleCount,
			totalDeaths: maleCount + femaleCount,
			ratio: femaleCount > 0 ? maleCount / femaleCount : 0,
		};
	});

	// Sort by total impact
	countryBreakdown.sort((a, b) => b.totalDeaths - a.totalDeaths);

	const metricLabels = {
		est_alcohol_deaths: {
			title: "Alcohol-Related Deaths",
			subtitle: "Real people, not statistics",
			icon: <Heart className="w-6 h-6" />,
			color: "from-purple-600 to-purple-700",
			bgColor: "bg-purple-50",
			textColor: "text-purple-800",
		},
		est_suicide_deaths: {
			title: "Suicide Deaths",
			subtitle: "Lives lost to mental health crisis",
			icon: <AlertTriangle className="w-6 h-6" />,
			color: "from-red-600 to-red-700",
			bgColor: "bg-red-50",
			textColor: "text-red-800",
		},
	};

	const currentMetric = metricLabels[selectedMetric];

	if (filteredData.length === 0) {
		return (
			<div
				className={`rounded-xl p-6 ${currentMetric.bgColor} border border-gray-200`}
			>
				<div className="text-center">
					<p className={`${currentMetric.textColor} font-medium`}>
						No data available for selected countries and year
					</p>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6 }}
			className={`rounded-xl p-6 ${currentMetric.bgColor} border border-gray-200`}
		>
			{/* Header */}
			<div className="flex items-center mb-6">
				<div
					className={`p-3 rounded-lg bg-linear-to-r ${currentMetric.color} text-white mr-4`}
				>
					{currentMetric.icon}
				</div>
				<div>
					<h3 className={`text-xl font-bold ${currentMetric.textColor}`}>
						{currentMetric.title} ({selectedYear})
					</h3>
					<p className={`text-sm ${currentMetric.textColor} opacity-75`}>
						{currentMetric.subtitle}
					</p>
				</div>
			</div>

			{/* Total Impact */}
			<div className="grid md:grid-cols-3 gap-4 mb-6">
				<div className="bg-white rounded-lg p-4 text-center">
					<div className="flex items-center justify-center mb-2">
						<Users className="w-5 h-5 text-blue-600 mr-2" />
						<span className="text-sm font-medium text-gray-600">
							Total Lives
						</span>
					</div>
					<div className="text-2xl font-bold text-gray-900">
						{Math.round(totalDeaths).toLocaleString()}
					</div>
					<div className="text-xs text-gray-500">people affected</div>
				</div>

				<div className="bg-white rounded-lg p-4 text-center">
					<div className="flex items-center justify-center mb-2">
						<div className="w-3 h-3 bg-blue-600 rounded mr-2" />
						<span className="text-sm font-medium text-gray-600">Men</span>
					</div>
					<div className="text-2xl font-bold text-blue-600">
						{Math.round(maleDeaths).toLocaleString()}
					</div>
					<div className="text-xs text-gray-500">
						{totalDeaths > 0 ? Math.round((maleDeaths / totalDeaths) * 100) : 0}
						% of total
					</div>
				</div>

				<div className="bg-white rounded-lg p-4 text-center">
					<div className="flex items-center justify-center mb-2">
						<div className="w-3 h-3 bg-pink-500 rounded mr-2" />
						<span className="text-sm font-medium text-gray-600">Women</span>
					</div>
					<div className="text-2xl font-bold text-pink-500">
						{Math.round(femaleDeaths).toLocaleString()}
					</div>
					<div className="text-xs text-gray-500">
						{totalDeaths > 0
							? Math.round((femaleDeaths / totalDeaths) * 100)
							: 0}
						% of total
					</div>
				</div>
			</div>

			{/* Gender Disparity Highlight */}
			{genderRatio > 1 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="bg-white rounded-lg p-4 mb-6 border-l-4 border-orange-400"
				>
					<div className="flex items-center">
						<AlertTriangle className="w-5 h-5 text-orange-500 mr-3" />
						<div>
							<p className="font-semibold text-gray-900">
								<span className="text-orange-600">
									{genderRatio.toFixed(1)}x
								</span>{" "}
								gender disparity
							</p>
							<p className="text-sm text-gray-600">
								For every woman who died, {genderRatio.toFixed(1)} men lost
								their lives. That's{" "}
								<strong>
									{Math.round(maleDeaths - femaleDeaths).toLocaleString()}
								</strong>{" "}
								more male deaths.
							</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Country Breakdown */}
			<div className="space-y-3">
				<h4 className={`font-semibold ${currentMetric.textColor} mb-3`}>
					By Country (showing {selectedCountries.length} selected)
				</h4>
				{countryBreakdown.map((country, index) => (
					<motion.div
						key={country.country}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 * index }}
						className="bg-white rounded-lg p-4"
					>
						<div className="flex items-center justify-between mb-2">
							<h5 className="font-medium text-gray-900">
								{country.countryName}
							</h5>
							<span className="text-lg font-bold text-gray-900">
								{Math.round(country.totalDeaths).toLocaleString()}
							</span>
						</div>
						<div className="flex items-center justify-between text-sm">
							<div className="flex items-center space-x-4">
								<div className="flex items-center">
									<div className="w-2 h-2 bg-blue-600 rounded mr-1" />
									<span className="text-gray-600">
										{Math.round(country.maleDeaths).toLocaleString()} men
									</span>
								</div>
								<div className="flex items-center">
									<div className="w-2 h-2 bg-pink-500 rounded mr-1" />
									<span className="text-gray-600">
										{Math.round(country.femaleDeaths).toLocaleString()} women
									</span>
								</div>
							</div>
							{country.ratio > 1 && (
								<span className="text-xs text-orange-600 font-medium">
									{country.ratio.toFixed(1)}x disparity
								</span>
							)}
						</div>
					</motion.div>
				))}
			</div>

			{/* Call to Action */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 0.8 }}
				className={`mt-6 p-4 rounded-lg border-2 border-dashed ${currentMetric.textColor} border-opacity-30`}
			>
				<p className={`text-sm ${currentMetric.textColor} text-center italic`}>
					"Every number represents a life. Behind every statistic is a person, a
					family, a story that deserves to be remembered and honored."
				</p>
			</motion.div>
		</motion.div>
	);
};

export default HumanImpactSummary;
