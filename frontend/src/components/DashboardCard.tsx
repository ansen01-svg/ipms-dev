import StatusBadge from "./StatusBadge";

export default function DashboardCard() {
  const projects = [
    { name: "Bridge development project", district: "Dibrugarh", status: "Ongoing" },
    { name: "Road development project", district: "Nagaon", status: "Ongoing" },
    { name: "Building development project", district: "Sonitpur", status: "Done" },
  ];

  return (
    <div className="bg-white p-6 rounded shadow-sm">
      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">S.No.</th>
            <th className="p-2 border">Project Name</th>
            <th className="p-2 border">District</th>
            <th className="p-2 border">Status</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p, idx) => (
            <tr key={idx} className="border-t">
              <td className="p-2 border">{idx + 1}</td>
              <td className="p-2 border">{p.name}</td>
              <td className="p-2 border">{p.district}</td>
              <td className="p-2 border">
                <StatusBadge status={p.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
