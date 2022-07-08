import React, { useEffect, useState } from "react";
import { createPost } from "../api/post";
import { useNotification } from "../context/NotificationProvider";
import PostForm, { defaultPost } from "./PostForm";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const { updateNotification } = useNotification();
  const [postInfo, setPostInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [resetAfterSubmit, setRestAfterSubmit] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, post } = await createPost(data);
    setBusy(false);
    if (error) return updateNotification("error", "error is : " + error);

    setRestAfterSubmit(true);
    navigate(`/update-post/${post.slug}`);
    return updateNotification("success", "Your Post is created");
  };

  // get the previous draft post
  useEffect(() => {
    const result = localStorage.getItem("blogPost");

    if (!result) return;

    const previousPost = JSON.parse(result);
    setPostInfo({ ...defaultPost, ...previousPost });
  }, []);

  return (
    <PostForm
      onSubmit={handleSubmit}
      initialPost={postInfo}
      busy={busy}
      postBtnTitle="Post"
      resetAfterSubmit={resetAfterSubmit}
    />
  );
}
