import React, { useState } from "react";
import {
  User,
  Bell,
  Moon,
  Sun,
  Shield,
  Trash2,
  Save,
} from "lucide-react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold">Settings</h1>
          <p className="text-gray-400 mt-2">
            Manage your account preferences and application settings.
          </p>
        </div>

        {/* Profile Section */}
        <div className="bg-[#1e293b] rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <User className="text-cyan-400" />
            <h2 className="text-2xl font-semibold">Profile</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 text-gray-300">Full Name</label>
              <input
                type="text"
                placeholder="Anupama V Nair"
                className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">Email</label>
              <input
                type="email"
                placeholder="anupamanair2224@gmail.com"
                className="w-full bg-[#0f172a] border border-slate-600 rounded-xl px-4 py-3 outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-[#1e293b] rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <Bell className="text-cyan-400" />
            <h2 className="text-2xl font-semibold">Preferences</h2>
          </div>

          <div className="space-y-5">
            {/* Notifications */}
            <div className="flex items-center justify-between bg-[#0f172a] p-4 rounded-xl">
              <div>
                <h3 className="font-medium">Notifications</h3>
                <p className="text-sm text-gray-400">
                  Receive interview updates and reminders
                </p>
              </div>

              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-14 h-7 rounded-full transition-all ${
                  notifications ? "bg-cyan-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`h-6 w-6 bg-white rounded-full transition-all ${
                    notifications ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode */}
            <div className="flex items-center justify-between bg-[#0f172a] p-4 rounded-xl">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="text-cyan-400" />
                ) : (
                  <Sun className="text-yellow-400" />
                )}

                <div>
                  <h3 className="font-medium">Dark Mode</h3>
                  <p className="text-sm text-gray-400">
                    Toggle application appearance
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-14 h-7 rounded-full transition-all ${
                  darkMode ? "bg-cyan-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`h-6 w-6 bg-white rounded-full transition-all ${
                    darkMode ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="bg-[#1e293b] rounded-2xl p-6 mb-6 border border-slate-700">
          <div className="flex items-center gap-3 mb-5">
            <Shield className="text-cyan-400" />
            <h2 className="text-2xl font-semibold">Security</h2>
          </div>

          <button className="bg-cyan-500 hover:bg-cyan-600 transition px-5 py-3 rounded-xl font-medium">
            Change Password
          </button>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-950/30 border border-red-500 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Trash2 className="text-red-400" />
            <h2 className="text-2xl font-semibold text-red-400">
              Danger Zone
            </h2>
          </div>

          <button className="bg-red-500 hover:bg-red-600 transition px-5 py-3 rounded-xl font-medium">
            Delete Account
          </button>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 transition px-6 py-3 rounded-xl font-semibold">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;