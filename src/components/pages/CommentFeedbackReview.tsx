import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInfoCircle,
  faLightbulb,
  faWandMagicSparkles,
} from "@fortawesome/free-solid-svg-icons";

interface Issue {
  flagged: boolean;
  notes?: string;
  reason?: string;
  examples?: string[];
  phrases?: string[];
  suggestions?: string[];
}

interface CommentFeedback {
  abusive?: Issue;
  harshTone?: Issue;
  misinformation?: Issue;
  spam?: Issue;
  unethical?: Issue;
}

interface Props {
  feedback: CommentFeedback;
}

export const CommentFeedbackReview: React.FC<Props> = ({ feedback }) => {
  if (!feedback) return null;

  const renderIssue = (
    label: string,
    issue?: Issue,
    noteKey: "notes" | "reason" = "notes",
    matchKey?: "phrases"
  ) => {
    if (!issue?.flagged) return null;

    return (
      <div className="border border-red-200 bg-red-50 p-4 rounded-md mb-4">
        <p className="font-semibold text-red-700 flex items-center gap-2 mb-1">
          <FontAwesomeIcon icon={faInfoCircle} />
          {label}
        </p>

        {issue[noteKey] && (
          <p className="text-sm text-gray-700">{issue[noteKey]}</p>
        )}

        {Array.isArray(issue.examples) && issue.examples.length > 0 && (
          <div className="mt-2">
            <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <FontAwesomeIcon icon={faLightbulb} className="text-yellow-500" />
              Examples:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
              {issue.examples.map((ex, idx) => (
                <li key={idx}>{ex}</li>
              ))}
            </ul>
          </div>
        )}

        {matchKey &&
          Array.isArray(issue[matchKey]) &&
          issue[matchKey]!.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-800 flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-blue-500"
                />
                Flagged Phrases:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
                {issue[matchKey]!.map((m, idx) => (
                  <li key={idx} className="italic text-gray-600">
                    ❝{m}❞
                  </li>
                ))}
              </ul>
            </div>
          )}

        {Array.isArray(issue.suggestions) && issue.suggestions.length > 0 && (
          <div className="mt-3">
            <p className="font-medium text-sm text-gray-800 flex items-center gap-2">
              <FontAwesomeIcon
                icon={faWandMagicSparkles}
                className="text-green-500"
              />
              Suggestions:
            </p>
            <ul className="list-disc list-inside text-sm text-gray-700 mt-1">
              {issue.suggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="text-sm text-gray-800 space-y-4">
      <div className="bg-red-100 text-red-800 p-3 rounded-md border border-red-200">
        <p className="font-semibold">This comment was blocked due to:</p>
      </div>

      {renderIssue("Abusive or offensive language", feedback.abusive)}
      {renderIssue(
        "Harsh or disrespectful tone",
        feedback.harshTone,
        "notes",
        "phrases"
      )}
      {renderIssue("Misinformation", feedback.misinformation)}
      {renderIssue("Spam or irrelevant content", feedback.spam, "reason")}
      {renderIssue("Unethical or inappropriate advice", feedback.unethical)}
    </div>
  );
};
