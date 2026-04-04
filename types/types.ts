export type ProjectCategory = '2d' | '3d' | 'motion-design' | 'video-editing';

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  video: string;
  category: ProjectCategory;
}

export interface MousePosition {
  x: number;
  y: number;
}
