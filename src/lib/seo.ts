import { Metadata } from 'next';

export function constructMetadata({
  title = 'TalentLens | AI-Powered Talent Discovery & Internal Mobility Platform',
  description = 'Discover hidden skills, match employees with internal roles, analyze skill gaps, and empower workforce mobility with explainable AI.',
  image = '/og-image.png',
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: image }],
      type: 'website',
      siteName: 'TalentLens',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://talentlens.vercel.app'),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}

export const generatePageMetadata = constructMetadata;

