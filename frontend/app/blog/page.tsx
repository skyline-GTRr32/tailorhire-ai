import Link from "next/link";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

async function getArticles() {
  const strapiUrl = process.env.STRAPI_API_URL;
  const url = `${strapiUrl}/api/articles?populate=*&sort=publishedAt:desc`;

  try {
    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err) {
    console.error("Error fetching articles:", err);
    return [];
  }
}

export default async function BlogPage() {
  const articles = await getArticles();

  return (
    <div className="bg-white">
      <Navbar />
      <main className="pt-24 pb-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">TailorHire Blog</h1>

        {articles.length === 0 && (
          <p className="text-gray-500">No articles found.</p>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {articles.map((article: any) => (
            <div
              key={article.id}
              className="shadow-md rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              {article.featured_image?.url && (
                <Image
                  src={article.featured_image.url} // ✅ Cloudinary direct URL
                  alt={article.title}
                  width={600}
                  height={400}
                  className="w-full h-60 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="text-gray-600 line-clamp-3">
                  {article.seo_description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
