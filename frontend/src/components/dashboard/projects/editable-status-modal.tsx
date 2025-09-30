import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Lock, LockOpen } from "lucide-react";
import { useState } from "react";

interface EditableStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void>;
  currentStatus: boolean;
  projectName: string;
  isLoading?: boolean;
}

export function EditableStatusModal({
  isOpen,
  onClose,
  onConfirm,
  currentStatus,
  projectName,
  isLoading = false,
}: EditableStatusModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const newStatus = !currentStatus;

  const handleConfirm = async () => {
    // Validate reason
    if (!reason.trim()) {
      setError("Please provide a reason for this change");
      return;
    }

    if (reason.trim().length < 10) {
      setError("Reason must be at least 10 characters");
      return;
    }

    try {
      await onConfirm(reason.trim());
      // Reset state
      setReason("");
      setError("");
      onClose();
    } catch (err) {
      // Error handling is done in parent component
      console.error("Error in modal:", err);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      setError("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {newStatus ? (
              <LockOpen className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-red-600" />
            )}
            <span>{newStatus ? "Enable Editing" : "Disable Editing"}</span>
          </DialogTitle>
          <DialogDescription>
            You are about to {newStatus ? "enable" : "disable"} editing for this
            project.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Project Info */}
          <div className="bg-gray-50 p-3 rounded-lg space-y-2">
            <div className="text-sm font-medium text-gray-700">
              Project: {projectName}
            </div>
            <div className="text-xs text-gray-600">
              Current Status:{" "}
              <span
                className={
                  currentStatus
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {currentStatus ? "Editable" : "Locked"}
              </span>
            </div>
          </div>

          {/* Status Change Info */}
          <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2">
              <div className="text-sm font-medium text-blue-900">
                New Status:
              </div>
              <div
                className={
                  newStatus
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {newStatus ? "Editable" : "Locked"}
              </div>
            </div>
            {newStatus ? (
              <LockOpen className="w-5 h-5 text-green-600" />
            ) : (
              <Lock className="w-5 h-5 text-red-600" />
            )}
          </div>

          {/* Impact Warning */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                {newStatus ? (
                  <>
                    <strong>Enabling editing</strong> will allow the assigned JE
                    to make changes to this project. This is typically done when
                    corrections are needed.
                  </>
                ) : (
                  <>
                    <strong>Disabling editing</strong> will prevent any further
                    modifications to this project. This is typically done after
                    approval or completion.
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Reason Input */}
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Reason for Change <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="reason"
              placeholder={
                newStatus
                  ? "e.g., Allowing corrections based on feedback..."
                  : "e.g., Project approved and finalized..."
              }
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError("");
              }}
              className={error ? "border-red-500" : ""}
              rows={3}
              maxLength={500}
              disabled={isLoading}
            />
            {error && (
              <p className="text-sm text-red-500 flex items-center space-x-1">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </p>
            )}
            <p className="text-xs text-gray-500">
              {reason.length}/500 characters (minimum 10)
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading || !reason.trim()}
            className={
              newStatus
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </>
            ) : (
              <>Confirm Change</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
