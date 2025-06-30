// src/App.tsx

import { UmamiAnalytics } from "@giof/react-umami";
import { lazy, Suspense } from "react";
import Conclusions from "./components/Conclusions";
import DataStatus from "./components/DataStatus";
import CallToAction from "./components/DownloadCTA";
import ExecutiveSummary from "./components/ExecutiveSummary";
import Footer from "./components/Footer";
import GenderAnalysis from "./components/GenderAnalysis";
import Hero from "./components/Hero";
import LoadingSpinner from "./components/LoadingSpinner";
import Navigation from "./components/Navigation";
import ShareButton from "./components/ShareButton";

// Lazy load heavy components
const InteractiveVisualization = lazy(
	() => import("./components/InteractiveVisualization"),
);

function App() {
	return (
		<div className="min-h-screen bg-white">
			<UmamiAnalytics
				websiteId="e8ebe905-8944-4f81-9438-71a9d911a58c"
				src="https://umami.marjala.com/script.js"
				dryRun={import.meta.env.VITE_UMAMI_DRY_RUN === "true"}
				debug={import.meta.env.VITE_UMAMI_DEBUG === "true"}
			/>
			<Navigation />
			<Hero />

			<div id="executive-summary">
				<ExecutiveSummary />
			</div>
			<div id="visualization">
				<Suspense fallback={<LoadingSpinner />}>
					<InteractiveVisualization />
				</Suspense>
			</div>
			<div id="gender-analysis">
				<GenderAnalysis />
			</div>
			<div id="conclusions">
				<Conclusions />
			</div>

			{/* Strategic CTA Placement - Bottom Center */}
			<section className="py-16 bg-linear-to-br from-slate-100 via-purple-50 to-blue-50">
				<div className="max-w-7xl mx-auto px-6">
					<CallToAction variant="footer" />
				</div>
			</section>

			<Footer />

			{/* Floating Share Button */}
			<ShareButton variant="floating" />

			{/* Data Status Indicator */}
			<DataStatus />
		</div>
	);
}

export default App;
