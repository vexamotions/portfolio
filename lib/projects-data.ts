import { Project } from '@/types/types';

export type ProjectCategorySlug = '2d' | '3d' | 'motion-design' | 'video-editing';

export interface ProjectCategory {
  slug: ProjectCategorySlug;
  title: string;
  description: string;
  cover: string;
}

export const PROJECT_CATEGORIES: ProjectCategory[] = [
  {
    slug: '2d',
    title: '2D Animations',
    description: 'Explainer stories, music visuals, and frame-by-frame motion crafted for clear communication.',
    cover: '/videos/work/2d-construction-preivew.png',
  },
  {
    slug: '3d',
    title: '3D Animations',
    description: 'Product shots, environment tours, and cinematic 3D scenes with realistic materials and lighting.',
    cover: '/videos/work/3d-watch-preview.jpg',
  },
  {
    slug: 'motion-design',
    title: 'Motion Design',
    description: 'Dynamic UI stories, branded graphics, and abstract visuals designed to guide attention.',
    cover: '/videos/work/motion-design-preivew.png',
  },
  {
    slug: 'video-editing',
    title: 'Video Editing',
    description: 'Short-form and promo edits with rhythm, clean pacing, and conversion-focused storytelling.',
    cover: '/videos/work/video-preview.png',
  },
];

export const ALL_PROJECTS: Project[] = [
  {
    id: 1,
    title: '3D Virtual Tour of Apartment',
    description:
      'A fully interactive 3D virtual tour of a modern apartment with smooth navigation and realistic visual detail.',
    thumbnail: '/videos/work/3d-home-tour-preview.jpg',
    video: '/hls-command/3d-home-tour/master.m3u8',
    category: '3d',
  },
  {
    id: 2,
    title: 'Sagittarius A* Watch Animation',
    description:
      'A cinematic watch animation with detailed modeling and premium product presentation for marketing use cases.',
    thumbnail: '/videos/work/3d-watch-preview.jpg',
    video: '/hls-command/3d-watch-animation/master.m3u8',
    category: '3d',
  },
  {
    id: 3,
    title: 'Smart EV Charger Animation',
    description:
      'A sleek product animation showing core charger features, user interactions, and modern industrial styling.',
    thumbnail: '/videos/work/3d-ev-charger-preview.png',
    video: '/hls-command/3d-ev-charger/master.m3u8',
    category: '3d',
  },
  {
    id: 4,
    title: 'Smart Remote Control Animation',
    description:
      'A product story for a smart remote with focus on ergonomics, button logic, and ecosystem connectivity.',
    thumbnail: '/videos/work/3d-smart-remote-preivew.png',
    video: '/hls-command/3d-smart-remote/master.m3u8',
    category: '3d',
  },
  {
    id: 5,
    title: 'Smart Switches Collection',
    description:
      'A multi-shot product series highlighting modern smart switch designs and touch-first interaction patterns.',
    thumbnail: '/videos/work/3d-smart-switches-preview.png',
    video: '/hls-command/3d-smart-switches/master.m3u8',
    category: '3d',
  },
  {
    id: 6,
    title: '3D Animation Mixture Reel',
    description:
      'A mixed reel of product visualizations and cinematic scenes showing range across industries and formats.',
    thumbnail: '/videos/work/3d-mixture-preivew.png',
    video: '/hls-command/3d-animations-mixture/master.m3u8',
    category: '3d',
  },
  {
    id: 7,
    title: 'Robot Landing Sequence',
    description:
      'A sci-fi robot landing cinematic featuring atmospheric lighting, hard-surface details, and dramatic motion.',
    thumbnail: '/videos/work/3d-robot-preview.png',
    video: '/hls-command/3d-robot-landing/master.m3u8',
    category: '3d',
  },
  {
    id: 8,
    title: '2D Construction Explanation',
    description:
      'An educational 2D animation that simplifies construction workflows into engaging, understandable visuals.',
    thumbnail: '/videos/work/2d-construction-preivew.png',
    video: '/hls-command/2d-construction-explanation/master.m3u8',
    category: '2d',
  },
  {
    id: 9,
    title: '2D Music Video Animation',
    description:
      'A stylized music visual blending expressive character work and beat-synced scene transitions.',
    thumbnail: '/videos/work/2d-music-preivew.png',
    video: '/hls-command/2d-copy-of-music-video/master.m3u8',
    category: '2d',
  },
  {
    id: 10,
    title: 'Neura Flow - Motion Design Dashboard',
    description:
      'A futuristic dashboard animation with fluid transitions, dynamic chart choreography, and micro-interactions.',
    thumbnail: '/videos/work/motion-design-preivew.png',
    video: '/hls-command/motion-design/master.m3u8',
    category: 'motion-design',
  },
  {
    id: 11,
    title: '3D Character Modeling - Billy',
    description:
      'A process-focused reel showing concept-to-model workflow, topology strategy, and rendering-ready detailing.',
    thumbnail: '/videos/work/model-preview.png',
    video: '/hls-command/modeling/master.m3u8',
    category: '3d',
  },
  {
    id: 12,
    title: 'Influencer Video Editing Suite',
    description:
      'A fast-paced editing package for creators with captions, transitions, grading, and social-first pacing.',
    thumbnail: '/videos/work/video-preview.png',
    video: '/hls-command/video/master.m3u8',
    category: 'video-editing',
  },
];

export const PROJECT_CATEGORY_TITLE_MAP: Record<ProjectCategorySlug, string> = {
  '2d': '2D Animations',
  '3d': '3D Animations',
  'motion-design': 'Motion Design',
  'video-editing': 'Video Editing',
};
