export default function Loading() {
  return (
    <div className="p-6 space-y-4">
      <div className="h-8 w-48 animate-pulse bg-gray-200 rounded" />
      <div className="h-4 w-64 animate-pulse bg-gray-200 rounded" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({length:4}).map((_,i)=>(
          <div key={i} className="h-28 animate-pulse bg-gray-100 rounded" />
        ))}
      </div>
    </div>
  );
}