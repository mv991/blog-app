import { useDropzone } from "react-dropzone";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/solid";
import axios from "axios";
import crypto from "crypto";
// import { generateSHA1, generateSignature } from "@utils/generateSignature";
const Dropzone = ({ className, files, setFiles, type, setFilesToDelete }) => {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles?.length) {
      console.log("ran inside accepted files");
      setFiles((previousFiles) => [
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
      "video/mp4": [".mp4", ".MP4"],
    },
    maxSize: 100204 * 100000,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files?.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = async (file, i) => {
    setFiles((files) => files.filter((file, index) => index !== i));
    if (type === "Edit") {
      setFilesToDelete(files);
    }
  };

  const removeAll = () => {
    setFiles([]);
  };

  return (
    <>
      <div
        {...getRootProps({
          className: className,
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center gap-4 cursor-pointer">
          <ArrowUpTrayIcon className="w-5 h-5 fill-current" />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag & drop files here, or click to select files</p>
          )}
        </div>
      </div>

      {/* Preview */}
      <section className="mt-10">
        <div className="flex gap-4 justify-between">
          <h2 className="title text-3xl font-semibold">Preview</h2>
          <button
            type="button"
            onClick={removeAll}
            className="mt-1 text-[12px] uppercase tracking-wider font-bold text-neutral-500 border border-secondary-400 rounded-md px-3 hover:bg-secondary-400 hover:text-red-500 transition-colors"
          >
            Remove all files
          </button>
        </div>

        <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-10">
          {files?.map((file, index) => (
            <li key={index} className="relative h-32 rounded-md shadow-lg">
              {file?.type != "video/mp4" ? (
                <Image
                  src={file?.preview ? file?.preview : file?.url}
                  alt={file?.name}
                  width={200}
                  height={100}
                  style={{ objectFit: "cover" }}
                  onLoad={() => {
                    URL.revokeObjectURL(file?.preview);
                  }}
                  className="h-full w-full object-contain rounded-md"
                />
              ) : (
                <video style={{ height: "100%" }} src={file?.preview} />
              )}

              <button
                type="button"
                className="w-7 h-7 border border-secondary-400  rounded-full flex justify-center items-center absolute -top-3 -right-3 bg-white transition-colors"
                onClick={() => removeFile(file, index)}
              >
                <XMarkIcon className="w-5 h-5 fill-red-700 hover:fill-secondary-400 transition-colors" />
              </button>
              <p className="mt-2 text-neutral-500 text-[12px] font-medium">
                {file?.name}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
};

export default Dropzone;
