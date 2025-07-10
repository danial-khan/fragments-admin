import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";

interface IssueFeedback {
  flagged?: boolean;
  similarityScore?: number;
  notes?: string;
  examples?: string[];
  matches?: string[];
  suggestions?: string[];
}

export interface FragmentAIReviewFeedback {
  misinformation?: IssueFeedback;
  unethical?: IssueFeedback;
  plagiarism?: IssueFeedback;
  abusive?: IssueFeedback;
}

interface FragmentFeedbackReviewProps {
  feedback?: FragmentAIReviewFeedback;
  aiStatus?: string;
}

export const FragmentFeedbackReview: React.FC<FragmentFeedbackReviewProps> = ({
  feedback,
  aiStatus,
}) => {
  if (!feedback) return null;

  const renderIssue = (label: string, issue?: IssueFeedback) => {
    if (!issue) return null;
    if (!issue.flagged && !(issue.similarityScore ?? 0 > 0.5)) return null;

    return (
      <div
        key={label}
        className="border border-red-200 bg-red-50 p-4 rounded-md mb-4"
      >
        <p className="font-semibold text-red-700 flex items-center gap-2 mb-1">
          <FontAwesomeIcon icon={faInfoCircle} />
          {label}
        </p>

        {issue.notes && <p className="text-sm text-gray-700">{issue.notes}</p>}

        {issue.examples?.length ? (
          <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
            {issue.examples.map((ex, idx) => (
              <li key={idx}>{ex}</li>
            ))}
          </ul>
        ) : null}

        {issue.matches?.length ? (
          <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
            {issue.matches.map((m, idx) => (
              <li key={idx} className="italic text-gray-600">
                ❝{m}❞
              </li>
            ))}
          </ul>
        ) : null}

        {issue.suggestions?.length ? (
          <div className="mt-3">
            <p className="font-medium text-sm text-gray-800">Suggestions:</p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
              {issue.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="text-sm text-gray-800 space-y-4">
      {aiStatus === "rejected" ? (
        <div className="bg-red-100 text-red-800 p-3 rounded-md border border-red-200">
          <p className="font-semibold">
            This fragment was blocked due to content violations:
          </p>
        </div>
      ) : (
        <div className="bg-red-100 text-green-800 p-3 rounded-md border border-red-200">
          <p className="font-semibold">
            This fragment passed moderation but includes areas for improvement:
          </p>
        </div>
      )}

      {renderIssue("Misinformation", feedback.misinformation)}
      {renderIssue("Unethical Advice", feedback.unethical)}
      {renderIssue("Plagiarism", feedback.plagiarism)}
      {renderIssue("Abusive Language", feedback.abusive)}
    </div>
  );
};
