import {
  ArchiveProjectFilters,
  DbArchiveProject,
} from "@/types/archive-projects.types";
import { fetchAllArchiveProjects } from "@/utils/archive-projects/fetchAllrchiveProjects";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

interface UseArchiveProjectsReturn {
  projects: DbArchiveProject[];
  loading: boolean;
  error: string | null;
  refreshProjects: () => Promise<void>;
  loadProjects: (filters?: ArchiveProjectFilters) => Promise<void>;
}

export const useArchiveProjects = (
  initialFilters: ArchiveProjectFilters = { limit: 100, page: 1 }
): UseArchiveProjectsReturn => {
  const [projects, setProjects] = useState<DbArchiveProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log(projects);

  const loadProjects = useCallback(
    async (filters: ArchiveProjectFilters = initialFilters) => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetchAllArchiveProjects(filters);
        setProjects(response.data);

        console.log(
          `Loaded ${response.data.length} archive projects successfully`
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to load archive projects";
        setError(errorMessage);
        console.error("Error loading archive projects:", err);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [initialFilters]
  );

  const refreshProjects = async () => {
    await loadProjects(initialFilters);
  };

  // Load projects on hook initialization
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return {
    projects,
    loading,
    error,
    refreshProjects,
    loadProjects,
  };
};

// Hook for getting archive projects suitable for dropdowns/selection
export const useArchiveProjectsForSelection = () => {
  const [projects, setProjects] = useState<
    Array<{
      id: string;
      name: string;
      workOrderNumber: string;
      location: string;
      contractor: string;
      workValue: number;
      progress: number;
    }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjectsForSelection = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetchAllArchiveProjects({
        limit: 200,
        page: 1,
        sortBy: "nameOfWork",
        sortOrder: "asc",
      });

      const mappedProjects = response.data.map((project) => ({
        id: project._id,
        projectId: project.projectId,
        name: project.nameOfWork,
        workOrderNumber: project.FWONumberAndDate,
        location: project.location,
        contractor: project.nameOfContractor,
        workValue: project.workValue,
        progress: project.progress,
      }));

      setProjects(mappedProjects);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to load projects for selection";
      setError(errorMessage);
      console.error("Error loading projects for selection:", err);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsForSelection();
  }, []);

  return {
    projects,
    loading,
    error,
    refresh: loadProjectsForSelection,
  };
};

// import {
//   ArchiveProjectFilters,
//   DbArchiveProject,
// } from "@/types/archive-projects.types";
// import { fetchAllArchiveProjects } from "@/utils/archive-projects/fetchAllrchiveProjects";
// import { useCallback, useEffect, useState } from "react";
// import { toast } from "sonner";

// interface UseArchiveProjectsReturn {
//   projects: DbArchiveProject[];
//   loading: boolean;
//   error: string | null;
//   refreshProjects: () => Promise<void>;
//   loadProjects: (filters?: ArchiveProjectFilters) => Promise<void>;
//   totalCount: number;
//   summary: {
//     totalProjects: number;
//     totalWorkValue: number;
//     totalBillSubmitted: number;
//     avgProgress: number;
//     avgFinancialProgress: number;
//     completedProjects: number;
//     financiallyCompletedProjects: number;
//     fullyCompletedProjects: number;
//     completionRate: number;
//     financialCompletionRate: number;
//     fullCompletionRate: number;
//     billSubmissionRate: number;
//   } | null;
// }

// export const useArchiveProjects = (
//   initialFilters: ArchiveProjectFilters = { limit: 100, page: 1 }
// ): UseArchiveProjectsReturn => {
//   const [projects, setProjects] = useState<DbArchiveProject[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [totalCount, setTotalCount] = useState(0);
//   const [summary, setSummary] =
//     useState<UseArchiveProjectsReturn["summary"]>(null);

