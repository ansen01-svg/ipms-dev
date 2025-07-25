import CreateProjectForm from "@/components/create-project/create-project-form";
import PageHeader from "@/components/create-project/page-header";
import BreadCrumbHolder from "@/components/create-project/breadcrumb-holder";
import {
  fetchDropdownOptions,
  type DropdownOptions,
} from "@/actions/create-project/fetchDropDownOptions";

export default async function CreateProjectPage() {
  // Fetch dropdown options on the server
  const dropdownOptions: DropdownOptions = await fetchDropdownOptions();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <div className="sm:max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb Navigation */}
        <BreadCrumbHolder />

        {/* Page Header */}
        <PageHeader />

        {/* Multi-Step Create Project Form */}
        <CreateProjectForm dropdownOptions={dropdownOptions} />
      </div>
    </div>
  );
}
