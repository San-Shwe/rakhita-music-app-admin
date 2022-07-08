import React, { useEffect, useState } from "react";
import {
  ImSpinner11,
  ImEye,
  ImFilePicture,
  ImFileEmpty,
  ImSpinner3,
} from "react-icons/im";
import { uploadImage } from "../api/post";
import { useNotification } from "../context/NotificationProvider";
import MarkdownHints from "./MarkdownHints";

export const defaultPost = {
  title: "",
  content: "",
  featured: false,
  tags: "",
  meta: "",
  slug: "",
};

const PostForm = ({ onSubmit, initialPost }) => {
  const [postInfo, setPostInfo] = useState({ ...defaultPost });
  const [selectedThumbnailUrl, setSelectedThumbnailUrl] = useState("");
  const [imageUrlToCopy, setImageUrlToCopy] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [displayMarkdownHint, setDisplayMarkdownHint] = useState(false);

  const { title, content, featured, tags, meta } = postInfo;

  const { updateNotification } = useNotification();

  useEffect(() => {
    setPostInfo({ ...initialPost });
  }, [initialPost]);

  // form input sections handler
  const handleChange = ({ target }) => {
    const { value, name, checked } = target;
    console.log(name);
    if (name === "thumbnail") {
      const file = target.files[0];
      if (!file.type?.includes("image")) {
        return updateNotification("error", "This is not an image!");
      }
      setPostInfo({ ...postInfo, thumbnail: value });
      return setSelectedThumbnailUrl(URL.createObjectURL(file));
    }

    if (name === "featured") {
      localStorage.setItem(
        "blogPost",
        JSON.stringify({ ...postInfo, featured: checked })
      );
      return setPostInfo({ ...postInfo, [name]: checked });
    }

    if (name === "tags") {
      const newTags = tags?.split(", ");
      if (newTags.length > 4)
        updateNotification("warning", "Only Four Tag Allow");
    }

    if (name === "meta" && meta.length >= 149) {
      return setPostInfo({ ...postInfo, meta: value.substring(0, 149) });
    }

    const newPost = { ...postInfo, [name]: value };

    setPostInfo({ ...newPost }); // update current state info
    localStorage.setItem("blogPost", JSON.stringify(newPost));
  };

  // upload single image
  const handleImageUpload = async ({ target }) => {
    if (imageUploading) return;

    const file = await target.files[0];
    if (!file.type?.includes("image")) {
      return updateNotification("error", "this is not an image");
    }

    setImageUploading(true);
    const formData = new FormData();
    formData.append("image", file); // form data for backend api

    const { error, image } = await uploadImage(formData);
    setImageUploading(false); // upload is complete
    if (error) return updateNotification("image error", error);
    setImageUrlToCopy(image);
  };

  // copy image url to clipboard
  const handleOnCopy = () => {
    const textToCopy = `![add image description](${imageUrlToCopy})`;
    navigator.clipboard.writeText(textToCopy);
  };

  // Handle Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const { title, content, tags, meta } = postInfo; // i don't use Valitation here
    if (!title.trim()) return updateNotification("error", "Title is missing");
    if (!content.trim())
      return updateNotification("error", "Content is missing");
    if (!tags.trim()) return updateNotification("error", "Tags is missing");
    if (!meta.trim()) return updateNotification("error", "Meta is missing");

    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z ]/g, " ") // replace special character with space (' ')
      .split(" ")
      .filter((item) => item.trim()) // remove space
      .join("-");

    const newTags = tags
      .split(",")
      .map((item) => item.trim()) // remove space
      .splice(0, 4);

    const formData = new FormData();

    const finalPost = { ...postInfo, tags: JSON.stringify(newTags), slug };
    // contvert state data to form data to send backend api
    for (let key in finalPost) {
      console.log(key + " -> " + finalPost[key]);
      formData.append(key, finalPost[key]);
    }

    console.log("finalPost is ", finalPost);

    onSubmit(formData); // send data to it's parent component
  };

  return (
    <form className="space-x-2 flex flex-row" onSubmit={handleSubmit}>
      {/* ---------------------------------------------------left section---------------------------------------------------- */}
      <div className="w-9/12 h-screen space-y-3 flex flex-col">
        <div className="flex items-center justify-between">
          {/* Button Group Section */}
          {/* i use button tab's type to button because form difine every button to it submit button */}
          <h1 className="text-xl font-semibold text-gray-700">Create Post</h1>
          <div className="flex items-center space-x-10">
            <button
              type="button"
              className="flex justify-center items-center h-10 space-x-2 px-3 ring-1 ring-blue-500 rounded-md h text-blue-500 hover:text-white hover:bg-blue-500"
            >
              <ImSpinner11 />
              <span>Reset</span>
            </button>
            <button
              type="button"
              className="flex justify-center items-center h-10 space-x-2 px-3 ring-1 ring-blue-500 rounded-md h text-blue-500 hover:text-white hover:bg-blue-500"
            >
              <ImEye />
              <span>View</span>
            </button>
            <button className="flex justify-center items-center h-10 w-36 space-x-2 px-3 ring-1 rounded-md h text-white bg-blue-500 hover:text-blue-500 hover:bg-transparent">
              Post
            </button>
          </div>
        </div>
        {/* Featured Checkbox */}
        <div className="flex">
          <input
            name="featured"
            value={featured}
            onChange={handleChange}
            type="checkbox"
            id="featured"
            hidden
          />
          <label
            htmlFor="featured"
            className="flex items-center justify-start space-x-2 cursor-pointer select-none"
          >
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 flex items-center justify-center">
              {/* if featured is true, also true rounded chicle of radio button */}
              {featured && (
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </div>
            <span className="text-gray-700 ">Featured</span>
          </label>
        </div>
        {/* Title Input */}
        <input
          type="text"
          value={title}
          name="title"
          onChange={handleChange}
          onFocus={() => setDisplayMarkdownHint(false)}
          className="text outline-none focus:ring-1 rounded p-2 w-full font-semibold"
          placeholder="Post Title"
        />
        {/* Image Input Section */}
        <div className="flex space-x-2">
          <div>
            <input
              onChange={handleImageUpload}
              id="image-input"
              type="file"
              hidden
            />
            <label
              htmlFor="image-input"
              className=" flex justify-left items-center space-x-2 px-3 ring-1 ring-blue-500 rounded h-10 text-gray-500 hover:text-white hover:bg-gray-500 transition cursor-pointer"
            >
              <span>Place Image</span>
              {imageUploading ? (
                <ImSpinner3 className="animate-spin" />
              ) : (
                <ImFilePicture />
              )}
            </label>
          </div>
          {imageUrlToCopy && (
            <div className="flex-1 flex justify-between self-stretch bg-gray-500 rounded">
              <input
                type="text"
                value={imageUrlToCopy} // we have warning here
                className="bg-transparent px-2 w-full text-white"
                disabled
              />
              <button
                onClick={handleOnCopy}
                type="button"
                className="text-xs flex flex-col justify-center items-center bg-gray-700 self-stretch px-2 rounded text-white "
              >
                <ImFileEmpty />
                <span>copy</span>
              </button>
            </div>
          )}
        </div>
        {/* Text Area Section */}
        <textarea
          value={content}
          name="content"
          onChange={handleChange}
          onFocus={() => setDisplayMarkdownHint(true)}
          placeholder="## You can write your here!"
          className="resize-noneocus:ring-1 rounded p-2 w-full  outline-none flex-1 font-mono tracking-wide text-lg"
        ></textarea>
        {/* Tags Input section */}
        <div>
          <label className="text-gray-500" htmlFor="tags">
            Tags
          </label>
          <input
            value={tags}
            name="tags"
            type="text"
            id="tags"
            onChange={handleChange}
            className="text outline-none focus:ring-1 rounded p-2 w-full"
            placeholder="eg: blog, react, nodejs"
          />
        </div>
        {/* Meta Input section */}
        <div className="mb-12">
          <label className="text-gray-500" htmlFor="meta">
            Meta Description {meta?.length}/150
          </label>
          <textarea
            value={meta}
            name="meta"
            type="text"
            id="meta"
            onChange={handleChange}
            className="text outline-none focus:ring-1 rounded p-2 w-full"
            placeholder="whrite your description here..."
          ></textarea>
        </div>
      </div>
      {/* ---------------------------------------------------right section---------------------------------------------------- */}
      <div className="w-4/12 px-2 relative">
        <h1 className="text-xl font-semibold text-gray-700 mb-2">Thumbnail</h1>
        {/* thumbnail section  */}
        <div>
          <input
            name="thumbnail"
            id="thumbnail"
            onChange={handleChange}
            type="file"
            hidden
          />
          <label htmlFor="thumbnail" className="cursor-pointer">
            {/* show the thumbnail if user selected image from local file */}
            {selectedThumbnailUrl ? (
              <img
                src={selectedThumbnailUrl}
                className="shadow-sm rounded"
                alt=""
              />
            ) : (
              <div className="border border-dashed border-gray-500 aspect-video text-gray-500 flex flex-col justify-center items-center">
                <span>Select Thumbnail</span>
                <span className="text-xs">Recommended Size</span>
                <span className="text-xs">1280 * 720</span>
              </div>
            )}
          </label>
        </div>

        {/* MARKDOWN section  */}
        <div className="absolute top-1/2 -translate-y-1/2 ">
          {displayMarkdownHint && <MarkdownHints />}
        </div>
      </div>
    </form>
  );
};

export default PostForm;
