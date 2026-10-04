export default function AnalyticsPage() {
  return (
    <div className="flex flex-col flex-1 p-12 bg-white font-sans">
      <main className="max-w-5xl w-full mx-auto">
        
        <h1 className="text-3xl font-medium mb-2 tracking-tight text-[#111111]">
          Analytics & Reports
        </h1>
        <p className="text-[#666666] mb-12">
          Track content performance and discover audience insights.
        </p>

        <div className="w-full border border-[#EAEAEA] rounded-2xl p-8 bg-[#FAFAFA] flex flex-col items-center justify-center min-h-[400px]">
          <svg className="mb-4 text-[#999999]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
          <h2 className="text-[#111111] font-medium text-lg mb-2">No data available yet</h2>
          <p className="text-[#666666] text-center max-w-sm mb-6">
            Upload your performance data (CSV/Excel) via the AI Command Center to start generating insights.
          </p>
          <button className="bg-[#111111] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-black/80 transition-colors">
            Upload Dataset
          </button>
        </div>

      </main>
    </div>
  );
}
