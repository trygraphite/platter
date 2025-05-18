import { siteConfig } from '@/lib/siteConfig'
import type {MetadataRoute} from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/privacy', '/terms'],
        },
        sitemap: `${siteConfig.url}/sitemap.xml`
    }
}