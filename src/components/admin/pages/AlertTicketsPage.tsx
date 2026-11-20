import React, { useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  UserCheck,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { AlertTicket } from '../../../types/admin';

interface AlertTicketsPageProps {
  tickets: AlertTicket[];
  onUpdateTicket: (updated: AlertTicket) => void;
}

export const AlertTicketsPage: React.FC<AlertTicketsPageProps> = ({ tickets, onUpdateTicket }) => {
  const [filterSeverity, setFilterSeverity] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [activeTicket, setActiveTicket] = useState<AlertTicket | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const filteredTickets = tickets.filter((t) => {
    if (filterSeverity !== 'ALL' && t.severity !== filterSeverity) return false;
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    return true;
  });

  const handleResolveTicket = (ticket: AlertTicket) => {
    const updated: AlertTicket = {
      ...ticket,
      status: 'RESOLVED',
      resolutionNote: resolutionText || '现场工程师已排查恢复正常',
    };
    onUpdateTicket(updated);
    setActiveTicket(null);
    setResolutionText('');
  };

  const handleCloseTicket = (ticket: AlertTicket) => {
    const updated: AlertTicket = {
      ...ticket,
      status: 'CLOSED',
    };
    onUpdateTicket(updated);
    setActiveTicket(null);
  };

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">智能硬件告警与工单调度</h2>
          <p className="text-xs text-slate-500">
            柜体温度超标、持续开门未关、网络离线及重力传感器异常实时自动派工
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">严重级别：</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
            >
              <option value="ALL">全部级别</option>
              <option value="CRITICAL">紧急 (CRITICAL)</option>
              <option value="WARNING">重要 (WARNING)</option>
              <option value="INFO">提示 (INFO)</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">工单状态：</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
            >
              <option value="ALL">全部状态</option>
              <option value="PENDING">待指派</option>
              <option value="PROCESSING">处理中</option>
              <option value="RESOLVED">已解决</option>
              <option value="CLOSED">已关闭</option>
            </select>
          </div>
        </div>

        <div className="text-slate-400">
          共 <strong className="text-slate-800 font-mono">{filteredTickets.length}</strong> 条告警事件
        </div>
      </div>

      {/* Tickets Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">工单编号</th>
                <th className="py-2.5 px-3 font-semibold">告警类型</th>
                <th className="py-2.5 px-3 font-semibold text-center">严重级别</th>
                <th className="py-2.5 px-3 font-semibold">关联设备与网点</th>
                <th className="py-2.5 px-3 font-semibold">触发时间</th>
                <th className="py-2.5 px-3 font-semibold text-center">处理状态</th>
                <th className="py-2.5 px-3 font-semibold">处理人</th>
                <th className="py-2.5 px-3 font-semibold">处理记录 / 结论</th>
                <th className="py-2.5 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{t.ticketNo}</td>

                  <td className="py-3 px-3 font-semibold text-slate-800 flex items-center gap-1.5">
                    <ShieldAlert
                      className={`w-3.5 h-3.5 ${
                        t.severity === 'CRITICAL'
                          ? 'text-rose-600'
                          : t.severity === 'WARNING'
                          ? 'text-amber-500'
                          : 'text-blue-500'
                      }`}
                    />
                    <span>{t.type}</span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        t.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-rose-800'
                          : t.severity === 'WARNING'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {t.severity}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <div className="font-semibold text-slate-900">{t.deviceName}</div>
                    <div className="font-mono text-slate-400 text-[11px]">{t.deviceCode} · {t.storeName}</div>
                  </td>

                  <td className="py-3 px-3 font-mono text-slate-500 text-[11px]">{t.triggerTime}</td>

                  <td className="py-3 px-3 text-center">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                        t.status === 'RESOLVED' || t.status === 'CLOSED'
                          ? 'bg-emerald-50 text-emerald-700'
                          : t.status === 'PROCESSING'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {t.status === 'RESOLVED'
                        ? '已解决'
                        : t.status === 'CLOSED'
                        ? '已归档'
                        : t.status === 'PROCESSING'
                        ? '处理中'
                        : '待指派'}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-700 font-medium">{t.handlerName || '待指派'}</td>

                  <td className="py-3 px-3 text-slate-500 text-[11px] truncate max-w-[180px]">
                    {t.resolutionNote || '等待排查'}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setActiveTicket(t);
                        setResolutionText(t.resolutionNote || '');
                      }}
                      className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                    >
                      处置工单
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ticket Process Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-md w-full p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800">
                处理告警工单 ({activeTicket.ticketNo})
              </h3>
              <button onClick={() => setActiveTicket(null)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">异常类型</span>
                <span className="font-bold text-rose-600">{activeTicket.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">受影响终端</span>
                <span className="text-slate-800">{activeTicket.deviceCode} · {activeTicket.storeName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">发生时间</span>
                <span className="font-mono text-slate-700">{activeTicket.triggerTime}</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">现场处置情况说明：</label>
              <textarea
                rows={3}
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                placeholder="填写现场维修、重启或硬件更换处置说明..."
                className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                onClick={() => handleCloseTicket(activeTicket)}
                className="px-3.5 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg"
              >
                直接关闭工单
              </button>
              <button
                onClick={() => handleResolveTicket(activeTicket)}
                className="px-4 py-1.5 bg-[#ff6900] text-white rounded-lg font-semibold hover:bg-orange-600"
              >
                标记已解决
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
