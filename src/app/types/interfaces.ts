export interface Post{
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface Address {
  street: string;
  suite: string;
  city: string;
}

export interface PostDetailsData {
  post: Post | null;
  author: Author | null;
}

export interface Author{
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address; // Added address
    phone: string; // Added phone
}
  
  export interface PostCardProps {
    post: Post;
    author?: Author; // Optional author
  }
  