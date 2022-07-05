import React from "react";
import dateformat from "dateformat";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
export default function CardPost({ post, onDeleteClick }) {
  if (!post) return null;
  const { title, thumbnail, tags, meta, createdAt, slug } = post;
  return (
    <div className="bg-white shadow-lg rounded flex flex-col">
      <div className="object-fill flex justify-center bg-pink-100 rounded-sm">
        <img
          src={thumbnail || "./icon.png"}
          alt={title}
          className="object-cover h-48 w-56"
        />
      </div>
      <div className="p-2 flex-1 flex flex-col justify-between">
        <h1 className="text-lg font-semibold text-gray-700">{title}</h1>
        <p className="text-gray-500">{meta.substring(0, 80) + "..."}</p>
        <div className="flex justify-between">
          <p className="text-gray-500 text-sm">
            {dateformat(createdAt, "mediumDate")}
          </p>
          <p className="text-gray-500 text-sm">{tags.join(", ")}</p>
        </div>
        <div className="flex space-x-3 py-2">
          <Link
            to={`/update-post/${slug}`}
            className="w-8 h-8 rounded-full bg-blue-400 hover:bg-blue-600 flex justify-center items-center text-white"
          >
            <BsPencilSquare size={20} />
          </Link>
          <button
            onClick={onDeleteClick}
            className="w-8 h-8 rounded-full bg-red-400 hover:bg-red-600 flex justify-center items-center text-white"
          >
            <BsTrash size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
