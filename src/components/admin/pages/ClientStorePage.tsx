import React, { useState } from 'react';
import {
  Building2,
  Store,
  Key,
  Webhook,
  Users,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Plus,
} from 'lucide-react';
import { ClientStore } from '../../../types/admin';

interface ClientStorePageProps {
  clients: ClientStore[];
  onUpdateClient: (updated: ClientStore) => void;
}

export const ClientStorePage: React.FC<ClientStorePageProps> = ({ clients, onUpdateClient }) => {
  const [activeTab, setActiveTab] = useState<'clients' | 'stores' | 'api' | 'roles'>('clients');
  const [selectedClient, setSelectedClient] = useState<ClientStore>(clients[0]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const roles = [
    { name: '平台超级管理员', code: 'PLATFORM_ADMIN', desc: '拥有系统所有功能、设备控制、客户开户与底层配置权限', usersCount: 3 },
    { name: '客户管理员', code: 'CLIENT_ADMIN', desc: '管理所属客户名下所有门店、售卖柜、查看销售及财务结算', usersCount: 12 },
    { name: '门店管理员', code: 'STORE_MANAGER', desc: '管理单店柜机、监控缺货、接收补货通知及现场简单排障', usersCount: 28 },
    { name: '移动补货专员', code: 'RESTOCKER', desc: '使用手机端扫码开柜、物料上架核验、实补数量录入与破损登记', usersCount: 45 },
    { name: '财务只读人员', code: 'FINANCE_READONLY', desc: '仅允许查阅流水订单、结算报表与库存对账流水，不可控制设备', usersCount: 6 },
  ];

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight">客户、门店网点与多租户权限</h2>
          <p className="text-xs text-slate-500">
            连锁品牌组织架构、开放平台 API 凭证、事件 Webhook 推送地址与 RBAC 权限矩阵
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white px-3 border-b border-slate-200 flex items-center gap-2 text-xs font-semibold rounded-t-xl">
        {[
          { id: 'clients', label: '合作客户列表' },
          { id: 'stores', label: '网点门店分布' },
          { id: 'api', label: 'API 密钥与 Webhook 配置' },
          { id: 'roles', label: 'RBAC 角色权限体系' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 px-3 relative transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Clients */}
      {activeTab === 'clients' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">客户名称</th>
                <th className="py-2.5 px-3 font-semibold">商务负责人</th>
                <th className="py-2.5 px-3 font-semibold">联系电话</th>
                <th className="py-2.5 px-3 font-semibold text-right">已铺设售货柜</th>
                <th className="py-2.5 px-3 font-semibold text-right">下辖门店数</th>
                <th className="py-2.5 px-3 font-semibold text-center">API对接状态</th>
                <th className="py-2.5 px-3 font-semibold text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 font-bold text-slate-900">{c.name}</td>
                  <td className="py-3 px-3 text-slate-700">{c.contactPerson}</td>
                  <td className="py-3 px-3 font-mono text-slate-600">{c.phone}</td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-orange-600">
                    {c.devicesCount} 台
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">
                    {c.stores.length} 家
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                      已打通免密代扣
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedClient(c);
                        setActiveTab('api');
                      }}
                      className="text-orange-600 hover:text-orange-700 font-semibold cursor-pointer"
                    >
                      配置对接
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Stores */}
      {activeTab === 'stores' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3 font-semibold">门店名称</th>
                <th className="py-2.5 px-3 font-semibold">所属品牌客户</th>
                <th className="py-2.5 px-3 font-semibold">详细物理地址</th>
                <th className="py-2.5 px-3 font-semibold text-right">在运设备</th>
                <th className="py-2.5 px-3 font-semibold text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.flatMap((c) =>
                c.stores.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900">{s.name}</td>
                    <td className="py-3 px-3 text-slate-700">{c.name}</td>
                    <td className="py-3 px-3 text-slate-500">{s.address}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-800">
                      {s.devicesCount} 台
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium">
                        正常运营
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: API & Webhooks */}
      {activeTab === 'api' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-sm text-slate-800">
                开放平台 API 凭证与 Webhook 事件订阅
              </h3>
              <p className="text-slate-500 mt-0.5">当前选中客户：{selectedClient.name}</p>
            </div>
            <select
              value={selectedClient.id}
              onChange={(e) => {
                const c = clients.find((item) => item.id === e.target.value);
                if (c) setSelectedClient(c);
              }}
              className="p-1.5 border border-slate-200 rounded-lg bg-slate-50 font-medium"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-3 max-w-2xl">
            <div>
              <label className="block text-slate-600 mb-1 font-medium">应用接入 AppId：</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={selectedClient.apiConfig.appId}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedClient.apiConfig.appId);
                    showToast('已复制 AppId');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
                >
                  复制
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">签名密钥 AppSecret：</label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value={selectedClient.apiConfig.appSecret}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-slate-800"
                />
                <button
                  onClick={() => {
                    navigator.clipboard?.writeText(selectedClient.apiConfig.appSecret);
                    showToast('已复制 AppSecret');
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
                >
                  复制
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 mb-1 font-medium">
                交易/开门事件 Webhook 回调地址：
              </label>
              <input
                type="text"
                defaultValue={selectedClient.apiConfig.webhookUrl}
                className="w-full p-2 border border-slate-200 rounded-lg font-mono text-slate-800"
              />
              <span className="text-[11px] text-slate-400 mt-1 block">
                柜机完成消费者闭门代扣后，系统将在 500ms 内向此地址推送订单扣款凭证 JSON。
              </span>
            </div>

            <div className="pt-2">
              <button
                onClick={() => showToast('已成功向目标 Webhook 发送心跳 Ping 测试包 (HTTP 200 OK)')}
                className="px-4 py-2 bg-[#ff6900] text-white rounded-lg font-semibold hover:bg-orange-600 cursor-pointer"
              >
                测试 Webhook 推送
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Roles */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-slate-200 p-4 shadow-xs">
          <div className="space-y-3">
            {roles.map((r) => (
              <div
                key={r.code}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold text-slate-900 text-xs">{r.name}</span>
                    <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                      {r.code}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{r.desc}</p>
                </div>
                <div className="text-right text-xs">
                  <span className="font-bold text-slate-900 font-mono">{r.usersCount}</span>
                  <span className="text-slate-400 ml-1">名授权用户</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-in slide-in-from-bottom duration-150">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
