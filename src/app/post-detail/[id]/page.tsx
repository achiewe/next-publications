"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { usePosts } from "@/app/hooks/usePosts";
import { Post, Author } from "@/app/types/interfaces";
import CloseButton from "@/app/components/CloseButton/CloseButton";

export default function PostDetails() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { fetchPostDetails } = usePosts();
  const [data, setData] = useState<{ post: Post; author: Author } | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return;

    fetchPostDetails(id).then((result) => {
      if (result.post && result.author) {
        setData(result as { post: Post; author: Author });
      }
      setLoading(false);
    });
  }, [id, fetchPostDetails]);

  if (loading) return <p>Loading...</p>;
  if (!data) return <p>Post not found</p>;

  return (
    <div className="h-screen bg-[#918a8a] gap-[80px] px-[30px] py-[100px] flex flex-col justify-start items-center">
      <h1 className="text-2xl font-bold text-center">{data.post.title}</h1>
      <p className="mt-2">{data.post.body}</p>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">
          Author: {data.author.name} ({data.author.username})
        </h2>
        <p>
          📍 Address: {data.author.address.street}, {data.author.address.city}
        </p>
        <p>📞 Phone: {data.author.phone}</p>
      </div>
      <CloseButton />
    </div>
  );
}
