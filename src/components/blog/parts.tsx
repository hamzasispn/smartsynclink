import Link from "next/link";
import type { BlogContent } from "@/content/blog";
import type { GlobalContent } from "@/content/global";
import type { Post } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { NewsletterForm } from "../newsletter-form";
import { Media } from "../ui";

/** The pieces the two blog pages share: the post tile and the newsletter band. */

/* ---------------------------------------------------------------------------
   The /blog index tiles.

   Measured off the reference: a 560×315 cover (16:9) with no radius of its
   own, the card clipping it, then 12/20/20 of padding around a 20/28 bold
   title and the date. The whole card is one link — the design gives it no
   separate "read more", so anything less than the full surface would be a
   smaller hit area than it looks.
--------------------------------------------------------------------------- */

export function PostTile({ post }: { post: Post }) {
  return (
    <article className="overflow-hidden rounded-[10px] bg-surface">
      <Link href={`/blog/${post.slug}`} className="group block">
        <Media
          image={{ src: post.cover, alt: post.title }}
          variant="plain"
          sizes="(max-width: 900px) 100vw, 560px"
          className="aspect-16/9 w-full rounded-none"
        />
        <div className="px-5 pt-3 pb-5">
          <h2 className="blog-heading text-[20px] leading-[28px] text-ink transition-colors group-hover:text-brand">
            {post.title}
          </h2>
          {post.published_at ? (
            <time
              dateTime={post.published_at}
              className="mt-3 block text-[16px] leading-[24px] text-muted"
            >
              {formatDate(post.published_at)}
            </time>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

/**
 * The band that splits the grid in half.
 *
 * Full bleed colour, 1160 of content inside it — the copy and form sit left,
 * the artwork right. With no artwork uploaded the text simply keeps its
 * column rather than stretching across the band, so the band still reads as
 * designed instead of as a wide empty stripe.
 */
/**
 * "Don't want to miss anything?" — the words are the blog's, the form is the
 * footer's: name, email, phone, business and industry, into GHL the same way.
 */
export function NewsletterBand({ blog, form }: { blog: BlogContent; form?: GlobalContent["footer"]["newsletter"] }) {
  const n = blog.newsletter;
  if (!form) return null;
  return (
    <section className="mt-16 bg-brand-soft">
      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-8 px-5 py-12 md:grid-cols-2 md:gap-14 md:py-16">
        <div>
          <h2 className="blog-heading text-[32px] leading-[40px] text-ink">
            {n.heading}
          </h2>
          <p className="mt-2 max-w-[38ch] text-[16px] leading-[24px] text-muted">
            {n.body}
          </p>
          {n.image?.src ? (
            <Media
              image={n.image}
              variant="plain"
              sizes="(max-width: 768px) 100vw, 560px"
              className="mt-8 aspect-16/10 w-full rounded-2xl"
            />
          ) : null}
        </div>

        {/* the footer's form, in a card like the footer's */}
        <div className="rounded-2xl bg-white p-6 shadow-[0_24px_48px_-32px_rgba(51,0,234,0.45)] sm:p-8">
          {/* into GHL as a contact tagged newsletter + newsletter-blog (+ its industry) */}
          <NewsletterForm
            where="blog"
            namePlaceholder={form.namePlaceholder}
            emailPlaceholder={form.placeholder}
            cta={form.cta.label}
            success={form.success}
            details={form}
            className="w-full"
          />
          <p className="mt-3 px-2 text-[13px] leading-snug text-muted">
            {n.note}{" "}
            <a href={n.noteLink.href} className="text-brand underline">
              {n.noteLink.label}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
