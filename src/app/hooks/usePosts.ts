"use client";
import { useEffect, useState, useCallback } from "react";
import { Author, Post, PostDetailsData } from "../types/interfaces";

// Define Post Hook
export function usePosts() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [authors, setAuthors] = useState<Record<string, Author>>({});
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);

  // Fetch posts with pagination
  const fetchPosts = useCallback(async (pageNum: number) => {
    setLoading((prevLoading) => {
      if (prevLoading || !hasMore) return true; // Prevent multiple requests
      return prevLoading;
    });
  
    try {
      const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`);
      
      if (!res.ok) {
        throw new Error(`Failed to fetch posts: ${res.status}`);
      }
  
      const data: Post[] = await res.json();
  
      setPosts((prev) => {
        const uniquePosts = new Map([...prev, ...data].map((p) => [p.id, p]));
        return Array.from(uniquePosts.values());
      });
  
      setHasMore(data.length > 0); // Set `hasMore` based on fetched data
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, []);
  
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
    if (authors[postId]) {
      return { post: posts.find(p => p.id === parseInt(postId)) || null, author: authors[postId] };
    }
  
    const postRes = await fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    const postData: Post = await postRes.json();
  
    const authorRes = await fetch(`https://jsonplaceholder.typicode.com/users/${postData.userId}`);
    const authorData: Author = await authorRes.json();
  
    setAuthors((prev) => ({ ...prev, [postData.userId]: authorData }));
  
    return { post: postData, author: authorData };
  };




  // Infinite Scroll Optimization (Debounced)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
          setPage((prev) => prev + 1);
        }
      }, 500); // Increased debounce time to prevent too many calls
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);



  

  // Filter posts by search term
  const filteredPosts = searchTerm
    ? posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : posts;

  return { filteredPosts, setSearchTerm, loading, setPage, authors, fetchPostDetails };
}
