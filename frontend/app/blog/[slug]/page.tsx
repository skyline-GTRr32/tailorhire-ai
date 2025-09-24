import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { Metadata } from "next";

// --- Types ---
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

// --- Fetch single article ---
async function getArticle(slug: string) {
  const strapiUrl = process.env.STRAPI_API_URL;
  const url = `${strapiUrl}/api/articles?filters[slug][$eq]=${slug}&populate=*`;

  try {
    const res = await fetch(url, { next: { revalidate: 10 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.data || data.data.length === 0) return null;
    return data.data[0]; // ✅ Strapi v4 returns flat fields, not "attributes"
  } catch (err) {
    console.error("Error fetching single article:", err);
    return null;
  }
}

// --- Render rich text ---
function renderRichText(content: RichTextBlock[] | undefined) {
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
        const linkText =
          child.children?.map((c: RichTextChild) => c.text).join("") || "";
        return (
          <a
            key={cidx}
            href={child.url || "#"}
            className="text-blue-600 hover:underline"
          >
            {linkText}
          </a>
        );
      }
      return null;
    });

    switch (block.type) {
      case "heading":
        const Tag = `h${block.level || 2}` as keyof JSX.IntrinsicElements;
        return (
          <Tag key={idx} className="my-6 font-bold">
            {node}
          </Tag>
        );
      case "paragraph":
        return (
          <p key={idx} className="my-4">
            {node}
          </p>
        );
      case "list":
        const ListTag = block.format === "ordered" ? "ol" : "ul";
        return (
          <ListTag
            key={idx}
            className="list-disc list-inside my-4 space-y-2"
          >
            {block.children.map((li: RichTextChild, liIdx: number) => (
              <li key={liIdx}>
                {li.children?.map((c: RichTextChild) => c.text).join("")}
              </li>
            ))}
          </ListTag>
        );
      default:
        return null;
    }
  });
}

// --- Metadata ---
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title || "Untitled"} - TailorHire Blog`,
    description: article.seo_description || "",
  };
}

// --- Blog Page ---
export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  if (!article) notFound();

  const title = article.title || "Untitled";
  const author = article.author || "TailorHire Team";
  const publishedAt = article.publishedAt || new Date().toISOString();
  const contentHtml = renderRichText(article.content);
  const imageUrl =
    article.featured_image?.url ||
    article.featured_image?.formats?.medium?.url ||
    null;

  return (
    <div className="bg-white">
      <Navbar />
      <main className="pt-24 pb-16">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              {title}
            </h1>
            <p className="mt-4 text-md text-gray-500">
              By {author} on{" "}
              {new Date(publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </header>

          {imageUrl && (
            <div className="relative h-96 w-full mb-8 rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={imageUrl}
                alt={title}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          )}

          <div className="prose lg:prose-xl mx-auto">{contentHtml}</div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
