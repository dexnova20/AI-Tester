interface StatusBadgeProps {
  status: "queued" | "running" | "completed" | "error" | string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  let colorClass = "bg-gray-500 text-gray-100 border-gray-400";
  
  if (status === "running") colorClass = "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]";
  if (status === "completed") colorClass = "bg-green-500/20 text-green-400 border-green-500/50 shadow-[0_0_10px_rgba(34,197,94,0.2)]";
  if (status === "error") colorClass = "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]";

  return (
    <span className={`px-3 py-1 uppercase text-xs font-bold tracking-widest rounded-full border ${colorClass}`}>
      {status}
    </span>
  );
}
