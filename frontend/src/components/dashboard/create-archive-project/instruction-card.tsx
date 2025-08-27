import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export function ArchiveProjectInstructionsCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="bg-teal-600 shadow-md rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            Guidelines for Archive Project Creation
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-white hover:bg-teal-700 hover:text-white p-1 h-auto"
            aria-label={
              isExpanded ? "Collapse instructions" : "Expand instructions"
            }
          >
            {isExpanded ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <CardContent className="space-y-4">
          <div className="text-white space-y-4">
            <div>
              <p className="font-semibold text-white mb-3">
                Archive Project Creation Process:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • <strong>Step 1:</strong> Fill out all archive project
                  details including administrative approval, work details, and
                  progress information
                </li>
                <li>
                  • <strong>Step 2:</strong> Review all entered information,
                  uploaded documents, and make corrections if needed
                </li>
                <li>
                  • <strong>Step 3:</strong> Final submission - create your
                  archive project after confirming all details are accurate
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                1. Administrative Approval Details:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • Financial year must be in YYYY-YYYY format (e.g., 2023-2024)
                  representing April to March period.
                </li>
                <li>
                  • A.A Number should be the exact administrative approval
                  reference number from official documents.
                </li>
                <li>
                  • A.A Amount must be entered in Indian Rupees without currency
                  symbols or commas.
                </li>
                <li>
                  • A.A Date cannot be in the future and should align with the
                  selected financial year.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                2. Work Details Requirements:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • Name of Work should be descriptive and comprehensive
                  (minimum 10 characters, maximum 200 characters).
                </li>
                <li>
                  • Contractor name must be the full registered name (minimum 8
                  characters, maximum 100 characters).
                </li>
                <li>
                  • Work Value represents the total contracted amount for the
                  project in Indian Rupees.
                </li>
                <li>
                  {`• Location should be selected from the dropdown options or
                  specified if "Other" is chosen.`}
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                3. Work Order Information:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • FWO Number and Date should include complete First Work Order
                  reference details.
                </li>
                <li>
                  • FWO Date cannot be in the future and must be on or after the
                  A.A Date.
                </li>
                <li>
                  • Ensure FWO details match exactly with official work order
                  documents.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                4. Progress and Financial Tracking:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • Progress percentage should be between 0-100% representing
                  actual work completion.
                </li>
                <li>
                  • Bill Submitted Amount cannot exceed the Work Value and
                  should reflect actual payments made.
                </li>
                <li>
                  • The system will automatically calculate remaining work value
                  and financial progress.
                </li>
                <li>
                  {`• Enter 0 for progress and bill amount if the project hasn't
                  started yet.`}
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                5. Administrative Details:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • Bill Number must be unique across the system - duplicate
                  entries will be rejected.
                </li>
                <li>
                  • Select the appropriate concerned engineer from the dropdown
                  options.
                </li>
                <li>
                  • Remarks field is optional but useful for additional project
                  notes (maximum 500 characters).
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                6. Document Upload Guidelines (IMPORTANT):
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • <strong>ONLY PDF and Image files</strong> are accepted for
                  upload (PDF, JPG, JPEG, PNG).
                </li>
                <li>• Maximum file size allowed is 10MB per document.</li>
                <li>
                  • Upload relevant documents such as A.A copy, work order,
                  bills, completion certificates, etc.
                </li>
                <li>
                  • Word documents (.doc, .docx) and Excel files are not
                  supported - please convert to PDF.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                7. Data Validation and Cross-Checks:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • The system automatically validates that bill submitted
                  amount does not exceed work value.
                </li>
                <li>
                  • FWO date cannot be before A.A date - ensure chronological
                  consistency.
                </li>
                <li>
                  • A.A date should fall within the selected financial year
                  period (April to March).
                </li>
                <li>
                  • All required fields marked with{" "}
                  <span className="text-red-300 font-bold">*</span> must be
                  completed before submission.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                8. Review and Submission Process:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • Use the review step to carefully verify all entered
                  information before final submission.
                </li>
                <li>
                  {`• You can edit details by clicking "Edit Details" during the
                  review phase.`}
                </li>
                <li>
                  • Once submitted, the archive project becomes part of the
                  permanent record system.
                </li>
                <li>
                  • A unique Archive ID will be generated upon successful
                  submission for future reference.
                </li>
                <li>
                  • You can download a PDF copy of the submitted archive project
                  for your records.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
