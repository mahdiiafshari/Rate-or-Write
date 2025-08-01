import api from "./base.js";

export const getCollections = () => api.get("posts/collections/");
export const createCollection = (data) => api.post("posts/collections/create/", data);
export const addToCollection = (collectionId, postId) => {
    return api.post(`posts/collections/${collectionId}/add/`, { post_id: postId });
};
