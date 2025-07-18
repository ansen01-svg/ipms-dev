import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstructionsCard() {
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className="bg-blue-600">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl text-white flex items-center gap-2">
            <Info className="w-5 h-5" />
            Important Notification
          </CardTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="text-white hover:bg-blue-700 hover:text-white p-1 h-auto"
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
                  <span className="text-red-500 font-bold">*</span> are
                  mandatory and must be completed before form submission.
                </li>
                <li>
                  • If you enable sub-projects, at least one sub-project with
                  complete details must be added.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                2. Project Details Requirements:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • Project name should be descriptive and meaningful (minimum 3
                  characters, maximum 200 characters).
                </li>
                <li>
                  • Description must provide comprehensive project details
                  (minimum 10 characters, maximum 1000 characters).
                </li>
                <li>
                  • Select appropriate owning and executing departments
                  accurately from the dropdown options.
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
                    funding mechanism.`}
                </li>
                <li>
                  • Choose appropriate function and budget head as per
                  government financial classifications.
                </li>
                <li>
                  • Enter scheme and sub-scheme names exactly as mentioned in
                  official documentation.
                </li>
                <li>
                  • Ensure all financial amounts are entered in valid decimal
                  format without currency symbols.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                4. Location and Document Requirements:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  {`• Provide complete and accurate locality, ward, and Urban Local
                  Body (ULB) information for precise project location identification.`}
                </li>
                <li>
                  • Geo-location coordinates should be in standard
                  latitude/longitude format if available.
                </li>
                <li>
                  • Upload relevant supporting documents in accepted formats:
                  PDF, DOC, DOCX, JPG, PNG, XLS, XLSX.
                </li>
                <li>
                  • Maximum file size allowed is 10MB per document. Ensure all
                  documents are clearly readable.
                </li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-white mb-3">
                5. Important Notice:
              </p>
              <ul className="text-sm text-white space-y-2 ml-4">
                <li>
                  • The form will remain locked for submission until all
                  mandatory fields are properly completed.
                </li>
                <li>
                  • Sub-project details, if enabled, must include complete
                  information for each sub-project component.
                </li>
                <li>
                  • Review all entered information carefully before final
                  submission as modifications may require additional approvals.
                </li>
                <li>
                  • For technical assistance or clarifications, contact the
                  system administrator or concerned department.
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
