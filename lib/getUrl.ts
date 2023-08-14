import { storage } from "@/appwrite";

const getUrl = async (image: string) => {
  const lol = JSON.parse(image);
  const url = storage.getFilePreview(lol.bucketId, lol.fileId);

  return url;
};

export default getUrl;
