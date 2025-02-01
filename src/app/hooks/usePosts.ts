"use client";
import { useEffect, useState } from "react";
import { Author, Post } from "../types/interfaces";

// Define Post Type

export function usePosts() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [authors, setAuthors] = useState<Record<number, Author>>({});
  const [page, setPage] = useState<number>(1);
  const [posts, setPosts] = useState<Post[]>([]); 

  const fetchPosts = async (pageNum: number) => {
    setLoading(true);
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=10&_page=${pageNum}`);
    const data: Post[] = await res.json(); 
    setPosts((prev) => [...prev, ...data]); 
    setLoading(false);
  };

  // Fetch posts on page change
  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/users`)
      .then((res) => res.json())
      .then((data) => {
        const authorsMap = data.reduce((acc: Record<number, Author>, author: Author) => {
          acc[author.id] = author;
          return acc;
        }, {});
        setAuthors(authorsMap);
      });
  }, []);

  // Infinite Scroll Handler
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setPage((prev: number) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Filter posts by search term
  const filteredPosts = searchTerm
    ? posts.filter((post) => post.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : posts;

    return { filteredPosts, setSearchTerm, loading, setPage, authors };
}
