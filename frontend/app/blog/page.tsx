import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - TailorHire Resume',
  description: 'Tips, tricks, and insights on resume building, ATS optimization, and job hunting in the age of AI.',
}

async function getArticles() {
  const apiUrl = `${process.env.STRAPI_API_URL}/api/articles?populate=*&sort=publishedAt:desc`;
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 10 } });
    if (!res.ok) throw new Error(`Failed to fetch articles. Status: ${res.status}`);
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export default async function BlogIndexPage() {
  const articles = await getArticles();
  const assetBaseUrl = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL || '';

  return (
    <div className="bg-white">
      <Navbar />
      <main className="pt-24 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
              The TailorHire Blog
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Resume advice, career insights, and the latest in AI-powered job searching.
            </p>
          </header>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map((article: any) => {
                const imageUrl = article.featured_image?.url;

                return (
                  article.slug && (
                    <Link href={`/blog/${article.slug}`} key={article.id} legacyBehavior>
                      <a className="group flex flex-col bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden">
                        {imageUrl ? (
                          <div className="relative h-48 w-full overflow-hidden">
                            <Image 
                              src={`${assetBaseUrl}${imageUrl}`}
                              alt={article.title || 'Blog post image'}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ) : <div className="h-48 w-full bg-gray-200" />}
                        <div className="p-6 flex flex-col flex-grow">
                          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                            By {article.author || 'TailorHire Team'}
                          </p>
                          <h2 className="mt-2 text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
                            {article.title}
                          </h2>
                          <p className="mt-3 text-gray-600 text-sm flex-grow line-clamp-3">
                            {article.seo_description}
                          </p>
                          <p className="mt-4 text-xs text-gray-400">
                            {new Date(article.publishedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </a>
                    </Link>
                  )
                );
              })
            ) : (
              <p className="md:col-span-3 text-center text-gray-500">
                No articles published yet. Please ensure your articles are published in Strapi.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
