export default function SendMessageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700/50 rounded w-48 mb-2"></div>
          <div className="h-4 bg-slate-700/30 rounded w-96"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse"></div>
            <div className="h-96 bg-slate-800/50 rounded-lg animate-pulse"></div>
          </div>
          <div className="h-64 bg-slate-800/50 rounded-lg animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
