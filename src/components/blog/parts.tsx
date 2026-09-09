import Link from "next/link";
import type { BlogContent } from "@/content/blog";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { Media } from "../ui";

/**
 * The pieces the two blog pages share.
 *
 * They live together because the same row appears in three sizes across the
 * design — a wide featured row, a compact sidebar line, a card in the related
 * grid — and keeping them in one file makes the differences easy to see.
 */

/** "admin | January 3, 2025" — the byline that sits above every title. */
export function Byline({
  post,
  byline,
  className = "",
}: {
  post: Post;
  byline: string;
  className?: string;
}) {
  return (
    <p className={`flex items-center gap-2.5 text-[13px] text-muted ${className}`}>
      <span>{byline}</span>
      <span aria-hidden="true" className="text-line">|</span>
      {post.published_at ? (
        <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
      ) : null}
    </p>
  );
}

/** The blue pill link that closes every article summary. */
export function ReadLink({
  href,
  label,
  className = "",
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-5 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90 ${className}`}
    >
      {label}
      <span aria-hidden="true">→</span>
    </Link>
  );
}

/** Featured column: image left, everything else right. */
export function FeaturedRow({
  post,
  blog,
}: {
  post: Post;
  blog: BlogContent;
}) {
  return (
    <article className="grid gap-6 sm:grid-cols-[220px_1fr] sm:items-start">
      <Link href={`/blog/${post.slug}`} className="block">
        <Media
          image={{ src: post.cover, alt: post.title }}
          variant="plain"
          sizes="(max-width: 640px) 100vw, 220px"
          className="aspect-4/3 w-full rounded-[10px]"
        />
      </Link>

      <div className="flex flex-col items-start">
        <Byline post={post} byline={blog.byline} />
        <h3 className="mt-2.5 text-[19px] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>
        {post.excerpt ? (
          <p className="mt-2.5 line-clamp-3 text-[14px] leading-[1.6] text-[#1E1E1E]">
            {post.excerpt}
          </p>
        ) : null}
        <ReadLink
          href={`/blog/${post.slug}`}
          label={blog.readLabel}
          className="mt-5"
        />
      </div>
    </article>
  );
}

/** Sidebar: a thumbnail and two lines, nothing else. */
export function RecentRow({ post, byline }: { post: Post; byline: string }) {
  return (
    <article className="grid grid-cols-[74px_1fr] items-start gap-3.5">
      <Link href={`/blog/${post.slug}`} className="block">
        <Media
          image={{ src: post.cover, alt: post.title }}
          variant="plain"
          sizes="74px"
          className="aspect-4/3 w-full rounded-[8px]"
        />
      </Link>
      <div>
        <Byline post={post} byline={byline} className="text-[11px]" />
        <h3 className="mt-1 line-clamp-2 text-[13px] font-medium leading-[1.4] text-ink">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand">
            {post.title}
          </Link>
        </h3>
      </div>
    </article>
  );
}

/** The related grid, and the single larger card in the sidebar. */
export function PostCard({ post, blog }: { post: Post; blog: BlogContent }) {
  return (
    <article className="flex flex-col items-start">
      <Link href={`/blog/${post.slug}`} className="block w-full">
        <Media
          image={{ src: post.cover, alt: post.title }}
          variant="plain"
          sizes="(max-width: 768px) 100vw, 380px"
          className="aspect-16/10 w-full rounded-[10px]"
        />
      </Link>
      <Byline post={post} byline={blog.byline} className="mt-4" />
      <h3 className="mt-2 text-[17px] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
        <Link href={`/blog/${post.slug}`} className="hover:text-brand">
          {post.title}
        </Link>
      </h3>
      {post.excerpt ? (
        <p className="mt-2 line-clamp-3 text-[13.5px] leading-[1.6] text-[#1E1E1E]">
          {post.excerpt}
        </p>
      ) : null}
      <ReadLink
        href={`/blog/${post.slug}`}
        label={blog.readLabel}
        className="mt-5"
      />
    </article>
  );
}

/**
 * A column label.
 *
 * The rule underneath belongs to the heads that sit above a list — Featured
 * Article, Recent post, Related blog post. Search and Newsletter label a
 * single box and carry no rule in the design.
 */
export function ColumnHead({
  children,
  rule = true,
}: {
  children: React.ReactNode;
  rule?: boolean;
}) {
  return (
    <h2
      className={`text-[15px] font-medium text-ink ${
        rule ? "border-b border-line pb-3" : ""
      }`}
    >
      {children}
    </h2>
  );
}

/**
 * Newsletter sign-up.
 *
 * A plain form with no action yet — there is no list to post to. Wiring it to
 * a provider is one `action` attribute; leaving it inert is honest until then.
 */
export function Newsletter({ blog }: { blog: BlogContent }) {
  return (
    <div className="rounded-[18px] bg-white p-6 shadow-card">
      <p className="text-[17px] font-medium leading-[1.4] tracking-[-0.01em] text-ink">
        {blog.newsletter.body}
      </p>

      {/* One pill: the field fills it and the button is flush to the right,
          its outer corner cut by the parent rather than rounded itself, so
          the two never disagree about the curve. */}
      <form className="mt-5 flex overflow-hidden rounded-full border border-line bg-white">
        <label className="sr-only" htmlFor="newsletter-email">
          {blog.newsletter.placeholder}
        </label>
        <input
          id="newsletter-email"
          type="email"
          required
          placeholder={blog.newsletter.placeholder}
          className="min-w-0 flex-1 bg-transparent px-5 py-2.5 text-[14px] text-ink outline-none placeholder:text-muted"
        />
        <button className="shrink-0 bg-gradient-to-r from-[#052EFF] to-[#3300EA] px-6 text-[14px] font-medium text-white transition-opacity hover:opacity-90">
          {blog.newsletter.cta}
        </button>
      </form>
    </div>
  );
}
