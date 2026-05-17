export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-t-4 border-red-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-4 border-red-700 rounded-full animate-spin direction-reverse"></div>
        <div className="absolute inset-4 border-b-4 border-red-900 rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-red-500 font-mono tracking-widest animate-pulse">ANALYZING SYSTEMS...</p>
    </div>
  );
}
