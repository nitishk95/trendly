import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const Home = () => {
  const [redditNews, setRedditNews] = useState([]);
  const [hnNews, setHnNews] = useState([]);
  const [redditSkip, setRedditSkip] = useState(0);
  const [hnSkip, setHnSkip] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchNews = async (source, skip, setter) => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/trends", {
        params: { source, skip, limit },
      });
      setter((prev) => [...prev, ...data]);
    } catch (err) {
      console.error(`Failed to fetch ${source} trends:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews("Reddit", 0, setRedditNews);
    fetchNews("HackerNews", 0, setHnNews);
  }, []);

  const loadMoreReddit = () => {
    const nextSkip = redditSkip + limit;
    setRedditSkip(nextSkip);
    fetchNews("Reddit", nextSkip, setRedditNews);
  };

  const loadMoreHackerNews = () => {
    const nextSkip = hnSkip + limit;
    setHnSkip(nextSkip);
    fetchNews("HackerNews", nextSkip, setHnNews);
  };

  const renderCard = (item, index) => (
    <Card
      key={index}
      className="hover:shadow-2xl transition-all flex flex-col rounded-2xl overflow-hidden"
    >
      <img
        src={`https://picsum.photos/seed/${item.title.length + index}/400/200`}
        alt="Post visual"
        className="w-full h-40 object-cover"
      />
      <CardHeader className="p-4">
        <CardTitle className="text-lg font-semibold line-clamp-2">
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 flex flex-col gap-2 text-sm text-gray-600">
        <div className="flex justify-between items-center">
          <p>
            Score: <span className="font-medium">{item.score}</span>
          </p>
          <Badge variant="outline">{item.category}</Badge>
        </div>
        <Button
          variant="link"
          size="sm"
          className="self-start p-0 mt-2 shine-link"
          asChild
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <ExternalLink className="w-4 h-4" />
            Visit Post
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      <h1 className="text-4xl font-bold text-center leading-tight">
        🧠 Stay in the Loop — Latest from Reddit & Hacker News
      </h1>

      {/* Hacker News Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-orange-600">🔥 Hacker News Highlights</h2>
          <Badge variant="secondary">HackerNews</Badge>
        </div>
        {loading && hnNews.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {hnNews.map(renderCard)}
          </div>
        )}
        <Button
          onClick={loadMoreHackerNews}
          disabled={loading}
          className="mx-auto mt-8 block text-white bg-orange-600 hover:bg-orange-700 transition-colors px-6 py-3 rounded-full shadow-lg"
        >
          {loading ? "Loading..." : "Load More Hacker News"}
        </Button>
      </section>

      {/* Reddit Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-indigo-600">👾 Reddit Buzz</h2>
          <Badge variant="secondary">Reddit</Badge>
        </div>
        {loading && redditNews.length === 0 ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {redditNews.map(renderCard)}
          </div>
        )}
        <Button
          onClick={loadMoreReddit}
          disabled={loading}
          className="mx-auto mt-8 block text-white bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-3 rounded-full shadow-lg"
        >
          {loading ? "Loading..." : "Load More Reddit"}
        </Button>
      </section>

      {/* Shine animation style */}
      <style jsx>{`
        .shine-link {
          background: linear-gradient(to right, #3b82f6, #9333ea, #3b82f6);
          background-size: 200% auto;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shine 2s linear infinite;
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

export default Home;