//   const loadProjects = useCallback(
//     async (filters: ArchiveProjectFilters = initialFilters) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetchAllArchiveProjects(filters);
//         setProjects(response.data);
//         setTotalCount(response.pagination.totalDocuments);
//         setSummary({
//           totalProjects: response.summary.totalProjects,
//           totalWorkValue: response.summary.totalWorkValue,
//           totalBillSubmitted: response.summary.totalBillSubmitted,
//           avgProgress: response.summary.avgProgress,
//           avgFinancialProgress: response.summary.avgFinancialProgress,
//           completedProjects: response.summary.completedProjects,
//           financiallyCompletedProjects:
//             response.summary.financiallyCompletedProjects,
//           fullyCompletedProjects: response.summary.fullyCompletedProjects,
//           completionRate: response.summary.completionRate,
//           financialCompletionRate: response.summary.financialCompletionRate,
//           fullCompletionRate: response.summary.fullCompletionRate,
//           billSubmissionRate: response.summary.billSubmissionRate,
//         });

//         console.log(
//           `Loaded ${response.data.length} archive projects successfully`
//         );
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error
//             ? err.message
//             : "Failed to load archive projects";
//         setError(errorMessage);
//         console.error("Error loading archive projects:", err);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     },
//     [initialFilters]
//   );

//   const refreshProjects = async () => {
//     await loadProjects(initialFilters);
//   };

//   // Load projects on hook initialization
//   useEffect(() => {
//     loadProjects();
//   }, [loadProjects]);

//   return {
//     projects,
//     loading,
//     error,
//     refreshProjects,
//     loadProjects,
//     totalCount,
//     summary,
//   };
// };

// // Hook for getting archive projects suitable for dropdowns/selection
// export const useArchiveProjectsForSelection = () => {
//   const [projects, setProjects] = useState<
//     Array<{
//       id: string;
//       name: string;
//       workOrderNumber: string;
//       location: string;
//       contractor: string;
//       workValue: number;
//       progress: number;
//       financialProgress: number;
//       isComplete: boolean;
//       isFullyComplete: boolean;
//     }>
//   >([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadProjectsForSelection = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const response = await fetchAllArchiveProjects({
//         limit: 200,
//         page: 1,
//         sortBy: "nameOfWork",
//         sortOrder: "asc",
//       });

//       const mappedProjects = response.data.map((project) => ({
//         id: project._id,
//         projectId: project.projectId,
//         name: project.nameOfWork,
//         workOrderNumber: project.FWONumberAndDate,
//         location: project.location,
//         contractor: project.nameOfContractor,
//         workValue: project.workValue,
//         progress: project.progress || 0,
//         financialProgress: project.financialProgress || 0,
//         isComplete: (project.progress || 0) === 100,
//         isFullyComplete:
//           (project.progress || 0) === 100 &&
//           (project.financialProgress || 0) === 100,
//       }));

//       setProjects(mappedProjects);
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Failed to load projects for selection";
//       setError(errorMessage);
//       console.error("Error loading projects for selection:", err);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadProjectsForSelection();
//   }, []);

//   return {
//     projects,
//     loading,
//     error,
//     refresh: loadProjectsForSelection,
//   };
// };

// // Hook for tracking project progress over time
// export const useProjectProgressTracking = (projectId: string) => {
//   const [progressData, setProgressData] = useState<{
//     physicalProgress: Array<{ date: string; value: number }>;
//     financialProgress: Array<{ date: string; value: number; amount: number }>;
//     gap: Array<{ date: string; gap: number }>;
//   } | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadProgressTracking = useCallback(async () => {
//     if (!projectId) return;

//     try {
//       setLoading(true);
//       setError(null);

//       // This would typically fetch progress history from the API
//       // For now, we'll simulate this data structure
//       // In a real implementation, you'd call:
//       // const response = await fetchProgressTrackingData(projectId);

//       // Simulated response structure
//       setProgressData({
//         physicalProgress: [],
//         financialProgress: [],
//         gap: [],
//       });
//     } catch (err) {
//       const errorMessage =
//         err instanceof Error
//           ? err.message
//           : "Failed to load progress tracking data";
//       setError(errorMessage);
//       console.error("Error loading progress tracking:", err);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [projectId]);

//   useEffect(() => {
//     loadProgressTracking();
//   }, [loadProgressTracking]);

//   return {
//     progressData,
//     loading,
//     error,
//     refresh: loadProgressTracking,
//   };
// };

