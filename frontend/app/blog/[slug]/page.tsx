// app/blog/[slug]/page.tsx

import { notFound } from "next/navigation";
import Image from "next/image";

async function getArticle(slug: string) {
  const baseUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    process.env.STRAPI_API_URL ||
    "http://127.0.0.1:1337";

  const url = `${baseUrl}/api/articles?filters[slug][$eq]=${encodeURIComponent(
    slug
  )}&populate=featured_image`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    console.error("Fetch article failed:", res.status, await res.text());
    return null;
  }
  const data = await res.json();
  return data.data?.[0] ?? null;
}

function renderRichText(content: any[]) {
  if (!Array.isArray(content)) return null;

  return content.map((block: any, idx: number) => {
    const children = block.children || [];

    const node = children.map((child: any, cidx: number) => {
      if (!child) return null;

      // Text node
      if (child.type === "text") {
        let txt = child.text || "";
        // Replace newline with <br>
        txt = txt.replace(/\n/g, "<br>");
        // Apply formatting
        if (child.bold) txt = `<strong>${txt}</strong>`;
        if (child.italic) txt = `<em>${txt}</em>`;
        if (child.underline) txt = `<u>${txt}</u>`;
        return <span key={cidx} dangerouslySetInnerHTML={{ __html: txt }} />;
      }

      // Link node
      if (child.type === "link") {
        const linkText = (child.children || [])
          .map((gc: any) => gc.text || "")
          .join("");
        return (
          <a
            key={cidx}
            href={child.url}
            className="text-blue-600 underline hover:text-blue-800"
            target={child.url.startsWith("http") ? "_blank" : "_self"}
            rel="noopener noreferrer"
          >
            {linkText}
          </a>
        );
      }

      // fallback
      return null;
    });

    // Render block types
    switch (block.type) {
      case "heading":
        const level = block.level || 3;
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        return <Tag key={idx} className="text-xl font-bold my-4">{children.map(c => c.text || "").join("")}</Tag>;

      case "paragraph":
        return (
          <p key={idx} className="my-4">
            {node}
          </p>
        );

      case "list":
        return (
          <ul key={idx} className="list-disc ml-6 my-4">
            {(block.children || []).map((li: any, liIdx: number) => (
              <li key={liIdx}>
                {(li.children || []).map((gc: any) => gc.text || "").join("")}
              </li>
            ))}
          </ul>
        );

      default:
        return <p key={idx}>{children.map(c => c.text || "").join("")}</p>;
    }
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);
  if (!article) return notFound();

  const { title, author, content, featured_image, createdAt } = article;

  // Determine image URL
  let imageUrl: string | null = null;
  if (featured_image) {
    imageUrl =
      featured_image.formats?.medium?.url ||
      featured_image.url ||
      null;
  }

  return (
    <article className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{title || "Untitled"}</h1>
      <p className="text-gray-500 mb-6">
        By {author || "TailorHire Team"} •{" "}
        {createdAt ? new Date(createdAt).toLocaleDateString() : ""}
      </p>

      {imageUrl && (
        <div className="mb-6">
          <Image
            src={`${(process.env.NEXT_PUBLIC_STRAPI_URL ||
              process.env.STRAPI_API_URL ||
              "http://127.0.0.1:1337")}${imageUrl}`}
            alt={title}
            width={800}
            height={450}
            className="rounded-lg object-cover"
          />
        </div>
      )}

      <div className="prose prose-lg">{renderRichText(content)}</div>
    </article>
  );
}
