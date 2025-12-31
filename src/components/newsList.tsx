import React from "react";
import NewsEntry from "./newsEntry";
import { News } from "@/lib/types";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { Database } from "@/lib/database";
config.autoAddCss = false;

export default async function NewsList({
  news,
  altStyle,
}: Readonly<{
  news: News[];
  altStyle?: boolean;
}>) {
  const db = await Database.get();

  // Get all members for mention processing (only persons with memberInfo)
  const allMembers = await db.getManyMembers();

  const sortedNews = news.toSorted(
    (a, b) => b.time.getTime() - a.time.getTime(),
  );

  return (
    <div className="flex flex-col gap-0 min-w-0 w-full">
      {sortedNews.map((news, idx) => {
        return (
          <NewsEntry
            news={news}
            allMembers={allMembers}
            altStyle={(idx % 2 === 0) === (altStyle || false)}
            key={news.id}
          ></NewsEntry>
        );
      })}
    </div>
  );
}
