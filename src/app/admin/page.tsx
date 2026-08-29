import { supabase } from "@/lib/supabase";

export const revalidate = 60;

export default async function AdminDashboard() {
  let toolsCount = 0;
  if (supabase) {
    const { count, error } = await supabase
      .from("tools")
      .select("*", { count: "exact", head: true });
    if (!error && count != null) toolsCount = count;
  }

  return (
    <section className="max-w-[1120px] mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-paper border-[2px] border-title p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-bold mb-1">
                Total Projects
              </p>
              <h3 className="text-4xl font-bold text-title">4</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary border-[2px] border-title flex items-center justify-center shadow-brutal">
              <i className="ri-macbook-line text-xl text-title"></i>
            </div>
          </div>
        </div>

        <div className="bg-paper border-[2px] border-title p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-bold mb-1">
                Skills Listed
              </p>
              <h3 className="text-4xl font-bold text-title">16</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-white border-[2px] border-title flex items-center justify-center shadow-brutal">
              <i className="ri-tools-line text-xl text-title"></i>
            </div>
          </div>
        </div>

        <div className="bg-paper border-[2px] border-title p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-bold mb-1">
                Experience
              </p>
              <h3 className="text-4xl font-bold text-title">2</h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary border-[2px] border-title flex items-center justify-center shadow-brutal">
              <i className="ri-briefcase-4-line text-xl text-title"></i>
            </div>
          </div>
        </div>

        <div className="bg-paper border-[2px] border-title p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-bold mb-1">
                Tools Listed
              </p>
              <h3 className="text-4xl font-bold text-title">
                {toolsCount || 0}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-white border-[2px] border-title flex items-center justify-center shadow-brutal">
              <i className="ri-terminal-window-line text-xl text-title"></i>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-paper border-[2px] border-title p-8">
        <h2 className="bg-primary text-title inline-block px-3 py-1 font-bold mb-6 text-base border-[2px] border-title">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center justify-center p-6 bg-white border-[2px] border-title shadow-brutal group text-center">
            <div className="h-12 w-12 rounded-full bg-primary border-[2px] border-title flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform">
              <i className="ri-add-circle-line text-xl text-title"></i>
            </div>
            <span className="font-bold text-title">Add New Project</span>
          </div>
          <div className="flex flex-col items-center justify-center p-6 bg-white border-[2px] border-title shadow-brutal group text-center">
            <div className="h-12 w-12 rounded-full bg-white border-[2px] border-title flex items-center justify-center mb-3 group-hover:-translate-y-1 transition-transform">
              <i className="ri-edit-box-line text-xl text-title"></i>
            </div>
            <span className="font-bold text-title">Update Profile</span>
          </div>
        </div>
      </div>
    </section>
  );
}