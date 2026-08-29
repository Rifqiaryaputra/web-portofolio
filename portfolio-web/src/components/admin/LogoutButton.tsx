"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LogoutButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded"
      >
        <i className="ri-logout-box-line mr-3"></i> Logout
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white border-2 border-black shadow-[8px_8px_0_0_#000] p-6 max-w-sm w-full relative">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              <i className="ri-close-line text-xl"></i>
            </button>

            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-14 w-14 rounded-full bg-red-400 border-2 border-black flex items-center justify-center mb-4 shadow-[4px_4px_0_0_#000]">
                <i className="ri-logout-box-r-line text-2xl text-title"></i>
              </div>
              <h3 className="font-bold text-title text-xl mb-1">
                Ready to leave?
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Are you sure you want to logout of the admin panel?
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 py-2 px-4 border-2 border-black font-bold text-black hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2 px-4 border-2 border-black font-bold bg-red-400 hover:bg-red-500 shadow-[4px_4px_0_0_#000]"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
