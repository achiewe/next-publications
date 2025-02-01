"use client";
import { useEffect, useState, useCallback } from "react";
import { Author, Post, PostDetailsData } from "../types/interfaces";

// Define Post Hook
export function usePosts() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [authors, setAuthors] = useState<Record<number, Author>>({});
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch posts with pagination
  const fetchPosts = useCallback(async (pageNum: number) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`);
      const data: Post[] = await res.json();

      if (data.length === 0) setHasMore(false); // Stop fetching if no more posts
      setPosts((prev) => [...new Map([...prev, ...data].map((p) => [p.id, p])).values()]); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
    setLoading(false);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);





  // Fetch authors once
  useEffect(() => {
    const abortController = new AbortController();
    fetch(`https://jsonplaceholder.typicode.com/users`, { signal: abortController.signal })
      .then((res) => res.json())
      .then((data) => {
        const authorsMap = data.reduce((acc: Record<number, Author>, author: Author) => {
          acc[author.id] = author;
          return acc;
        }, {});
        setAuthors(authorsMap);
      })
      .catch((error) => {
        if (error.name !== "AbortError") console.error("Error fetching authors:", error);
      });

    return () => abortController.abort(); // Cleanup
  }, []);






  // Fetch single post details
  const fetchPostDetails = async (postId: string): Promise<PostDetailsData> => {
    try {
      const [postRes, authorRes] = await Promise.all([
        fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`),
        fetch(`https://jsonplaceholder.typicode.com/users/${postId}`),
      ]);

      const postData: Post = await postRes.json();
      const authorData: Author = await authorRes.json();

      return { post: postData, author: authorData };
    } catch (error) {
      console.error("Error fetching post details:", error);
      return { post: null, author: null };
    }
  };




  // Infinite Scroll Optimization (Debounced)
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          setPage((prev) => prev + 1);
        }
      }, 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(debounceTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  

  // Filter posts by search term
  const filteredPosts = searchTerm
    ? posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : posts;

  return { filteredPosts, setSearchTerm, loading, setPage, authors, fetchPostDetails };
}
