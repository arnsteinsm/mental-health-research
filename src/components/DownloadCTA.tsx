// src/components/DownloadCTA.tsx

import { motion } from "framer-motion";
import { Megaphone, Share2 } from "lucide-react";
import type React from "react";
import { calculateGenderRatio, datasetStats } from "../data";
import { useResearchData } from "../services/data-service";

interface CallToActionProps {
	variant?: "header" | "footer";
	className?: string;
}

const CallToAction: React.FC<CallToActionProps> = ({
	variant = "header",
	className = "",
}) => {
	// Get live data and calculate ratio
	const { data: researchData = [] } = useResearchData();
	const genderRatio =
		researchData.length > 0
			? calculateGenderRatio(researchData)
			: datasetStats.genderRatios.averageRatio;
	const displayRatio = Math.round(genderRatio * 10) / 10;

	const handleShare = () => {
		if (navigator.share) {
			navigator.share({
				title: "Behind the Drink: European Mental Health Crisis",
				text: `Men are dying from alcohol at ${displayRatio}x the rate of women. This analysis reveals the hidden mental health crisis.`,
				url: window.location.href,
			});
		} else {
			// Fallback to copying URL
			navigator.clipboard.writeText(window.location.href);
		}
	};

	if (variant === "header") {
		return (
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.5 }}
				className={`${className}`}
			>
				<button
					type="button"
					onClick={handleShare}
					className="inline-flex items-center px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
				>
					<Share2 className="w-4 h-4 mr-2" />
					Share Research
				</button>
			</motion.div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.8 }}
			viewport={{ once: true }}
			className={`text-center ${className}`}
		>
			<div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-2xl mx-auto">
				<Megaphone className="w-12 h-12 text-blue-600 mx-auto mb-4" />
				<h3 className="text-2xl font-bold text-gray-900 mb-4">
					Your voice can{" "}
					<strong className="underline decoration-red-500 decoration-4">
						change
					</strong>{" "}
					the data
				</h3>
				<p className="text-gray-600 mb-6 leading-relaxed">
					This analysis reveals an urgent but overlooked public health crisis in
					Europe. By uncovering the gendered patterns behind alcohol-related
					deaths and mental health, we can drive more targeted, evidence-based
					interventions.
				</p>
				<h4 className="font-bold text-gray-600 mb-6 leading-relaxed">
					<em>Behind every statistic is a life.</em>
				</h4>
				<p className="text-gray-600 mb-6 leading-relaxed">
					Share this with policymakers, health professionals, and mental health
					advocates. Your voice can help shift policy, save lives, and elevate
					mental health as a societal priority.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 justify-center">
					<button
						type="button"
						onClick={handleShare}
						className="inline-flex items-center px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
					>
						<Share2 className="w-5 h-5 mr-3" />
						Share This Research
					</button>
				</div>
			</div>
		</motion.div>
	);
};

export default CallToAction;
