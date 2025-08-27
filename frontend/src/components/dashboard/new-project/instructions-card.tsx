import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

export default function InstructionsCard() {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="bg-teal-600 shadow-md rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            Guidelines for Project Creation
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
                Step-by-Step Process Overview:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • <strong>Step 1:</strong> Fill out all project details in the
                  comprehensive form below
                </li>
                <li>
                  • <strong>Step 2:</strong> Review all entered information,
                  uploaded documents, and make corrections if needed
                </li>
                <li>
                  • <strong>Step 3:</strong> Final submission - create your
                  project after confirming all details are accurate
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                1. Form Completion Guidelines:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • All dates must be today or in the future. Past dates are not
                  acceptable for new project proposals.
                </li>
                <li>
                  • Project end date must be after start date. Ensure realistic
                  timeline planning for project execution.
                </li>
                <li>
                  • Fields marked with{" "}
                  <span className="text-red-300 font-bold">*</span> are
                  mandatory and must be completed before proceeding to review.
                </li>
                <li>
                  • If you enable sub-projects, at least one sub-project with
                  complete details must be added.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                2. Project Details Requirements (Updated):
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • Project name should be descriptive and meaningful (minimum 5
                  characters, maximum 100 characters).
                </li>
                <li>
                  • Description is optional but recommended for clarity (maximum
                  1000 characters).
                </li>
                <li>
                  • Date of Issue of Work Order is required and must be today or
                  in the future.
                </li>
                <li>
                  • Work Order Number is mandatory and must be unique for each
                  project.
                </li>
                <li>
                  • Select appropriate Sanction & Department from the dropdown
                  options.
                </li>
                <li>
                  {`• Executing Department is automatically set to "APTDCL" as per
                  organizational requirements.`}
                </li>
                <li>
                  • Enter estimated cost in Indian Rupees only using decimal
                  format (e.g., 150000.50).
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                3. Financial Information Guidelines:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  {`• Select the correct fund source based on your project's
                  funding mechanism from the available options.`}
                </li>
                <li>
                  • Budget Head is optional but recommended for better financial
                  tracking.
                </li>
                <li>
                  • Beneficiary field helps identify who will benefit from the
                  project (optional, max 200 characters).
                </li>
                <li>
                  • Ensure all financial amounts are entered in valid decimal
                  format without currency symbols.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                4. Document Upload Requirements (CRITICAL):
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • <strong>ONLY PDF and Image files</strong> are accepted for
                  upload (PDF, JPG, JPEG, PNG) as per system security policies.
                </li>
                <li>
                  • Maximum file size allowed is 10MB per document. Ensure all
                  documents are clearly readable and properly scanned.
                </li>
                <li>
                  • Upload relevant supporting documents such as project
                  proposals, government approvals, site photographs, technical
                  drawings, etc.
                </li>
                <li>
                  • Word documents (.doc, .docx), Excel files (.xls, .xlsx), and
                  other formats are NOT supported - please convert to PDF format
                  before uploading.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                5. Location and Work Classification Guidelines:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • District selection is mandatory - choose from the available
                  Assam districts.
                </li>
                <li>
                  • Block and Gram Panchayat are optional but recommended for
                  precise location identification.
                </li>
                <li>
                  • Geo-location coordinates are optional but helpful for
                  mapping (latitude: -90 to 90, longitude: -180 to 180).
                </li>
                <li>
                  • Type of Work and Nature of Work are mandatory fields -
                  select appropriate options from dropdowns.
                </li>
                <li>
                  • Extension Period for Completion is optional and should only
                  be used if needed.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                6. Sub-Project Guidelines (If Enabled):
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • Each sub-project must have a unique and descriptive name
                  (5-200 characters).
                </li>
                <li>
                  • Estimated amount for each sub-project must be greater than
                  zero.
                </li>
                <li>
                  • Sub-project dates must fall within the main project
                  timeline.
                </li>
                <li>
                  • Type of work for sub-projects can be different from the main
                  project.
                </li>
                <li>
                  • Extension periods for sub-projects are optional and
                  independent.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                7. Step-by-Step Process Important Notes:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  {`• You can navigate back to edit details at any point during
                  the review step by clicking "Edit Details".`}
                </li>
                <li>
                  • The review step shows exactly how your project information
                  will appear in the system and allows for corrections.
                </li>
                <li>
                  • Use the review step to make final checks before submission -
                  once submitted, modifications may require additional
                  approvals.
                </li>
                <li>
                  • The final submission step will create the project in the
                  system and automatically forward it to AEE for processing.
                </li>
                <li>
                  • After successful submission, you can download a PDF summary
                  of your project for your records.
                </li>
                <li>
                  • For technical assistance or clarifications, contact the
                  system administrator or concerned department before
                  submission.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                8. System Integration Notes:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • This system is integrated with the backend project
                  management system.
                </li>
                <li>
                  • All project data is validated according to organizational
                  standards.
                </li>
                <li>
                  • Projects are automatically assigned unique IDs upon
                  successful creation.
                </li>
                <li>
                  • The system maintains audit trails for all project
                  activities.
                </li>
                <li>
                  • Role-based access ensures proper project workflow
                  management.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
