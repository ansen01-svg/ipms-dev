import {
  fetchDropdownOptions,
  type DropdownOptions,
} from "@/actions/create-project/fetchDropDownOptions";
import CreateProjectForm from "@/components/dashboard/new-project/create-project-form";
import PageHeader from "@/components/dashboard/new-project/page-header";

export default async function CreateProjectPage() {
  // Fetch dropdown options on the server
  const dropdownOptions: DropdownOptions = await fetchDropdownOptions();

  return (
    <div className="w-full mb-5 space-y-4 sm:space-y-6">
      {/* Main Content */}
      <div className="w-full">
        {/* Page Header */}
        <PageHeader />

        {/* Multi-Step Create Project Form */}
        <CreateProjectForm dropdownOptions={dropdownOptions} />
      </div>
    </div>
  );
}
