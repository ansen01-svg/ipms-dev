"use client";

import React, { useState } from "react";
import {
  Download,
  Plus,
  Trash2,
  Calculator,
  FileText,
  Home,
  BarChart3,
  Award,
  CheckCircle,
} from "lucide-react";

interface Measurement {
  id: number;
  description: string;
  no: number;
  length: number;
  width: number;
  height: number;
  total: number;
}

interface WorkItem {
  id: number;
  description: string;
  unit: string;
  measurements: Measurement[];
  totalQuantity: number;
}

const MeasurementBookSoftware = () => {
  const [activeTab, setActiveTab] = useState("project-info");
  const [projectInfo, setProjectInfo] = useState({
    nameOfWork: "",
    location: "",
    contractor: "",
    tenderAgreement: "",
    workOrderNo: "",
    aaFsNoDate: "",
    billSlNo: "",
    commencementDate: "",
    completionDate: "",
    measurementDate: "",
    mbNo: "",
  });

  const [workItems, setWorkItems] = useState([
    {
      id: 1,
      description:
        "Earth work in excavation by mechanical means (Hydraulic excavator) / manual means in foundation trenches",
      unit: "Cum",
      measurements: [
        {
          id: 1,
          description: "Footing",
          no: 8,
          length: 2,
          width: 2,
          height: 0.5,
          total: 32,
        },
      ],
      totalQuantity: 32,
    },
  ]);

  const addMeasurement = (itemIndex: number) => {
    const newMeasurement: Measurement = {
      id: Date.now(),
      description: "",
      no: 1,
      length: 0,
      width: 0,
      height: 0,
      total: 0,
    };

    const updatedItems: WorkItem[] = [...workItems];
    updatedItems[itemIndex].measurements.push(newMeasurement);
    setWorkItems(updatedItems);
  };

  const updateMeasurement = (
    itemIndex: number,
    measurementIndex: number,
    field: keyof Measurement,
    value: string | number
  ): void => {
    const updatedItems: WorkItem[] = [...workItems];
    const measurement: Measurement =
      updatedItems[itemIndex].measurements[measurementIndex];
    measurement[field] = value as never;

    // Auto-calculate total
    if (["no", "length", "width", "height"].includes(field)) {
      measurement.total =
        Number(measurement.no) *
        Number(measurement.length) *
        Number(measurement.width) *
        Number(measurement.height);
    }

    // Update item total
    updatedItems[itemIndex].totalQuantity = updatedItems[
      itemIndex
    ].measurements.reduce((sum, m) => sum + m.total, 0);

    setWorkItems(updatedItems);
  };

  const deleteMeasurement = (
    itemIndex: number,
    measurementIndex: number
  ): void => {
    const updatedItems: WorkItem[] = [...workItems];
    updatedItems[itemIndex].measurements.splice(measurementIndex, 1);
    updatedItems[itemIndex].totalQuantity = updatedItems[
      itemIndex
    ].measurements.reduce((sum, m) => sum + m.total, 0);
    setWorkItems(updatedItems);
  };

  const addWorkItem = () => {
    const newItem = {
      id: Date.now(),
      description: "",
      unit: "Cum",
      measurements: [],
      totalQuantity: 0,
    };
    setWorkItems([...workItems, newItem]);
  };

  const exportToExcel = () => {
    // Create CSV content
    let csvContent = "data:text/csv;charset=utf-8,";

    // Project Info
    csvContent += "PROJECT INFORMATION\n";
    Object.entries(projectInfo).forEach(([key, value]) => {
      csvContent += `${key
        .replace(/([A-Z])/g, " $1")
        .toUpperCase()},${value}\n`;
    });

    csvContent += "\nWORK ITEMS\n";
    csvContent += "Item,Unit,Description,No,Length,Width,Height,Total\n";

    workItems.forEach((item) => {
      item.measurements.forEach((measurement) => {
        csvContent += `"${item.description}",${item.unit},"${measurement.description}",${measurement.no},${measurement.length},${measurement.width},${measurement.height},${measurement.total}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "measurement_book.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  const tabs = [
    { id: "project-info", label: "Project Info", icon: Home },
    { id: "measurements", label: "Measurements", icon: Calculator },
    { id: "bills", label: "Bills", icon: FileText },
    { id: "progress", label: "Progress", icon: BarChart3 },
    { id: "certificate", label: "Certificate", icon: Award },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Measurement Book Software
              </h1>
              <p className="text-sm text-gray-600">
                Construction Project Management System
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={exportToExcel}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={printReport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Print Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Project Information Tab */}
        {activeTab === "project-info" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Project Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries({
                nameOfWork: "Name of Work",
                location: "Location",
                contractor: "Name of Contractor",
                tenderAgreement: "Tender Agreement",
                workOrderNo: "Work Order No",
                aaFsNoDate: "A.A. or F.S. No. and Date",
                billSlNo: "SL. No. of Bill",
                commencementDate: "Date of Commencement",
                completionDate: "Date of Completion",
                measurementDate: "Date of Measurement",
                mbNo: "M.B. No",
              }).map(([key, label]) => {
                const typedKey = key as keyof typeof projectInfo;
                return (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label}
                    </label>
                    <input
                      type={key.includes("Date") ? "date" : "text"}
                      value={projectInfo[typedKey]}
                      onChange={(e) =>
                        setProjectInfo({
                          ...projectInfo,
                          [typedKey]: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Measurements Tab */}
        {activeTab === "measurements" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                Work Item Measurements
              </h2>
              <button
                onClick={addWorkItem}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Work Item
              </button>
            </div>

            {workItems.map((item, itemIndex) => (
              <div key={item.id} className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Description
                    </label>
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const updated = [...workItems];
                        updated[itemIndex].description = e.target.value;
                        setWorkItems(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter work item description"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Unit
                    </label>
                    <select
                      value={item.unit}
                      onChange={(e) => {
                        const updated = [...workItems];
                        updated[itemIndex].unit = e.target.value;
                        setWorkItems(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Cum">Cum</option>
                      <option value="Sqm">Sqm</option>
                      <option value="Rmt">Rmt</option>
                      <option value="Nos">Nos</option>
                      <option value="Kg">Kg</option>
                      <option value="MT">MT</option>
                    </select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium text-gray-900">Measurements</h4>
                    <button
                      onClick={() => addMeasurement(itemIndex)}
                      className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Row
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            No.
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Length
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Width
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Height
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Total
                          </th>
                          <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {item.measurements.map(
                          (measurement, measurementIndex) => (
                            <tr key={measurement.id}>
                              <td className="px-3 py-2">
                                <input
                                  type="text"
                                  value={measurement.description}
                                  onChange={(e) =>
                                    updateMeasurement(
                                      itemIndex,
                                      measurementIndex,
                                      "description",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  placeholder="Item description"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={measurement.no}
                                  onChange={(e) =>
                                    updateMeasurement(
                                      itemIndex,
                                      measurementIndex,
                                      "no",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  step="0.01"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={measurement.length}
                                  onChange={(e) =>
                                    updateMeasurement(
                                      itemIndex,
                                      measurementIndex,
                                      "length",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  step="0.01"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={measurement.width}
                                  onChange={(e) =>
                                    updateMeasurement(
                                      itemIndex,
                                      measurementIndex,
                                      "width",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  step="0.01"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  value={measurement.height}
                                  onChange={(e) =>
                                    updateMeasurement(
                                      itemIndex,
                                      measurementIndex,
                                      "height",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                  step="0.01"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <span className="text-sm font-medium text-gray-900">
                                  {measurement.total.toFixed(3)}
                                </span>
                              </td>
                              <td className="px-3 py-2">
                                <button
                                  onClick={() =>
                                    deleteMeasurement(
                                      itemIndex,
                                      measurementIndex
                                    )
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <div className="bg-blue-50 px-4 py-2 rounded-lg">
                      <span className="text-sm font-medium text-blue-900">
                        Total Quantity: {item.totalQuantity.toFixed(3)}{" "}
                        {item.unit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bills Tab */}
        {activeTab === "bills" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Bill Generation
            </h2>
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Bill Generation Coming Soon
              </h3>
              <p>
                Automated bill generation based on measurement data will be
                available here.
              </p>
            </div>
          </div>
        )}

        {/* Progress Tab */}
        {activeTab === "progress" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Physical Progress Tracking
            </h2>
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Progress Tracking</h3>
              <p>
                Visual progress tracking and reporting tools will be available
                here.
              </p>
            </div>
          </div>
        )}

        {/* Certificate Tab */}
        {activeTab === "certificate" && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Completion Certificate
            </h2>
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Certificate Generation
              </h3>
              <p>
                Automated completion certificate generation will be available
                here.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            print-color-adjust: exact;
          }
        }
      `}</style>
    </div>
  );
};

export default MeasurementBookSoftware;
