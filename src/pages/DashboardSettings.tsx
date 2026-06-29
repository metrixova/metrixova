import React from 'react';

export function DashboardSettings() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-metrix-surface p-6 border border-metrix-surface/50">
          <h2 className="text-xl font-display text-metrix-white mb-4">Account Settings</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-metrix-muted uppercase tracking-wider mb-2">Email</label>
              <div className="text-metrix-white rounded-2xl bg-metrix-bg/70 p-4 border border-metrix-surface">admin@metrixova.com</div>
            </div>
            <div>
              <label className="block text-xs font-mono text-metrix-muted uppercase tracking-wider mb-2">Organization</label>
              <div className="text-metrix-white rounded-2xl bg-metrix-bg/70 p-4 border border-metrix-surface">Metrixova Inc.</div>
            </div>
            <div>
              <label className="block text-xs font-mono text-metrix-muted uppercase tracking-wider mb-2">Member since</label>
              <div className="text-metrix-white rounded-2xl bg-metrix-bg/70 p-4 border border-metrix-surface">March 2024</div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-metrix-surface p-6 border border-metrix-surface/50">
          <h2 className="text-xl font-display text-metrix-white mb-4">Theme Settings</h2>
          <div className="space-y-5">
            <div className="rounded-2xl bg-metrix-bg/70 p-4 border border-metrix-surface">
              <h3 className="text-sm font-medium text-metrix-white mb-2">Theme</h3>
              <p className="text-metrix-muted text-sm">Toggle between light and dark mode to keep the dashboard comfortable in every environment.</p>
            </div>
            <div className="rounded-2xl bg-metrix-bg/70 p-4 border border-metrix-surface">
              <h3 className="text-sm font-medium text-metrix-white mb-2">Notifications</h3>
              <p className="text-metrix-muted text-sm">Email alerts are enabled for critical incidents, with a 3-minute response SLA.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-metrix-surface p-6 border border-metrix-surface/50">
        <h2 className="text-xl font-display text-metrix-white mb-4">Security & Access</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            { label: 'MFA', value: 'Enabled' },
            { label: 'Last login', value: '2 minutes ago' },
            { label: 'Active sessions', value: '3 devices' }
          ].map((item) => (
            <div key={item.label} className="rounded-2xl bg-metrix-bg/70 p-4 border border-metrix-surface">
              <div className="text-xs font-mono uppercase tracking-widest text-metrix-muted mb-2">{item.label}</div>
              <div className="text-lg font-medium text-metrix-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
