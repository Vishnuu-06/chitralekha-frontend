import React, { useState } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { safetyService } from '../services/safetyService';
import { useAuth } from '../context/AuthContext';

interface ReportModalProps {
  reportedType: 'POST' | 'COMMENT' | 'REVIEW' | 'USER';
  targetId: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ reportedType, targetId, isOpen, onClose }) => {
  const { user, openAuthModal } = useAuth();
  const [reason, setReason] = useState<string>('Harassment or abusive language');
  const [details, setDetails] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal();
      return;
    }

    setSubmitting(true);
    try {
      await safetyService.submitReport({
        reportedType,
        targetId,
        reason,
        details: details.trim(),
      });
      alert('Report submitted for moderator review. Thank you for helping keep Chitra Lekha thoughtful.');
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  const reasonOptions = [
    'Harassment or abusive language',
    'Unmarked major plot spoilers',
    'Spam, advertising, or self-promotion',
    'Hate speech or discriminatory remarks',
    'Plagiarism or stolen review',
    'Other safety or policy concern',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-[#1b2228] w-full max-w-md border border-[#2c3440] rounded-[3px] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 text-[#99aabb]">
        <div className="px-5 py-4 border-b border-[#2c3440] flex items-center justify-between bg-[#14181c]">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-[#ff8000]" />
            <h3 className="text-base font-extrabold uppercase tracking-wider text-white">Report Content</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8899aa] hover:text-white rounded-[2px]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-xs text-[#8899aa] leading-relaxed">
            Chitra Lekha values respectful, thoughtful discussions. Please tell us why you are reporting this {reportedType.toLowerCase()}.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
              Reason
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
            >
              {reasonOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8899aa] mb-1">
              Context &amp; Details (Optional)
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Provide any additional context for our team..."
              className="w-full px-3 py-2 text-xs border border-[#2c3440] rounded-[3px] bg-[#14181c] text-white focus:outline-none focus:border-[#00e054]"
            />
          </div>

          <div className="pt-2 border-t border-[#2c3440] flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs text-[#8899aa] hover:text-white rounded-[2px]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-red-800 hover:bg-red-700 rounded-[3px] transition-colors shadow-md disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
