import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';

interface NoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  initialNote?: string;
  onSaveNote: (orderId: string, note: string) => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  isOpen,
  onClose,
  orderId,
  initialNote = '',
  onSaveNote,
}) => {
  const [noteText, setNoteText] = useState(initialNote);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2 text-slate-800 font-semibold text-sm">
            <FileText className="w-4 h-4 text-orange-500" />
            <span>添加/修改订单备注</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSaveNote(orderId, noteText);
            onClose();
          }}
          className="p-5 space-y-4"
        >
          <div className="text-xs text-slate-500">
            订单编号：<span className="font-mono text-slate-700">{orderId}</span>
          </div>

          <div>
            <textarea
              rows={4}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="请输入对此订单的内部备注意见（例如：已电话核实用户拿取情况、用户反馈冰镇不足等）..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:border-orange-500 text-slate-800 resize-none"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-sm"
            >
              保存备注
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
