import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  const query: string | null = url.searchParams.get('query');
  if (query === null) {
    // Handle the case when 'query' is not present in the URL
    return new Response(
      JSON.stringify({ error: 'Query parameter is missing' }),
      {
        status: 400, // Bad Request status code
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
  const allBlogArticles: CollectionEntry<'blog'>[] = await getCollection(
    'blog'
  );
  // Filter articles based on query
  const searchResults: CollectionEntry<'blog'>[] = allBlogArticles.filter(
    (article) => {
      const titleMatch: boolean = article.data.title
        .toLowerCase()
        .includes(query!.toLowerCase());
      const bodyMatch: boolean = article.body
        .toLowerCase()
        .includes(query!.toLowerCase());
      const slugMatch: boolean = article.slug
        .toLowerCase()
        .includes(query!.toLowerCase());

      // Include the article in searchResults if any of the conditions match
      return titleMatch || bodyMatch || slugMatch;
    }
  );

  return new Response(JSON.stringify(searchResults), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
