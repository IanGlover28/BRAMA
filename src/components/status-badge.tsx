const STATUS_CLASSES: Record<string, string> = {
  PAID: "bg-green-100 text-green-700",
  APPROVED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-gray-200 text-gray-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  FAILED: "bg-red-100 text-red-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function StatusBadge({
  status,
  label = status,
}: {
  status: string;
  label?: string;
}) {
  return (
    <span
      className={`shrink-0 text-xs font-semibold px-2.5 py-1 rounded-full ${
        STATUS_CLASSES[status] ?? "bg-gray-100 text-gray-600"
      }`}
    >
      {label}
    </span>
  );
}