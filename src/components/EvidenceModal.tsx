import { motion } from "framer-motion";
import { X } from "lucide-react";
import type React from "react";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import type { EvidenceSource } from "../data/evidence-sources";

interface EvidenceModalProps {
	isOpen: boolean;
	onClose: () => void;
	sources: EvidenceSource[];
	claimTitle: string;
}

const EvidenceModal: React.FC<EvidenceModalProps> = ({
	isOpen,
	onClose,
	sources,
	claimTitle,
}) => {
	// Handle escape key
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};

		if (isOpen) {
			document.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			document.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const evidenceCount = sources.length;
	const academicSources = sources.filter((s) => s.type === "academic").length;
	const institutionalSources = sources.filter(
		(s) => s.type === "institutional",
	).length;
	const governmentSources = sources.filter(
		(s) => s.type === "government",
	).length;
	const metaAnalysisSources = sources.filter(
		(s) => s.type === "meta-analysis",
	).length;

	const modalContent = (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
			style={{ zIndex: 99999 }}
			onClick={onClose}
		>
			<motion.div
				initial={{ scale: 0.95, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				exit={{ scale: 0.95, opacity: 0 }}
				className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				{/* Header */}
				<div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
					<div>
						<h3 className="text-xl font-bold text-gray-900">
							Evidence Sources
						</h3>
						<p className="text-sm text-gray-600 mt-1">
							{evidenceCount} peer-reviewed sources supporting:{" "}
							<span className="font-semibold">"{claimTitle}"</span>
						</p>
						<p className="text-xs text-gray-500 mt-1">
							{academicSources > 0 && `${academicSources} academic`}
							{institutionalSources > 0 &&
								`${academicSources > 0 ? " • " : ""}${institutionalSources} institutional`}
							{governmentSources > 0 &&
								`${academicSources > 0 || institutionalSources > 0 ? " • " : ""}${governmentSources} government`}
							{metaAnalysisSources > 0 &&
								`${academicSources > 0 || institutionalSources > 0 || governmentSources > 0 ? " • " : ""}${metaAnalysisSources} meta-analysis`}
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
						aria-label="Close modal"
					>
						<X className="w-5 h-5 text-gray-500" />
					</button>
				</div>

				{/* Content */}
				<div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
					{sources.length === 0 ? (
						<div className="text-center py-8">
							<p className="text-gray-500">
								No evidence sources found for this claim.
							</p>
						</div>
					) : (
						<>
							<div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
								<p className="text-sm text-blue-800">
									<span className="font-semibold">Focused Evidence:</span> These
									sources specifically support the "{claimTitle}" claim. Each
									source has been peer-reviewed and provides empirical evidence
									for this particular aspect of male vulnerability.
								</p>
							</div>
							<div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
								{sources.map((source, index) => (
									<div
										key={`${source.id}-${index}`}
										className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
									>
										<div className="flex items-start justify-between mb-3">
											<div className="flex-1 pr-2">
												<div className="font-semibold text-gray-900 text-sm mb-1 leading-tight">
													{source.title}
												</div>
												<div className="text-xs text-gray-600">
													{source.authors
														? source.authors.join(", ")
														: source.institution}{" "}
													({source.year})
												</div>
											</div>
											<span
												className={`px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ${
													source.type === "academic"
														? "bg-blue-100 text-blue-800"
														: source.type === "institutional"
															? "bg-green-100 text-green-800"
															: source.type === "meta-analysis"
																? "bg-orange-100 text-orange-800"
																: "bg-purple-100 text-purple-800"
												}`}
											>
												{source.type}
											</span>
										</div>
										<p className="text-xs text-gray-700 mb-3 leading-relaxed">
											{source.summary}
										</p>
										<a
											href={source.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
										>
											<svg
												className="w-3 h-3 mr-1"
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												aria-hidden="true"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
												/>
											</svg>
											View Source
										</a>
									</div>
								))}
							</div>
						</>
					)}
				</div>
			</motion.div>
		</motion.div>
	);

	return createPortal(modalContent, document.body);
};

export default EvidenceModal;
