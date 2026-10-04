export default function CalendarPage() {
  return (
    <div className="flex flex-col flex-1 p-12 bg-white font-sans">
      <main className="max-w-5xl w-full mx-auto">
        
        <h1 className="text-3xl font-medium mb-2 tracking-tight text-[#111111]">
          Content Calendar
        </h1>
        <p className="text-[#666666] mb-12">
          Manage your production workflow and scheduled content.
        </p>

        <div className="w-full border border-[#EAEAEA] rounded-2xl p-8 bg-[#FAFAFA] flex flex-col items-center justify-center min-h-[400px]">
          <svg className="mb-4 text-[#999999]" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <h2 className="text-[#111111] font-medium text-lg mb-2">No upcoming content</h2>
          <p className="text-[#666666] text-center max-w-sm mb-6">
            You don't have any content scheduled. Ask the AI Command Center to add tasks or create a schedule for you.
          </p>
          <button className="bg-[#111111] text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-black/80 transition-colors">
            Create Schedule
          </button>
        </div>

      </main>
    </div>
  );
}
