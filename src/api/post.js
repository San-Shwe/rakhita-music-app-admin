import client from "./client";

export const getPosts = async (pageNo, limit) => {
  try {
    const { data } = await client(
      `/post/posts?pageNo=${pageNo}&limit=${limit}`
    );
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const deletePost = async (postId) => {
  try {
    const { data } = await client.delete(`/post/${postId}`);
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const searchPost = async (query) => {
  try {
    const { data } = await client(`/post/search?title=${query}`); // default is get
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const uploadImage = async (formData) => {
  try {
    const { data } = await client.post(`/post/upload-image`, formData); // default is get
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};

export const createPost = async (formData) => {
  try {
    const { data } = await client.post(`/post/create`, formData);
    console.log(data);
    return data;
  } catch (error) {
    const { response } = error;
    // return backend api error
    if (response?.data) {
      return response.data;
    }
    return { error: error.message || error };
  }
};
