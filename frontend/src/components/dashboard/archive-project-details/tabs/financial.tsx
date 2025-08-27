import { Badge } from "@/components/ui/badge";
import { DbArchiveProject } from "@/types/archive-projects.types";
import { DollarSign, FileText, TrendingUp } from "lucide-react";

// Archive Financial Tab
interface ArchiveFinancialTabProps {
  project: DbArchiveProject;
}

function ArchiveFinancialTab({ project }: ArchiveFinancialTabProps) {
  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)} Cr`;
    }
    return `₹${(amount / 100000).toFixed(1)}L`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Financial Details
        </h3>
        <Badge className="bg-blue-50 text-blue-600 border-blue-200 text-xs">
          {project.financialProgress}% Financial Progress
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Financial Overview Cards */}
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-gray-900">AA Amount</h4>
            </div>
            <div className="text-2xl font-bold text-green-600 mb-1">
              {formatCurrency(project.AAAmount)}
            </div>
            <p className="text-xs text-green-600">Sanctioned Amount</p>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h4 className="font-medium text-gray-900">Work Value</h4>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-1">
              {formatCurrency(project.workValue)}
            </div>
            <p className="text-xs text-blue-600">Contract Value</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-gray-900">Bill Submitted</h4>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {formatCurrency(project.billSubmittedAmount)}
            </div>
            <p className="text-xs text-purple-600">Amount Claimed</p>
          </div>

          <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="h-5 w-5 text-orange-600" />
              <h4 className="font-medium text-gray-900">Remaining Work</h4>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {formatCurrency(project.remainingWorkValue)}
            </div>
            <p className="text-xs text-orange-600">Balance Amount</p>
          </div>
        </div>
      </div>

      {/* Financial Breakdown */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Financial Breakdown</h4>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="px-4 py-3 flex justify-between">
            <span className="text-sm text-gray-600">AA Amount</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(project.AAAmount)}
            </span>
          </div>
          <div className="px-4 py-3 flex justify-between">
            <span className="text-sm text-gray-600">Work Value</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(project.workValue)}
            </span>
          </div>
          <div className="px-4 py-3 flex justify-between">
            <span className="text-sm text-gray-600">Bill Submitted</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(project.billSubmittedAmount)}
            </span>
          </div>
          <div className="px-4 py-3 flex justify-between bg-gray-50">
            <span className="text-sm font-medium text-gray-900">
              Remaining Work Value
            </span>
            <span className="text-sm font-semibold text-gray-900">
              {formatCurrency(project.remainingWorkValue)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArchiveFinancialTab;
