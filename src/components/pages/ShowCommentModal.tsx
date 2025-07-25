"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faComment,
  faCommentDots,
  faComments,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Reply } from "../pages/comments/index";
import DOMPurify from "dompurify";
import usersHomePageURL from "../../config/index";
import clsx from "clsx";

interface ShowCommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  reply?: Reply | null;
}

const getDepthIcon = (depth: number) => {
  switch (depth) {
    case 1:
      return faComment;
    case 2:
      return faCommentDots;
    case 3:
      return faComments;
    default:
      return faComment;
  }
};

const getDepthLabel = (depth: number) => {
  switch (depth) {
    case 1:
      return "Top-level Comment";
    case 2:
      return "Reply to Comment";
    case 3:
      return "Nested Reply";
    default:
      return "Comment";
  }
};

const ShowCommentModal: React.FC<ShowCommentModalProps> = ({
  isOpen,
  onClose,
  reply,
}) => {
  if (!isOpen || !reply) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 my-8">
        <div className="flex justify-between items-center p-5 border-b">
          <div>
            <h2 className="text-xl font-bold text-secondary flex items-center gap-2">
              <FontAwesomeIcon icon={getDepthIcon(reply.depth)} />
              {getDepthLabel(reply.depth)}
            </h2>
            <p className="text-sm text-gray-500">in {reply.fragmentTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        <div className="p-5">
          <div className="mb-6">
            <div className="flex items-start gap-4">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
              <div>
                <h3 className="font-bold text-lg">{reply.authorName}</h3>
                <p className="text-gray-500 text-sm">
                  {new Date(reply.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(reply.content),
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-700 mb-2">Fragment Details</h4>
              <p className="mb-1">
                <span className="font-medium">Title:</span>{" "}
                {reply.fragmentTitle}
              </p>
              <p>
                <span className="font-medium">Category:</span> {reply.categoryName}
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-bold text-gray-700 mb-2">Reply Metadata</h4>
              <p className="mb-1">
                <span className="font-medium">Depth:</span> {reply.depth}
              </p>
              <p className="mb-1">
                <span className="font-medium">Status:</span>
                <span
                  className={clsx("ml-2 px-2 py-1 rounded", {
                    "bg-green-500 text-white": reply.status === "published",
                    "bg-red-500 text-white": reply.status === "blocked",
                  })}
                >
                  {reply.status}
                </span>
              </p>
              <p>
                <span className="font-medium">Parent:</span>
                {reply.parentReplyId ? " Nested reply" : " Top-level comment"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-5 border-t">
          <a
            href={`${usersHomePageURL}/dashboard/fragment/${reply.fragmentId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-600 hover:underline flex items-center gap-1"
          >
            View Full Fragment
            <FontAwesomeIcon icon={faArrowRight} />
          </a>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-secondary transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowCommentModal;
