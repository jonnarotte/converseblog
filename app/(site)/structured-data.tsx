export function generateOrganizationStructuredData(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Converze',
    url: siteUrl,
    logo: `${siteUrl}/favicon.svg`,
    description: 'Visualize your voice. Shape how you\'re heard. A self-reflection app designed to help people understand how they sound.',
    sameAs: [
      // Add your social media links here when available
      // 'https://twitter.com/converze',
      // 'https://linkedin.com/company/converze',
    ],
  }
}
