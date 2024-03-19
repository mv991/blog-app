"use client"
import React,{useState,useEffect} from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import Profile from '@components/Profile';
import { useSearchParams } from 'next/navigation';
function page() {
      const searchParams = useSearchParams();
    const promptId = searchParams.get('id');
    const {data: session} = useSession();
    const [posts,setPosts] = useState([])
    const router = useRouter()
    const fetchPosts = async () => {
    const response = await fetch(`/api/users/${session?.user.id}`);
    const data = await response.json();
      setPosts(data);
  };
  useEffect(() => {
     if(session?.user.id) {
        fetchPosts();
    
     }
  },[session])
   const handleEdit = (post) => {
       router.push(`/update-prompt?id=${post._id}`)
    }
    const handleDelete = async(post) => {
   const hasConfirmed = confirm("Are you sure you want to delete this post?");
   if(hasConfirmed) {
    try {
      const response = await fetch(`/api/prompt/${post._id}`, {
        method: "DELETE",
      });
      const filteredPosts = posts.filter((p) => p._id != post._id);
      setPosts(filteredPosts)
    } catch (error) {
      console.log(error);
    }
    }
  } 
  return (
    <Profile
    name="My"
    desc="Welcome to your profile page"
    data={posts}
    handleEdit={handleEdit}
    handleDelete={handleDelete}
    />
  )
}

export default page