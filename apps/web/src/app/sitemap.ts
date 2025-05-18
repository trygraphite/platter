import { MetadataRoute } from 'next';

const siteUrl = process.env.BASE_DOMAIN || 'https://platterng.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const corePages = [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${siteUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
  ];

  // This is a placeholder for future blog posts
  // When you implement your blog, you can replace this empty array with actual blog data
  const blogPages: MetadataRoute.Sitemap = [];
  
  // Example of how to implement blog pages when ready:
  /*
  const blogPages = blogPostsData.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));
  */

  // Combine all pages
  return [...corePages, ...blogPages];
}