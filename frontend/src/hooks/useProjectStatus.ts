// hooks/useProjectStatus.ts

import {
  getAllowedStatusTransitions,
  getProjectStatusHistory,
  StatusUpdateRequest,
  updateProjectStatus,
} from "@/utils/projects/project-status";
import { useCallback, useState } from "react";

interface UseProjectStatusOptions {
  onSuccess?: (result: unknown) => void;
  onError?: (error: Error) => void;
}

export function useProjectStatus(options: UseProjectStatusOptions = {}) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (projectId: string, statusData: StatusUpdateRequest) => {
      try {
        setIsUpdating(true);
        setError(null);

        const result = await updateProjectStatus(projectId, statusData);

        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Unknown error occurred");
        setError(error.message);
        options.onError?.(error);
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [options]
  );

  const approveProject = useCallback(
    async (projectId: string, remarks?: string) => {
      return updateStatus(projectId, {
        newStatus: "Ongoing",
        remarks,
      });
    },
    [updateStatus]
  );

  const rejectProject = useCallback(
    async (
      projectId: string,
      rejectionReason: string,
      remarks?: string,
      role: string = "AEE"
    ) => {
      return updateStatus(projectId, {
        newStatus: `Rejected by ${role}`,
        remarks,
        rejectionReason,
      });
    },
    [updateStatus]
  );

  const resubmitProject = useCallback(
    async (projectId: string, remarks?: string) => {
      return updateStatus(projectId, {
        newStatus: "Resubmitted for Approval",
        remarks,
      });
    },
    [updateStatus]
  );

  const completeProject = useCallback(
    async (projectId: string, remarks?: string) => {
      return updateStatus(projectId, {
        newStatus: "Completed",
        remarks,
      });
    },
    [updateStatus]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    // State
    isUpdating,
    error,

    // Actions
    updateStatus,
    approveProject,
    rejectProject,
    resubmitProject,
    completeProject,
    clearError,
  };
}

// Alternative hook for managing status history
export function useProjectStatusHistory(projectId: string) {
  const [history, setHistory] = useState<unknown[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalEntries: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const fetchHistory = useCallback(
    async (page: number = 1, limit: number = 10) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await getProjectStatusHistory(projectId, page, limit);

        setHistory(result.data.statusHistory);
        setPagination(result.data.pagination);

        return result;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to fetch status history");
        setError(error.message);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [projectId]
  );

  const loadMore = useCallback(async () => {
    if (pagination.hasNextPage && !isLoading) {
      const result = await fetchHistory(pagination.currentPage + 1);
      setHistory((prev) => [...prev, ...result.data.statusHistory]);
    }
  }, [pagination.hasNextPage, pagination.currentPage, isLoading, fetchHistory]);

  const refresh = useCallback(() => {
    return fetchHistory(1);
  }, [fetchHistory]);

  return {
    // State
    history,
    isLoading,
    error,
    pagination,

    // Actions
    fetchHistory,
    loadMore,
    refresh,
  };
}

// Hook for managing allowed transitions
export function useAllowedTransitions(projectId: string) {
  const [transitions, setTransitions] = useState<string[]>([]);
  const [canUpdate, setCanUpdate] = useState(false);
  const [requiresRejectionReason, setRequiresRejectionReason] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransitions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await getAllowedStatusTransitions(projectId);

      setTransitions(result.data.allowedTransitions);
      setCanUpdate(result.data.user.canUpdateStatus);
      setRequiresRejectionReason(result.data.requiresRejectionReason);

      return result;
    } catch (err) {
      const error =
        err instanceof Error
          ? err
          : new Error("Failed to fetch allowed transitions");
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  const canApprove = transitions.includes("Ongoing");
  const canReject = transitions.some((t) => t.startsWith("Rejected by"));
  const canResubmit = transitions.includes("Resubmitted for Approval");
  const canComplete = transitions.includes("Completed");

  return {
    // State
    transitions,
    canUpdate,
    requiresRejectionReason,
    isLoading,
    error,

    // Computed permissions
    canApprove,
    canReject,
    canResubmit,
    canComplete,

    // Actions
    fetchTransitions,
  };
}

// Usage example hook for the component
export function useProjectStatusModal(
  projectId: string,
  onUpdate?: () => void
) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(
    null
  );

  const { updateStatus, isUpdating, error } = useProjectStatus({
    onSuccess: () => {
      setIsModalOpen(false);
      setModalAction(null);
      onUpdate?.();
    },
  });

  const openApproveModal = useCallback(() => {
    setModalAction("approve");
    setIsModalOpen(true);
  }, []);

  const openRejectModal = useCallback(() => {
    setModalAction("reject");
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    if (!isUpdating) {
      setIsModalOpen(false);
      setModalAction(null);
    }
  }, [isUpdating]);

  const handleStatusUpdate = useCallback(
    async (statusData: StatusUpdateRequest) => {
      return updateStatus(projectId, statusData);
    },
    [projectId, updateStatus]
  );

  return {
    // Modal state
    isModalOpen,
    modalAction,
    isUpdating,
    error,

    // Modal actions
    openApproveModal,
    openRejectModal,
    closeModal,
    handleStatusUpdate,
  };
}
