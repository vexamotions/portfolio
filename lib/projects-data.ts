import type { Project, ProjectCategory } from '@/types/types';

export type ProjectCategorySlug = ProjectCategory;

export interface ProjectCategoryMeta {
  slug: ProjectCategorySlug;
  title: string;
  description: string;
  cover: string;
}

const UNSPLASH = (id: string): string =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

const CATEGORY_COVERS: Record<string, string> = {
  'talking-head': UNSPLASH('1607990281513-2c110a25bd8c'),
  'direct-response-ads': UNSPLASH('1611162617474-5b21e879e113'),
  'ai-ads': UNSPLASH('1677442136019-21780ecad995'),
  saas: UNSPLASH('1551434678-e076c223a692'),
};

export const PROJECT_CATEGORIES: ProjectCategoryMeta[] = [
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
  {
    slug: 'talking-head',
    title: 'Talking Head',
    description: 'Creator-style and presenter videos with clean framing, captions, and punchy pacing.',
    cover: CATEGORY_COVERS['talking-head'],
  },
  {
    slug: 'direct-response-ads',
    title: 'Direct Response Ads',
    description: 'Conversion-focused ad creatives built to hook attention and drive action.',
    cover: CATEGORY_COVERS['direct-response-ads'],
  },
  {
    slug: 'ai-ads',
    title: 'AI Ads',
    description: 'AI-assisted ad creatives blending generative visuals with sharp, conversion-led edits.',
    cover: CATEGORY_COVERS['ai-ads'],
  },
  {
    slug: 'saas',
    title: 'SaaS Videos',
    description: 'Product explainers and SaaS promos that make software feel effortless.',
    cover: CATEGORY_COVERS['saas'],
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

  {
    id: 13,
    title: 'Plattr Product Trial',
    description:
      'A crisp SaaS product walkthrough highlighting the core workflow and value in seconds.',
    thumbnail: '/placeholder.jpg',
    youtubeId: 'JgNtDVArcfA',
    category: 'saas',
  },
  {
    id: 14,
    title: 'SaaS Explainer Promo',
    description:
      'A punchy explainer that turns a complex software story into a clear, benefit-led pitch.',
    thumbnail: '/placeholder.jpg',
    youtubeId: '4G86uY_fjrk',
    category: 'saas',
  },
  {
    id: 15,
    title: 'SaaS Feature Spotlight',
    description:
      'A short-form product promo built to showcase a standout feature with momentum and polish.',
    thumbnail: '/placeholder.jpg',
    youtubeId: 'vw8b8gxdy0c',
    category: 'saas',
  },

  {
    id: 16,
    title: 'Techsuasive Welcome Video',
    description:
      'A polished presenter-led welcome video with clean framing, pacing, and brand-forward delivery.',
    thumbnail: '/placeholder.jpg',
    youtubeId: 'p25W5-n5yz4',
    category: 'talking-head',
  },
  {
    id: 17,
    title: 'Dragon Fruit Media Intro',
    description:
      'A creator-style intro spot with energetic pacing and confident, on-camera delivery.',
    thumbnail: '/placeholder.jpg',
    youtubeId: 'u6TBW--vDV0',
    category: 'talking-head',
  },
  {
    id: 18,
    title: 'Marcus — Talking Head Ad',
    description:
      'A punchy talking-head ad edit with captions, b-roll cutaways, and a strong hook.',
    thumbnail: '/placeholder.jpg',
    youtubeId: 'nFxpF0zYJx8',
    category: 'talking-head',
  },
  {
    id: 19,
    title: 'Final Cut — Brand Feature',
    description:
      'A high-fidelity brand feature edit built for premium presentation and storytelling.',
    thumbnail: '/placeholder.jpg',
    youtubeId: '2xVWEU8X8vY',
    category: 'talking-head',
  },

  { id: 20, title: 'Brand Ad Spot', description: 'A scroll-stopping AI-assisted ad creative built to hook attention in the first second.', thumbnail: '/placeholder.jpg', youtubeId: 'Qai8EQdaXHI', category: 'ai-ads' },
  { id: 21, title: 'Alvaski Electra Ad', description: 'A sleek AI-assisted product ad with crisp pacing and a clear call to action.', thumbnail: '/placeholder.jpg', youtubeId: 'McVFGAHTbk0', category: 'ai-ads' },
  { id: 22, title: 'Jewellery Ad', description: 'A premium jewellery ad spot with elegant lighting and rhythm.', thumbnail: '/placeholder.jpg', youtubeId: 'ccPVLYFtL2M', category: 'ai-ads' },
  { id: 23, title: 'Light Product Ad', description: 'A clean product-focused ad highlighting form and function.', thumbnail: '/placeholder.jpg', youtubeId: 'W_4xZztunAQ', category: 'ai-ads' },
  { id: 24, title: 'Naxir Review Ad', description: 'A review-style ad blending testimonial energy with strong retention beats.', thumbnail: '/placeholder.jpg', youtubeId: 'uVmard41z98', category: 'ai-ads' },
  { id: 25, title: 'Noble View Ad', description: 'A polished brand ad with confident pacing and a benefit-led message.', thumbnail: '/placeholder.jpg', youtubeId: 'NBv849EfaRQ', category: 'ai-ads' },

  { id: 26, title: 'Direct Response Ad 01', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', category: 'direct-response-ads' },
  { id: 27, title: 'Direct Response Ad 02', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 'dPiXqbYBxVA', category: 'direct-response-ads' },
  { id: 28, title: 'Direct Response Ad 03', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 's4watldb3Js', category: 'direct-response-ads' },
  { id: 29, title: 'Direct Response Ad 04', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 'b8LRtV_99nQ', category: 'direct-response-ads' },
  { id: 30, title: 'Direct Response Ad 05', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 'egmXfvvtQY4', category: 'direct-response-ads' },
  { id: 31, title: 'Direct Response Ad 06', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 'mhfogJRhmE0', category: 'direct-response-ads' },
  { id: 32, title: 'Direct Response Ad 07', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 'hgIuz3tRuvY', category: 'direct-response-ads' },
  { id: 33, title: 'Direct Response Ad 08', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 'D0hEaHisIu0', category: 'direct-response-ads' },
  { id: 34, title: 'Direct Response Ad 09', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 'O8oYw9b9np0', category: 'direct-response-ads' },
  { id: 35, title: 'Direct Response Ad 10', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: 'LNTgofbW2mk', category: 'direct-response-ads' },
  { id: 36, title: 'Direct Response Ad 11', description: 'A conversion-focused ad creative engineered for performance.', thumbnail: '/placeholder.jpg', youtubeId: '6sK0OrpjTx8', category: 'direct-response-ads' },
  { id: 37, title: 'Cane Trial Ad', description: 'A trial-offer ad edit built to drive sign-ups with a clear value story.', thumbnail: '/placeholder.jpg', youtubeId: 'C2OurxjKNF0', category: 'direct-response-ads' },
  { id: 38, title: 'Nolla Trial Ad', description: 'A trial-offer ad edit with momentum, captions, and a confident CTA.', thumbnail: '/placeholder.jpg', youtubeId: 'kHppOx7AV4o', category: 'direct-response-ads' },
];

export const PROJECT_CATEGORY_TITLE_MAP: Record<ProjectCategorySlug, string> = {
  '2d': '2D Animations',
  '3d': '3D Animations',
  'motion-design': 'Motion Design',
  'video-editing': 'Video Editing',
  'talking-head': 'Talking Head',
  'direct-response-ads': 'Direct Response Ads',
  'ai-ads': 'AI Ads',
  'saas': 'SaaS Videos',
};

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const projectSlug = (project: Project): string => slugify(project.title);

const youtubeThumbnail = (id: string): string =>
  `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

export const projectThumbnail = (project: Project): string => {
  if (project.youtubeId) return youtubeThumbnail(project.youtubeId);
  if (project.thumbnail && project.thumbnail !== '/placeholder.jpg') {
    return project.thumbnail;
  }
  return CATEGORY_COVERS[project.category] ?? project.thumbnail;
};

export const getProjectsByCategory = (category: string): Project[] =>
  ALL_PROJECTS.filter((project) => project.category === category);

export const findProject = (
  category: string,
  slug: string,
): Project | undefined =>
  ALL_PROJECTS.find(
    (project) => project.category === category && slugify(project.title) === slug,
  );
