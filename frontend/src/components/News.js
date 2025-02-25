import React, { useState, useEffect } from "react";
import { Clock, Newspaper } from "lucide-react";
import { format } from "date-fns";
import { ArrowUpRight, Calendar, User } from "lucide-react";
import TickerTape from "./TickerTape";
const NewsFeed = () => {
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(
        "https://www.alphavantage.co/query?function=NEWS_SENTIMENT&tickers=AAPL&apikey=demo"
      );
      const data = await response.json();
      console.log(data);
      
      setNews(data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch news data");
      setLoading(false);
    }
  };



  const getSentimentColor = (label) => {
    const colors = {
      Bullish: "text-green-600",
      "Somewhat-Bullish": "text-green-400",
      Neutral: "text-gray-600",
      "Somewhat-Bearish": "text-red-400",
      Bearish: "text-red-600",
    };
    return colors[label] || "text-gray-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600 animate-pulse">
          Loading news feed...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-6 rounded-xl bg-red-50 border border-red-200 shadow-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full max-w-2xl p-6">
      <TickerTape/>
      <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-6 rounded-md">
        <Newspaper className="h-8 w-8" />
        <h1 className="text-2xl font-bold">Financial News Feed</h1>
      </div>

      <div className="space-y-6">
        {news?.feed?.map((item, index) => (
          <NewsCard key={index} news={item} />
        ))}
      </div>
    </div>
  );
};

function NewsCard({ news }) {
  const {
    banner_image,
    category_within_source,
    overall_sentiment_label,
    title,
    summary,
    authors,
    time_published,
    ticker_sentiment,
    url,
  } = news;
  const formatDate = (dateString) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    const time = dateString.slice(9, 11) + ":" + dateString.slice(11, 13);
    return `${month}/${day}/${year} ${time}`;
  };
  return (
    <div className="mx-auto overflow-hidden border rounded-lg shadow-lg bg-white">
      <div className="p-0">
        <img src={banner_image} alt={title} className="w-full h-64 object-cover" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className="text-xs font-semibold px-2 py-1 bg-gray-200 text-gray-700 rounded">
            {category_within_source}
          </span>
          <span className="text-xs px-2 py-1 border border-gray-300 text-gray-700 rounded">
            {overall_sentiment_label}
          </span>
        </div>
        <h2 className="text-2xl font-bold mb-2 line-clamp-2">{title}</h2>
        <p className="text-gray-600 mb-4 line-clamp-3">{summary}</p>
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <User className="w-4 h-4 mr-1" />
          <span className="mr-4">{authors[0]}</span>
          <Calendar className="w-4 h-4 mr-1" />
          <span>{formatDate(time_published)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ticker_sentiment?.map((ticker) => (
            <span
              key={ticker?.ticker_sentiment_score}
              className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded"
            >
              {ticker?.ticker}-
              {ticker?.ticker_sentiment_score}
            </span>
          ))}
        </div>
      </div>
      <div className="bg-gray-100 p-4">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-blue-600 hover:underline flex items-center"
        >
          Read full article
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
}

export default NewsFeed;
