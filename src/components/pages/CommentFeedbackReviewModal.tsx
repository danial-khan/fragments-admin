"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faBrain,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import { CommentFeedbackReview } from "./CommentFeedbackReview";

interface CommentFeedbackReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiStatus?: string;
  feedback: any;
  summary?: string;
}

export const CommentFeedbackReviewModal: React.FC<CommentFeedbackReviewModalProps> = ({
  isOpen,
  onClose,
  aiStatus,
  feedback,
  summary,
}) => {
  if (!isOpen) return null;

  const hasFeedback = feedback && Object.keys(feedback).length > 0;
  const hasSummary = summary && summary.trim().length > 0;

  return (
    <div
      className="fixed inset-0 z-50 h-full flex items-center justify-center overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 my-8">
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg md:text-2xl font-bold text-secondary flex items-center gap-2">
            <FontAwesomeIcon icon={faBrain} className="text-purple-600" />
            AI Moderation Feedback (Reply)
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="p-6">
          {hasSummary && (
            <div className="mb-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
              <h3 className="font-semibold mb-1 text-gray-800">
                AI Review Summary:
              </h3>
              <p className="text-sm text-gray-700">{summary}</p>
            </div>
          )}

          {aiStatus === "rejected" ? (
            <CommentFeedbackReview feedback={feedback} />
          ) : !hasSummary ? (
            <div className="text-center border border-gray-200 bg-gray-50 p-6 rounded-md">
              <FontAwesomeIcon
                icon={faCircleInfo}
                className="text-rating mb-2"
                size="2x"
              />
              <p className="text-gray-800 font-semibold text-md mt-2">
                No AI feedback or summary available for this reply.
              </p>
              <p className="text-sm text-gray-600 mt-1">
                It may have been accepted automatically or has not yet been
                reviewed.
              </p>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end px-6 pb-6">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-accent text-white font-medium rounded-lg hover:bg-secondary transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentFeedbackReviewModal;
