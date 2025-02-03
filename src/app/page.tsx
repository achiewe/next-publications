"use client";
import Header from "./components/Header/Header";
import PostCard from "./components/Posts/PostCard";
import SearchBar from "./components/SearchBar/SearchBar";
import { usePosts } from "./hooks/usePosts";

export default function Home() {
  const { filteredPosts, setSearchTerm, authors, loading, hasMore } =
    usePosts();
  return (
    <div className="bg-[#918a8a] w-full min-h-screen pt-4 flex flex-col items-center gap-[20px]">
      <Header />
      <SearchBar setSearchTerm={setSearchTerm} />
      <div className="w-full flex gap-[20px] justify-center items-center flex-row flex-wrap p-[15px]">
        {filteredPosts.map((post) => (
          <PostCard key={post.id} post={post} author={authors[post.userId]} />
        ))}
      </div>
      {!loading && hasMore && <p>Loading more posts...</p>}
    </div>
  );
}
