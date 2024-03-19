import React, { useCallback, useState } from "react";
import Link from "next/link";
import Dropzone from "./Dropzone";

export default function Form({
  type,
  post,
  submitting,
  handleSubmit,
  setPost,
  files,
  setFiles,
}) {
  const [filesToDelete, setFilesToDelete] = useState([]);
  return (
    <section className="w-full max-w-full flex-start flex-col">
      <h1 className="head_text text-left">
        <span className="blue_gradient">{type} Post</span>
      </h1>
      <p className="desc text-left max-w-md">
        {type} and share amazing blogs with the world, and let your imagination
        run wild.
      </p>
      <form
        onSubmit={(e) => handleSubmit(e, filesToDelete)}
        className="mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism"
      >
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Your Blog Post
          </span>

          <textarea
            value={post?.prompt}
            onChange={(e) => setPost({ ...post, prompt: e.target.value })}
            placeholder="Write your post here"
            required
            className="form_textarea "
          />
        </label>
        <label>
          <span className="font-satoshi font-semibold text-base text-gray-700">
            Field of Blog{" "}
            <span className="font-normal">
              (#product, #webdevelopment, #idea, etc.)
            </span>
          </span>
          <input
            value={post?.tag}
            onChange={(e) => setPost({ ...post, tag: e.target.value })}
            type="text"
            placeholder="#Tag"
            required
            className="form_input"
          />
        </label>
        <Dropzone
          files={files}
          setFiles={setFiles}
          type={type}
          setFilesToDelete={type === "Edit" ? setFilesToDelete : undefined}
        />
        <div className="flex-end mx-3 mb-5 gap-4">
          <Link href="/" className="text-gray-500 text-sm">
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white"
          >
            {submitting ? `${type}ing...` : type}
          </button>
        </div>
      </form>
    </section>
  );
}
