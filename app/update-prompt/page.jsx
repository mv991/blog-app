"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Form from "@components/Form";
import crypto from "crypto";
import axios from "axios";
function page() {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "" });
  const [files, setFiles] = useState([]);
  const [addedFiles, setAddedFiles] = useState([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const promptId = searchParams.get("id");
  const generateSHA1 = (data) => {
    const hash = crypto.createHash("sha1");
    hash.update(data);
    return hash.digest("hex");
  };

  const generateSignature = (public_id, apiSecret) => {
    const timestamp = new Date().getTime();
    return `public_id=${public_id}&timestamp=${timestamp}${apiSecret}`;
  };
  const DeleteFiles = (filesToDelete) => {
    filesToDelete?.map(async (file) => {
      const cloudName = "dft1xk7ug";
      const timestamp = new Date().getTime();
      const apiKey = "838367291653923";
      const apiSecret = "2So8RDoxffRoFTIED9fPM8VPunc";
      const signature = generateSHA1(
        generateSignature(file.public_id, apiSecret)
      );
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

      const axiosInstance = axios.create();
      console.log(signature);
      axiosInstance.defaults.headers.common["Access-Control-Allow-Origin"] =
        "*";
      try {
        const response = await axios.post(url, {
          public_id: file.public_id,
          signature: signature,
          api_key: apiKey,
          timestamp: timestamp,
        });

        if (response.ok) {
          return response;
        } else {
          console.log(response);
        }
      } catch (error) {
        console.log(error, "error");
      } finally {
        setSubmitting(false);
      }
    });
  };
  const addNewFiles = async (newFile) => {
    const formData = new FormData();
    formData.append("upload_preset", "uploads");
    formData.append("file", newFile);
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dft1xk7ug/auto/upload",
        {
          method: "POST",
          body: formData,
        }
      )
        .then((data) => data.json())
        .then((data) => data)
        .catch((error) => console.log(error));

      console.log(res, "res");
      return res;
    } finally {
      // console.log(files, "files");
    }
  };
  const updateToDb = async (data) => {
    console.log("update to db called", data);
    try {
      const response = await fetch(`/api/prompt/${promptId}`, {
        method: "PATCH",
        body: JSON.stringify({
          prompt: post.prompt,
          tag: post.tag,
          images: data,
        }),
      });

      if (response.ok) {
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  useEffect(() => {
    const getPromptDetails = async () => {
      const response = await fetch(`/api/prompt/${promptId}`);
      const data = await response.json();
      setPost({
        prompt: data.prompt,
        tag: data.tag,
      });
      setFiles(data.images);
    };
    if (promptId) {
      getPromptDetails();
    }
  }, [promptId]);
  const updatePrompt = async (e, filesToDelete) => {
    e.preventDefault();
    console.log("ran inside update");
    setSubmitting(true);
    if (filesToDelete.length > 0) {
      DeleteFiles(filesToDelete);
    }
    const k = files.map((d) => {
      if (d.path) {
        console.log("ran inside");
        const j = addNewFiles(d).then((res) => res);
        return j;
      } else {
        return d;
      }
    });
    const s = await Promise.all(k);
    updateToDb(s);
  };
  return (
    <Form
      type="Edit"
      post={post}
      setPost={setPost}
      submitting={submitting}
      handleSubmit={updatePrompt}
      files={files}
      setFiles={setFiles}
    />
  );
}

export default page;
