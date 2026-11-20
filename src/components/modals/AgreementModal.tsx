import React from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AgreementModal: React.FC<AgreementModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>微信支付分扣款授权确认书</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 text-xs text-slate-600 space-y-3 overflow-y-auto leading-relaxed">
          <p className="font-semibold text-slate-800">
            尊敬的用户，欢迎使用谷家智能无人售货柜服务：
          </p>
          <p>
            1. <strong>免密代扣授权</strong>：在您点击确认授权后，系统将开通微信支付分「先享后付」服务。开门购物完成并闭门后，系统将依据柜内重力传感器及AI视觉摄像头比对识别的实际拿取商品种类与数量，通过微信支付接口直接发起免密代扣。
          </p>
          <p>
            2. <strong>扣款规则与限额</strong>：单次交易上限为人民币 200.00 元。若多次比对有异议或柜门异常超时未关闭，系统将即时锁定订单并推送人工复核。
          </p>
          <p>
            3. <strong>争议与退款保障</strong>：若遇商品错扣、漏拿或损坏，可在订单详情页点击「直接退款」或「联系客服」，款项将在核实后原路退回微信零钱/绑卡账户。
          </p>
          <p>
            4. <strong>数据安全说明</strong>：售货柜内摄像头仅用于取货过程商品行为识别，不采集或记录用户的人脸生物特征信息。
          </p>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            已阅读并理解
          </button>
        </div>
      </div>
    </div>
  );
};
