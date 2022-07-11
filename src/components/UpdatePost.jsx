import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost } from "../api/post";
import PostForm from "./PostForm";
import { useNotification } from "../context/NotificationProvider";
import { updatePost } from "../api/post";
import NotFound from "./NotFound";

const UpdatePost = () => {
  const { slug } = useParams();
  const { updateNotification } = useNotification();
  const [notFound, setNotFound] = useState(false);
  const [postInfo, setPostInfo] = useState(null);
  const [busy, setBusy] = useState(false);
  const [resetAfterSubmit, setRestAfterSubmit] = useState(true);

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, post } = await updatePost(postInfo.id, data);
    setBusy(false);
    if (error) return updateNotification("error", "error on update : " + error);

    setRestAfterSubmit(true);
    // navigate(`/update-post/${post.slug}`);
    setPostInfo({ ...post, tags: post.tags?.join(", ") });
    return updateNotification("success", "Your Post is Updated");
  };

  const fetchPost = async () => {
    const { error, post } = await getPost(slug);

    if (error) {
      setNotFound(true);
      return updateNotification("error", error);
    }

    // if there is no error
    setPostInfo({ ...post, tags: post.tags?.join(", ") });
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (notFound) return <NotFound />;

  return (
    <PostForm
      onSubmit={handleSubmit}
      busy={busy}
      initialPost={postInfo}
      resetAfterSubmit
      postBtnTitle="Update"
    />
  );
};

export default UpdatePost;
