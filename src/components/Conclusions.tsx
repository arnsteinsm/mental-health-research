// apps/web/src/components/Conclusions.tsx

import { motion } from "framer-motion";
import { ArrowRight, Target, Users } from "lucide-react";
import type React from "react";
import { datasetStats } from "../data";
import EvidenceButton from "./EvidenceButton";

const Conclusions: React.FC = () => {
	const solutions = [
		{
			icon: <Target className="w-8 h-8" />,
			title: "Reach at-risk men sooner",
			description:
				"Develop interventions that address masculine stigma and provide alternative pathways to support.",
			evidence: "Research shows men are 3x less likely to seek help",
			priority: "Critical",
			evidenceId: "male-focused-programs",
			color: "red",
		},
		{
			icon: <ArrowRight className="w-8 h-8" />,
			title: "Combine health, policy, and community support",
			description:
				"Address alcohol and mental health together, not as separate issues.",
			evidence: "74% of male suicides involve alcohol vs 31% for females",
			priority: "Essential",
			evidenceId: "integrated-treatment",
			color: "green",
		},
		{
			icon: <Users className="w-8 h-8" />,
			title: "Support men's mental health at work",
			description:
				"Target male-dominated industries with comprehensive mental health support systems.",
			evidence: "Male-dominated occupations show higher suicide rates",
			priority: "High",
			evidenceId: "workplace-mental-health",
			color: "orange",
		},
	];

	const getPriorityStyles = (color: string) => {
		switch (color) {
			case "red":
				return "bg-red-500 text-white shadow-red-500/25";
			case "orange":
				return "bg-orange-500 text-white shadow-orange-500/25";
			case "green":
				return "bg-emerald-500 text-white shadow-emerald-500/25";
			default:
				return "bg-gray-500 text-white";
		}
	};

	const getCardAccent = (color: string) => {
		switch (color) {
			case "red":
				return "border-t-red-500";
			case "orange":
				return "border-t-orange-500";
			case "green":
				return "border-t-emerald-500";
			default:
				return "border-t-gray-500";
		}
	};

	return (
		<section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
			<div className="container mx-auto px-6">
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
						What the data reveals
					</h2>
					<p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
						The correlation is clear (r ={" "}
						<span className="font-semibold text-purple-600">
							{datasetStats.correlations.overall.alcoholSuicide.toFixed(2)}
						</span>
						). While the path forward isn't simple, this evidence points to a
						systematic crisis – one that disproportionately affects men. Here
						are some approaches that could help address it.
					</p>
				</motion.div>

				{/* Solutions Grid */}
				<div className="grid lg:grid-cols-3 gap-8 mb-8">
					{solutions.map((solution, index) => (
						<motion.div
							key={solution.evidenceId}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: index * 0.1 }}
							viewport={{ once: true }}
							className={`bg-white rounded-xl shadow-lg border-t-4 ${getCardAccent(solution.color)} hover:shadow-xl transition-all duration-300 overflow-hidden`}
						>
							{/* Header */}
							<div className="p-6 pb-4 text-center">
								<div className="mb-4">
									<span
										className={`inline-block px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${getPriorityStyles(solution.color)} mb-3`}
									>
										{solution.priority}
									</span>
									<h3 className="text-xl font-bold text-gray-900">
										{solution.title}
									</h3>
								</div>

								<p className="text-gray-700 leading-relaxed mb-6">
									{solution.description}
								</p>
							</div>

							{/* Evidence Section */}
							<div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<h4 className="text-sm font-semibold text-gray-800 mb-1">
											Evidence
										</h4>
										<p className="text-sm text-gray-600">{solution.evidence}</p>
									</div>
									<div className="ml-3 pt-1">
										<EvidenceButton
											claimId={solution.evidenceId}
											claimTitle={solution.title}
											variant="inline"
										/>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
};

export default Conclusions;
