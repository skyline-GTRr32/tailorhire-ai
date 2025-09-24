import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Metadata } from "next";

// --- START OF FIX: Define the types for our Strapi data ---
interface RichTextBlock {
  type: string;
  level?: number;
  format?: string;
  children: RichTextChild[];
}

interface RichTextChild {
  type: string;
  text?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  url?: string;
  children?: RichTextChild[];
}
// --- END OF FIX ---

async function getArticle(slug: string) {
  const strapiUrl = process.env.STRAPI_API_URL;
  const url = `${strapiUrl}/api/articles?filters[slug][$eq]=${slug}&populate=*`;
  
  try {
    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.data || data.data.length === 0) return null;
    return data.data[0];
  } catch (error) {
    console.error("Fetch single article failed:", error);
    return null;
  }
}

// --- START OF FIX: Add types to function parameters ---
function renderRichText(content: RichTextBlock[]) {
    if (!Array.isArray(content)) return null;

    return content.map((block, idx) => {
        if (!block || !block.children) return null;

        const node = block.children.map((child: RichTextChild, cidx: number) => {
            if (child.type === "text") {
                let text = child.text || "";
                if (child.bold) return <strong key={cidx}>{text}</strong>;
                if (child.italic) return <em key={cidx}>{text}</em>;
                if (child.underline) return <u key={cidx}>{text}</u>;
                return text;
            }
            if (child.type === "link") {
                const linkText = child.children?.map((c: RichTextChild) => c.text).join('') || '';
                return <a key={cidx} href={child.url} className="text-blue-600 hover:underline">{linkText}</a>;
            }
            return null;
        });

        switch (block.type) {
            case "heading":
                const Tag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
                return <Tag key={idx} className="my-6 font-bold">{node}</Tag>;
            case "paragraph":
                return <p key={idx} className="my-4">{node}</p>;
            case "list":
                const ListTag = block.format === 'ordered' ? 'ol' : 'ul';
                return <ListTag key={idx} className="list-disc list-inside my-4 space-y-2">{block.children.map((li: RichTextChild, liIdx: number) => <li key={liIdx}>{li.children?.map((c: RichTextChild) => c.text).join('')}</li>)}</ListTag>;
            default:
                return null;
        }
    });
}
// --- END OF FIX ---


export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: 'Article Not Found' };
  return {
    title: `${article.attributes.title} - TailorHire Blog`,
    description: article.attributes.seo_description,
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();
  
  const attrs = article.attributes;
  const contentHtml = renderRichText(attrs.content); // Use the new typed function
  const assetBaseUrl = process.env.NEXT_PUBLIC_STRAPI_ASSET_URL || '';
  const imageUrl = attrs.featured_image?.data?.attributes?.url;

  return (
    <div className="bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {attrs.title}
            </h1>
            <p className="mt-4 text-md text-gray-500">
              By {attrs.author || "TailorHire Team"} on {new Date(attrs.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </header>
          
          {imageUrl && (
            <div className="relative h-96 w-full mb-8 rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={`${assetBaseUrl}${imageUrl}`}
                alt={attrs.title || 'Featured Image'}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
          )}
          
          <div className="prose lg:prose-xl mx-auto">
            {contentHtml}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}