import { metadataTmpl } from "@/lib/utils";
import DefaultMain from "@/layouts/defaultMain";
import DefaultMDX from "@/layouts/defaultMdx";
import NewsList from "@/components/newsList";
import { Database } from "@/lib/database";

export const metadata = {
  ...metadataTmpl,
  title: metadataTmpl.title + " | News",
};

export default async function News() {
  const db = await Database.get();
  const allNews = await db.getManyNews();

  return (
    <DefaultMain>
      <DefaultMDX>
        <h1 className="lg:pb-4">News</h1>
        {allNews.length == 0 && <p>No news items yet. Check back soon!</p>}
      </DefaultMDX>
      {allNews.length > 0 && <NewsList news={allNews} />}
    </DefaultMain>
  );
}
