"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Form from "@components/Form";

function page() {
  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({ prompt: "", tag: "", imgUrl: [] });
  const [files, setFiles] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.user.id) {
      router.push("/");
    }
  }, []);
  useEffect(() => {
    console.log(post, "post");
  }, [post]);
  const createPrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (!files?.length) return;
      const formData = new FormData();
      formData.append("upload_preset", "uploads");
      const postToDb = async (data) => {
        try {
          const response = await fetch("/api/prompt/new", {
            method: "POST",
            body: JSON.stringify({
              prompt: post.prompt,
              userId: session?.user.id,
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
      const imgData = files.map(async (file, index) => {
        formData.append("file", file);
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dft1xk7ug/auto/upload",
          {
            method: "POST",
            body: formData,
          }
        ).then((data) => data.json());

        return res;
      });
      const imgRes = await Promise.all(imgData);
      postToDb(imgRes);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Form
      type="Create"
      post={post}
      setPost={setPost}
      submitting={submitting}
      files={files}
      setFiles={setFiles}
      handleSubmit={createPrompt}
    />
  );
}

export default page;
