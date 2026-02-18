import { useLoaderData } from "react-router";
import { Image } from "@shopify/hydrogen";
import { redirectIfHandleIsLocalized } from "~/lib/redirect";
const meta = ({ data }) => {
  return [{ title: `Hydrogen | ${data?.article.title ?? ""} article` }];
};
async function loader(args) {
  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return { ...deferredData, ...criticalData };
}
async function loadCriticalData({ context, request, params }) {
  const { blogHandle, articleHandle } = params;
  if (!articleHandle || !blogHandle) {
    throw new Response("Not found", { status: 404 });
  }
  const [{ blog }] = await Promise.all([
    context.storefront.query(ARTICLE_QUERY, {
      variables: { blogHandle, articleHandle }
    })
    // Add other queries here, so that they are loaded in parallel
  ]);
  if (!blog?.articleByHandle) {
    throw new Response(null, { status: 404 });
  }
  redirectIfHandleIsLocalized(
    request,
    {
      handle: articleHandle,
      data: blog.articleByHandle
    },
    {
      handle: blogHandle,
      data: blog
    }
  );
  const article = blog.articleByHandle;
  return { article };
}
function loadDeferredData({ context }) {
  return {};
}
function Article() {
  const { article } = useLoaderData();
  const { title, image, contentHtml, author } = article;
  const publishedDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(article.publishedAt));
  return <div className="article">
      <h1>
        {title}
        <div>
          <time dateTime={article.publishedAt}>{publishedDate}</time> &middot;{" "}
          <address>{author?.name}</address>
        </div>
      </h1>

      {image && <Image data={image} sizes="90vw" loading="eager" />}
      <div
    dangerouslySetInnerHTML={{ __html: contentHtml }}
    className="article"
  />
    </div>;
}
const ARTICLE_QUERY = `#graphql
  query Article(
    $articleHandle: String!
    $blogHandle: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    blog(handle: $blogHandle) {
      handle
      articleByHandle(handle: $articleHandle) {
        handle
        title
        contentHtml
        publishedAt
        author: authorV2 {
          name
        }
        image {
          id
          altText
          url
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;
export {
  Article as default,
  loader,
  meta
};
