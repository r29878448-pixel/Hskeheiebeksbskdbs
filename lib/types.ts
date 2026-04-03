export interface Course {
  id: string | number;
  title: string;
  image?: string;
}

export interface Subject {
  id: string | number;
  name: string;
  thumbnail?: string;
}

export interface Lesson {
  id: string | number;
  name: string;
  video_url?: string;
  thumb?: string;
  duration?: string;
}
