export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-purple-900">
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded w-64 mb-2"></div>
          <div className="h-4 bg-slate-700 rounded w-96 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-slate-700 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-slate-700 rounded w-24 mb-1"></div>
                    <div className="h-3 bg-slate-700 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-3 bg-slate-700 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
