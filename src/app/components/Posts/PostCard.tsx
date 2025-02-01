import { PostCardProps } from "@/app/types/interfaces";
import Link from "next/link";

export default function PostCard({ post, author }: PostCardProps) {
  return (
    <div className="bg-white w-full flex justify-center items-center flex-col max-w-[500px] min-h-[250px] rounded-md p-[15px] gap-[15px]">
      <h2>Title: {post.title}</h2>
      <p>{post.body}</p>
      <p>Author: {author?.username || "Unknown"}</p>
      <Link href={`/post-detail/${post.id}`} className="cursor-pointer">
        View Details...
      </Link>
    </div>
  );
}
