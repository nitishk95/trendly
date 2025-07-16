import React, { useEffect, useState } from "react";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Devlopers = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const perPage = 6;

  const fetchArticles = async (pageNumber = 1) => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/devto-articles?page=${pageNumber}&perPage=${perPage}`
      );
      if (data.length < perPage) {
        setHasMore(false);
      }
      setArticles((prev) => [...prev, ...data]);
      setPage(pageNumber);
    } catch (err) {
      console.error("Failed to fetch Dev.to articles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleLoadMore = () => {
    fetchArticles(page + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-50 via-white to-purple-100 py-12 px-4 sm:px-8 lg:px-20">
      <h1 className="text-4xl font-bold text-center text-purple-700 mb-4 shine-text">
        🚀 Explore Fresh Dev.to Articles
      </h1>
      <p className="text-center text-gray-600 mb-12 max-w-3xl mx-auto">
        Discover the latest articles from Dev.to — covering web development, AI, open source, and everything in between. Updated daily and handpicked from the tech community.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <div
            key={index}
            className="bg-white shadow-xl border border-purple-100 rounded-2xl overflow-hidden transform transition hover:scale-[1.02] hover:shadow-purple-300/50"
          >
            <img
              src={article.cover_image || article.social_image}
              alt={article.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-6 flex flex-col justify-between h-full">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                  {article.title}
                </h2>
                <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                  {article.description}
                </p>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Badge className="bg-purple-100 text-purple-800 capitalize">
                  {article.category || "general"}
                </Badge>
                <span className="text-gray-500 text-sm">🔥 {article.score}</span>
              </div>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                Read on Dev.to
              </a>
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div className="text-center mt-10 text-gray-500">Loading more articles...</div>
      )}

      {!loading && hasMore && (
        <Button
          onClick={handleLoadMore}
          className="mx-auto mt-10 block text-white bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-3 rounded-full shadow-lg"
        >
          Load More
        </Button>
      )}

      {!hasMore && (
        <div className="text-center mt-10 text-gray-500">
          🎉 You've reached the end of the feed!
        </div>
      )}

      {/* Shine animation */}
      <style jsx>{`
        .shine-text {
          background: linear-gradient(to right, #7c3aed, #ec4899, #7c3aed);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 4s linear infinite;
        }

        @keyframes shine {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
};

export default Devlopers;
