export function generateOrganizationStructuredData(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Converze',
    url: siteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${siteUrl}/favicon.svg`,
    },
    description: 'Visualize your voice. Shape how you\'re heard. A self-reflection app designed to help people understand how they sound and transform their communication through daily practice.',
    sameAs: [
      // Add your social media links here when available
      // 'https://twitter.com/converze',
      // 'https://linkedin.com/company/converze',
    ],
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateWebSiteStructuredData(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Converze',
    url: siteUrl,
    description: 'Visualize your voice. Shape how you\'re heard.',
    publisher: {
      '@type': 'Organization',
      name: 'Converze',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/blog?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}
