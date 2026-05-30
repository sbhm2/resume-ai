import { DetailedAnalysisData } from "@/components/dashboard/DetailedAnalysis";

// Realistic SaaS Dummy Data
export const dummyAnalysisData: DetailedAnalysisData = {
    parseRate: 98,
    matchScore: 85,
    industryRank: "Top 12%",
    topKeywords: [
      "React", "TypeScript", "Microservices", "System Design", 
      "GraphQL", "CI/CD", "Agile", "Node.js"
    ],
    missingKeywords: [
      "AWS", "Docker", "Kubernetes", "Redux Toolkit"
    ],
    premiumInsights: "Your resume structure is highly optimized for enterprise ATS software. To break into the Top 5% of candidates, quantify the impact of your 'Microservices' bullet point with a specific percentage increase in system performance. Additionally, adding 'AWS' and 'Docker' to your skills section will perfectly align your profile with the Senior Developer baseline."
  };