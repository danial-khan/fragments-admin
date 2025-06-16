"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faThumbsUp,
  faThumbsDown,
  faComments,
  faUsers,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { Fragment } from "./fragments";
import DOMPurify from "dompurify";
import usersHomePageURL from "../../config/index"

interface ShowFragmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  fragment?: Fragment;
}

const ShowFragmentModal: React.FC<ShowFragmentModalProps> = ({
  isOpen,
  onClose,
  fragment,
}) => {
  if (!isOpen || !fragment) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <a
            href={`${usersHomePageURL}/dashboard/fragment/${fragment._id}`}
            className="text-2xl font-bold text-secondary hover:underline hover:cursor-pointer"
            target="_blank"
            rel="noopener noreferrer"
          >
            {fragment.title}
          </a>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap gap-4 px-5 pt-4">
          {[
            {
              icon: faThumbsUp,
              label: "Upvotes",
              value: fragment.upvotes?.length,
            },
            {
              icon: faThumbsDown,
              label: "Downvotes",
              value: fragment.downvotes?.length,
            },
            {
              icon: faComments,
              label: "Replies",
              value: fragment.replies?.length,
            },
            {
              icon: faUsers,
              label: "Participants",
              value: fragment.subscriptionCount,
            },
            {
              icon: faEye,
              label: "Views",
              value: fragment.viewCount,
            },
          ].map(({ icon, label, value }) => (
            <div
              key={label}
              className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg shadow-sm"
            >
              <FontAwesomeIcon icon={icon} className="text-secondary" />
              <span className="text-sm font-medium text-gray-700">
                {value} {label}
              </span>
            </div>
          ))}
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5">
          <div className="flex flex-wrap md:flex-nowrap justify-between gap-6">
            <div className="flex-1 min-w-[140px]">
              <p className="text-md font-bold text-gray-700">Category</p>
              <p className="text-sm text-secondary mt-1">
                {fragment.category.name}
              </p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-md font-bold text-gray-700">Author</p>
              <p className="text-sm text-secondary mt-1">
                {fragment.author.name}
              </p>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-md font-bold text-gray-700">Status</p>
              <p className="text-sm text-secondary mt-1">{fragment.status}</p>
            </div>
            <div className="flex-1 min-w-[180px]">
              <p className="text-md font-bold text-gray-700">Created At</p>
              <p className="text-sm text-secondary mt-1">
                {new Date(fragment.createdAt).toLocaleString()}
              </p>
            </div>
            <div className="flex-1 min-w-[150px]">
              <p className="text-md font-bold text-gray-700">Updated At</p>
              <p className="text-sm text-secondary mt-1">
                {fragment.updatedAt
                  ? new Date(fragment.updatedAt).toLocaleString()
                  : "N/A"}
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="text-md font-bold text-gray-800">Description</p>
            <p className="text-base text-gray-800 mb-6">
              {fragment.description}
            </p>

            <p className="text-md font-bold text-gray-800">Content</p>
            <div
              className="mt-2 text-gray-700 line-clamp-15"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(fragment.content || ""),
              }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end p-5 border-t">
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

export default ShowFragmentModal;
