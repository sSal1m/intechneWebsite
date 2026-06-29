'use client';

import { useState, useTransition } from 'react';
import { getAdminLogs, AdminLog } from '@/src/actions/admin-logs';
import { AuditAction } from '@/src/utils/supabase/log-types';
import { 
  Search, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Terminal, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Globe 
} from 'lucide-react';

interface LogsManagerProps {
  initialLogs: AdminLog[];
  initialTotalCount: number;
}

const LIMIT = 25;

export function LogsManager({ initialLogs, initialTotalCount }: LogsManagerProps) {
  const [logs, setLogs] = useState<AdminLog[]>(initialLogs);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [page, setPage] = useState<number>(1);
  const [selectedLog, setSelectedLog] = useState<AdminLog | null>(null);

  // Filter States
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [emailFilter, setEmailFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [isPending, startTransition] = useTransition();

  const totalPages = Math.ceil(totalCount / LIMIT);

  // Apply filters and pagination
  function fetchFilteredLogs(newPage: number, currentAction: string, currentEmail: string, currentStatus: string) {
    startTransition(async () => {
      const data = await getAdminLogs({
        page: newPage,
        limit: LIMIT,
        actionFilter: currentAction,
        emailFilter: currentEmail,
        statusFilter: currentStatus,
      });
      setLogs(data.logs);
      setTotalCount(data.totalCount);
      setPage(newPage);
    });
  }

  function handleFilterChange(type: 'action' | 'email' | 'status', value: string) {
    let nextAction = actionFilter;
    let nextEmail = emailFilter;
    let nextStatus = statusFilter;

    if (type === 'action') {
      setActionFilter(value);
      nextAction = value;
    } else if (type === 'email') {
      setEmailFilter(value);
      nextEmail = value;
    } else if (type === 'status') {
      setStatusFilter(value);
      nextStatus = value;
    }

    fetchFilteredLogs(1, nextAction, nextEmail, nextStatus);
  }

  function renderDiff(oldVal: Record<string, unknown> | null, newVal: Record<string, unknown> | null) {
    if (!oldVal || !newVal) return null;
    const allKeys = Array.from(new Set([...Object.keys(oldVal), ...Object.keys(newVal)]));
    const diffs = allKeys.filter(key => JSON.stringify(oldVal[key]) !== JSON.stringify(newVal[key]));

    if (diffs.length === 0) {
      return <p className="text-slate-500 text-xs">Hiçbir değer değişmedi.</p>;
    }

    return (
      <div className="flex flex-col gap-2">
        <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Değişen Değer Karşılaştırması</h4>
        <div className="bg-slate-950 border border-slate-800 rounded-xl divide-y divide-slate-900 overflow-hidden">
          {diffs.map(key => (
            <div key={key} className="p-3 text-xs flex flex-col sm:grid sm:grid-cols-12 gap-2">
              <span className="font-bold text-slate-400 sm:col-span-3 break-all">{key}</span>
              <div className="sm:col-span-9 flex flex-col gap-1">
                <div className="flex items-start gap-1 text-red-400 bg-red-500/5 px-2 py-1 rounded border border-red-500/10 break-all">
                  <span className="font-bold text-[9px] uppercase mr-1 flex-shrink-0 mt-0.5">Eski:</span>
                  <span>{JSON.stringify(oldVal[key])}</span>
                </div>
                <div className="flex items-start gap-1 text-emerald-400 bg-emerald-500/5 px-2 py-1 rounded border border-emerald-500/10 break-all">
                  <span className="font-bold text-[9px] uppercase mr-1 flex-shrink-0 mt-0.5">Yeni:</span>
                  <span>{JSON.stringify(newVal[key])}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 border border-slate-800 rounded-2xl">
        {/* Email Search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">E-posta</label>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={emailFilter}
              onChange={(e) => handleFilterChange('email', e.target.value)}
              placeholder="Arayın..."
              className="bg-slate-900/60 border border-slate-800 text-white rounded-xl pl-9 pr-4 py-2.5 text-xs focus:border-primary focus:outline-none w-full"
            />
          </div>
        </div>

        {/* Action Type Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">İşlem Tipi</label>
          <select
            value={actionFilter}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="bg-slate-900/60 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-primary focus:outline-none w-full appearance-none cursor-pointer"
          >
            <option value="ALL">Tüm İşlemler</option>
            {Object.values(AuditAction).map((action) => (
              <option key={action} value={action}>
                {action}
              </option>
            ))}
          </select>
        </div>

        {/* Status Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Durum</label>
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="bg-slate-900/60 border border-slate-800 text-white rounded-xl px-4 py-2.5 text-xs focus:border-primary focus:outline-none w-full appearance-none cursor-pointer"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      {logs.length === 0 ? (
        <div className="text-center py-12 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 text-sm">
          Filtrelere uygun işlem günlüğü bulunmamaktadır.
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-[#0c0c0c] text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">Tarih</th>
                  <th className="px-6 py-4">Yönetici / Kullanıcı</th>
                  <th className="px-6 py-4">İşlem</th>
                  <th className="px-6 py-4">Durum</th>
                  <th className="px-6 py-4">IP / Cihaz</th>
                  <th className="px-6 py-4 text-right">Performans</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {logs.map((log) => (
                  <tr 
                    key={log.id} 
                    onClick={() => setSelectedLog(log)}
                    className="hover:bg-slate-900/40 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                      {new Date(log.created_at).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">{log.user_email}</span>
                        {log.role && (
                          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                            {log.role}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-slate-200">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {log.status === 'SUCCESS' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          SUCCESS
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">
                          FAILED
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs text-slate-400 gap-0.5">
                        <span className="font-mono">{log.ip_address}</span>
                        <span className="text-[10px] text-slate-500">{log.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-xs text-slate-400">
                      {log.execution_time_ms.toFixed(2)} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-900 bg-slate-950/40 flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">
                Toplam {totalCount} kayıttan {(page - 1) * LIMIT + 1} - {Math.min(page * LIMIT, totalCount)} arası gösteriliyor
              </span>
              <div className="flex items-center gap-4">
                <span className="text-slate-400">
                  Sayfa <strong className="text-white">{page}</strong> / {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1 || isPending}
                    onClick={() => fetchFilteredLogs(page - 1, actionFilter, emailFilter, statusFilter)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    disabled={page === totalPages || isPending}
                    onClick={() => fetchFilteredLogs(page + 1, actionFilter, emailFilter, statusFilter)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 disabled:opacity-30 disabled:hover:bg-slate-900 rounded-lg border border-slate-800 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Deep JSON Inspector Drawer / Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedLog(null)} />

          {/* Panel */}
          <div className="w-full max-w-2xl h-full bg-slate-900 border-l border-slate-850 shadow-2xl relative z-10 flex flex-col text-slate-200">
            <header className="px-6 py-5 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-primary" />
                <div className="flex flex-col">
                  <h3 className="font-bold text-white text-base">İşlem Detayları</h3>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wide">{selectedLog.id}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedLog(null)} 
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {/* High-level Summary info */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">İşlemi Yapan</span>
                  <span className="text-white font-bold break-all">{selectedLog.user_email}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Tarih</span>
                  <span className="text-white font-semibold">{new Date(selectedLog.created_at).toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">Metrik</span>
                  <span className="text-white font-semibold flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    {selectedLog.execution_time_ms.toFixed(2)} ms
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">IP / Lokasyon</span>
                  <span className="text-white font-semibold flex items-center gap-1 break-all">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    {selectedLog.ip_address} ({selectedLog.location || 'Unknown'})
                  </span>
                </div>
                <div className="flex flex-col gap-1 col-span-2">
                  <span className="text-slate-500 font-bold uppercase tracking-wider">User Agent</span>
                  <span className="text-slate-300 font-mono text-[10px] break-all">{selectedLog.user_agent}</span>
                </div>
              </div>

              {/* FAILED Status details */}
              {selectedLog.status === 'FAILED' && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span className="font-bold text-xs uppercase tracking-wider">Hata Detayları</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-red-500/60 font-sans font-bold">Hata Sınıfı:</span>
                      <span>{selectedLog.error_name || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-red-500/60 font-sans font-bold">Hata Kodu:</span>
                      <span>{selectedLog.error_code || 'N/A'}</span>
                    </div>
                    <div className="flex flex-col gap-0.5 col-span-3">
                      <span className="text-red-500/60 font-sans font-bold">Hata Mesajı:</span>
                      <span className="break-all">{selectedLog.error_message || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Diff view for Updates */}
              {selectedLog.old_values && selectedLog.new_values && (
                renderDiff(selectedLog.old_values, selectedLog.new_values)
              )}

              {/* Details Metadata JSON */}
              {selectedLog.details && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">İşlem Konteksti (Details)</h4>
                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs overflow-x-auto text-slate-300 font-mono">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}

              {/* Old Values JSON */}
              {selectedLog.old_values && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Eski Değerler (Old Values)</h4>
                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs overflow-x-auto text-slate-300 font-mono">
                    {JSON.stringify(selectedLog.old_values, null, 2)}
                  </pre>
                </div>
              )}

              {/* New Values JSON */}
              {selectedLog.new_values && (
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-450 uppercase tracking-wider">Yeni Değerler (New Values)</h4>
                  <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs overflow-x-auto text-slate-300 font-mono">
                    {JSON.stringify(selectedLog.new_values, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Footer */}
            <footer className="px-6 py-4 border-t border-slate-800 bg-slate-950/20 flex justify-end gap-3">
              <button
                onClick={() => setSelectedLog(null)}
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-4 py-2 rounded-xl transition-colors text-xs"
              >
                Kapat
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
