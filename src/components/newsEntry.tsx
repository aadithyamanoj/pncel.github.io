"use client";
import React, { useContext } from "react";
import SelectedFontAwesomeIcon from "./icon";
import TagBadge from "./tagBadge";
import { processContent } from "@/lib/processContent";
import { config } from "@fortawesome/fontawesome-svg-core";
import { News, Person, Icon, TagType, NewsType } from "@/lib/types";
import DataContext from "@/app/context";
config.autoAddCss = false;

export default function NewsEntry({
  news,
  allMembers,
  altStyle,
}: Readonly<{
  news: News;
  allMembers: Person[];
  altStyle: boolean;
}>) {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error(
      "Source code error: NewsEntry must be used inside ContextProvider",
    );
  }

  const { useDarkTheme } = context;

  // Format date as MM/DD/YYYY with zero-padding
  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Get icon for news type
  const getNewsTypeIcon = (type?: NewsType): Icon | undefined => {
    switch (type) {
      case NewsType.award:
        return Icon.medal;
      case NewsType.publication:
        return Icon.document;
      case NewsType.tapeout:
        return Icon.chip;
      case NewsType.newmember:
        return Icon.userplus;
      case NewsType.graduation:
        return Icon.graduation;
      default:
        return undefined;
    }
  };

  return (
    <div
      className={
        `${altStyle || (useDarkTheme ? "bg-base-300" : "bg-base-200")} text-base-content ` +
        "flex flex-row items-start p-2 rounded-lg gap-3 max-w-5xl"
      }
    >
      {/* Left column: Date badge */}
      <div className="flex-none">
        <TagBadge
          tag={{
            label: formatDate(news.time),
            type: TagType.venue, // reuse venue tag's styling
            icon: Icon.calendar,
          }}
        />
      </div>

      {/* Right column: Everything else */}
      <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
        <p className="text-lg 2xl:text-xl">
          {getNewsTypeIcon(news.type) !== undefined && (
            <span className="mr-2">
              <SelectedFontAwesomeIcon icon={getNewsTypeIcon(news.type)!} />
            </span>
          )}
          <span
            dangerouslySetInnerHTML={{
              __html: processContent(news.news, allMembers),
            }}
          />
        </p>
        {news.tags && news.tags.length > 0 && (
          <div className="flex flex-row items-start gap-1 flex-wrap">
            {news.tags.map((tag, i) => (
              <TagBadge tag={tag} key={i} />
            ))}
          </div>
        )}
        {news.details && (
          <div
            className="text-sm 2xl:text-md"
            dangerouslySetInnerHTML={{
              __html: processContent(news.details, allMembers),
            }}
          />
        )}
        {news.attachments && news.attachments.length > 0 && (
          <div className="flex flex-row items-start gap-2 flex-wrap pt-1">
            {news.attachments.map((attachment, i) => (
              <a
                className="flex-none btn btn-xs btn-secondary px-2 py-1"
                href={attachment.link}
                target="_blank"
                key={i}
              >
                {attachment.icon === undefined ? undefined : (
                  <SelectedFontAwesomeIcon icon={attachment.icon} />
                )}
                {attachment.label}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
