import React, { useEffect, useState } from "react";
import { deletePost, getPosts } from "../api/post";
import { useSearch } from "../context/SearchProvider";
import CardPost from "./CardPost";
let pageNo = 0;
const POST_LIMIT = 6;

// get page number function
const getPaginationCount = (length) => {
  const devision = length / POST_LIMIT;
  // remove decimal point if the division is reminder point eg 1.3333
  if (devision % 1 !== 0) {
    return Math.floor(devision) + 1;
  }
  return devision;
};

const Home = () => {
  const { searchResult } = useSearch();
  const [posts, setPosts] = useState([]);
  const [totalPostCount, setTotalPostCount] = useState([]);

  const paginationCount = getPaginationCount(totalPostCount);
  const paginationArr = new Array(paginationCount).fill(" ");

  const fetchPosts = async () => {
    const { error, posts, postCount } = await getPosts(pageNo, POST_LIMIT);
    if (error) return console.log(error);
    console.log(posts);
    setPosts(posts);
    setTotalPostCount(postCount);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchMorePosts = (index) => {
    pageNo = index;
    fetchPosts();
  };

  const onHandleDelete = async ({ id }) => {
    const confirmed = window.confirm("Are you sure to Delete!");
    if (!confirmed) return;

    const { error, message } = await deletePost(id);

    if (error) return console.log(error);
    console.log(message);

    const newPosts = posts.filter((p) => p.id !== id);
    setPosts(newPosts);
  };

  return (
    <div>
      <div className="grid grid-cols-3 gap-3 pb-10">
        {/* return searchResul if there is search is performing */}
        {searchResult.length
          ? searchResult.map((post) => {
              return (
                <CardPost
                  key={post.id}
                  post={post}
                  onDeleteClick={() => onHandleDelete(post)}
                />
              );
            })
          : posts.map((post) => {
              return (
                <CardPost
                  key={post.id}
                  post={post}
                  onDeleteClick={() => onHandleDelete(post)}
                />
              );
            })}
      </div>
      {paginationArr.length > 1 && !searchResult.length ? (
        <div className="py-5 flex justify-center items-center space-x-3">
          {paginationArr.map((_, index) => {
            return (
              <button
                key={index}
                onClick={() => fetchMorePosts(index)}
                className={
                  index === pageNo
                    ? "text-blue-500 border-b-2 border-b-500 "
                    : "text-gray-500 "
                }
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Home;
