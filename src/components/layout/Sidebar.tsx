import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  FileText,
  GitPullRequest,
  Download,
  History,
  BookOpen,
  Sparkles,
} from 'lucide-react';

export type ActiveTab =
  | 'overview'
  | 'inbox'
  | 'brief'
  | 'routing'
  | 'exports'
  | 'imports'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  reviewCount: number;
  totalRecords: number;
  usableCount: number;
  manualOverrideCount: number;
  staleCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  reviewCount,
  totalRecords,
  usableCount,
  manualOverrideCount,
  staleCount,
}) => {
  const navItems = [
    {
      id: 'overview' as ActiveTab,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'inbox' as ActiveTab,
      label: 'Conversation Inbox',
      icon: Inbox,
      badge: `${usableCount}/${totalRecords}`,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'brief' as ActiveTab,
      label: 'Manager Brief',
      icon: FileText,
      badge: 'Aug 21',
      badgeColor: 'bg-indigo-50 text-indigo-700',
    },
    {
      id: 'routing' as ActiveTab,
      label: 'Routing & Review',
      icon: GitPullRequest,
      badge: reviewCount > 0 ? `${reviewCount}` : null,
      badgeColor: staleCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800',
    },
    {
      id: 'exports' as ActiveTab,
      label: 'Exports',
      icon: Download,
      badge: 'ZIP',
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'imports' as ActiveTab,
      label: 'Import History',
      icon: History,
      badge: null,
    },
    {
      id: 'settings' as ActiveTab,
      label: 'Settings & Definitions',
      icon: BookOpen,
      badge: null,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
            S
          </div>
          <div>
            <div className="font-bold text-slate-900 tracking-tight text-sm flex items-center gap-1.5">
              SpendNest
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Revenue Intelligence</div>
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border border-slate-200/50 ${item.badgeColor}`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Live System Status card */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/70 m-3 rounded-xl border">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Storage Engine
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            IndexedDB
          </span>
        </div>
        <div className="space-y-1 text-xs text-slate-600">
          <div className="flex justify-between">
            <span>Unique Records:</span>
            <span className="font-semibold text-slate-900">{totalRecords}</span>
          </div>
          <div className="flex justify-between">
            <span>Usable Texts:</span>
            <span className="font-semibold text-slate-900">{usableCount}</span>
          </div>
          <div className="flex justify-between">
            <span>Manual Overrides:</span>
            <span className="font-semibold text-indigo-700">{manualOverrideCount}</span>
          </div>
          {staleCount > 0 && (
            <div className="flex justify-between text-rose-700 font-medium">
              <span>Stale Analysis:</span>
              <span className="font-bold">{staleCount}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
