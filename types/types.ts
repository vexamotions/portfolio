export type ProjectCategory =
  | '2d'
  | '3d'
  | 'motion-design'
  | 'video-editing'
  | 'talking-head'
  | 'direct-response-ads'
  | 'ai-ads'
  | 'saas';

export interface Project {
  id: number;
  title: string;
  description: string;
  thumbnail: string;

  video?: string;

  youtubeId?: string;
  category: ProjectCategory;
}
