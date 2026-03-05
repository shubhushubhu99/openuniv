export interface Comment {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  content: string;
  upvotes: number;
  timestamp: string;
  replies?: Comment[];
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar?: string;
    role?: string;
  };
  title: string;
  content: string;
  tags: string[];
  upvotes: number;
  commentCount: number;
  timestamp: string;
  comments?: Comment[];
}