// // Hook for project completion analysis
// export const useProjectCompletionAnalysis = () => {
//   const [completionData, setCompletionData] = useState<{
//     byStatus: {
//       physicallyComplete: number;
//       financiallyComplete: number;
//       fullyComplete: number;
//       inProgress: number;
//       notStarted: number;
//     };
//     byTimeframe: {
//       thisMonth: number;
//       thisQuarter: number;
//       thisYear: number;
//     };
//     averageCompletionTime: {
//       physical: number;
//       financial: number;
//       overall: number;
//     };
//     topPerformers: {
//       engineers: Array<{
//         name: string;
//         completionRate: number;
//         projectCount: number;
//       }>;
//       contractors: Array<{
//         name: string;
//         completionRate: number;
//         projectCount: number;
//       }>;
//     };
//   } | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadCompletionAnalysis = useCallback(
//     async (filters?: ArchiveProjectFilters) => {
//       try {
//         setLoading(true);
//         setError(null);

//         const response = await fetchAllArchiveProjects({
//           ...filters,
//           limit: 1000, // Get more data for analysis
//           page: 1,
//         });

//         // Analyze the completion data
//         const projects = response.data;
//         const totalProjects = projects.length;

//         const physicallyComplete = projects.filter(
//           (p) => (p.progress || 0) === 100
//         ).length;
//         const financiallyComplete = projects.filter(
//           (p) => (p.financialProgress || 0) === 100
//         ).length;
//         const fullyComplete = projects.filter(
//           (p) => (p.progress || 0) === 100 && (p.financialProgress || 0) === 100
//         ).length;
//         const inProgress =
//           projects.filter(
//             (p) => (p.progress || 0) > 0 || (p.financialProgress || 0) > 0
//           ).length - fullyComplete;
//         const notStarted = totalProjects - inProgress - fullyComplete;

//         // Calculate top performers (simplified)
//         const engineerPerformance = new Map();
//         const contractorPerformance = new Map();

//         projects.forEach((project) => {
//           // Engineer performance
//           const engineer = project.concernedEngineer;
//           if (!engineerPerformance.has(engineer)) {
//             engineerPerformance.set(engineer, {
//               completedCount: 0,
//               totalCount: 0,
//             });
//           }
//           const engineerData = engineerPerformance.get(engineer);
//           engineerData.totalCount++;
//           if (
//             (project.progress || 0) === 100 &&
//             (project.financialProgress || 0) === 100
//           ) {
//             engineerData.completedCount++;
//           }

//           // Contractor performance
//           const contractor = project.nameOfContractor;
//           if (!contractorPerformance.has(contractor)) {
//             contractorPerformance.set(contractor, {
//               completedCount: 0,
//               totalCount: 0,
//             });
//           }
//           const contractorData = contractorPerformance.get(contractor);
//           contractorData.totalCount++;
//           if (
//             (project.progress || 0) === 100 &&
//             (project.financialProgress || 0) === 100
//           ) {
//             contractorData.completedCount++;
//           }
//         });

//         const topEngineers = Array.from(engineerPerformance.entries())
//           .map(([name, data]: [string, any]) => ({
//             name,
//             completionRate: Math.round(
//               (data.completedCount / data.totalCount) * 100
//             ),
//             projectCount: data.totalCount,
//           }))
//           .sort((a, b) => b.completionRate - a.completionRate)
//           .slice(0, 5);

//         const topContractors = Array.from(contractorPerformance.entries())
//           .map(([name, data]: [string, any]) => ({
//             name,
//             completionRate: Math.round(
//               (data.completedCount / data.totalCount) * 100
//             ),
//             projectCount: data.totalCount,
//           }))
//           .sort((a, b) => b.completionRate - a.completionRate)
//           .slice(0, 5);

//         setCompletionData({
//           byStatus: {
//             physicallyComplete,
//             financiallyComplete,
//             fullyComplete,
//             inProgress,
//             notStarted,
//           },
//           byTimeframe: {
//             thisMonth: 0, // Would calculate based on actual dates
//             thisQuarter: 0,
//             thisYear: 0,
//           },
//           averageCompletionTime: {
//             physical: 0, // Would calculate based on actual timeline data
//             financial: 0,
//             overall: 0,
//           },
//           topPerformers: {
//             engineers: topEngineers,
//             contractors: topContractors,
//           },
//         });
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error
//             ? err.message
//             : "Failed to load completion analysis";
//         setError(errorMessage);
//         console.error("Error loading completion analysis:", err);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     },
//     []
//   );

//   return {
//     completionData,
//     loading,
//     error,
//     loadAnalysis: loadCompletionAnalysis,
//   };
// };
