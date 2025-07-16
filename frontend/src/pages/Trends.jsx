import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { Badge } from '@/components/ui/badge';

const categoryOptions = [
  { value: 'all', label: 'All' },
  { value: 'Reddit', label: 'Reddit' },
  { value: 'HackerNews', label: 'Hacker News' },
  { value: 'Twitter', label: 'Twitter' },
  { value: 'Others', label: 'Others' },
];

const TrendsPage = () => {
  const [trends, setTrends] = useState([]);
  const [category, setCategory] = useState('all');
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchTrends = async (reset = false) => {
    setLoading(true);
    try {
      const params = {
        limit,
        skip: reset ? 0 : skip,
      };

      if (category !== 'all') {
        params.source = category;
      }

      const res = await axios.get('http://localhost:5000/api/trends', { params });

      if (reset) {
        setTrends(res.data);
        setSkip(limit);
      } else {
        setTrends((prev) => [...prev, ...res.data]);
        setSkip((prev) => prev + limit);
      }
    } catch (err) {
      console.error('Error fetching trends:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [category]);

  const groupedTrends = trends.reduce((acc, trend) => {
    const group = trend.source || trend.category || 'Other';
    if (!acc[group]) acc[group] = [];
    acc[group].push(trend);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-gray-700 text-blue-800 dark:text-blue-300 text-sm font-semibold rounded-full shadow-sm animate-pulse">
            🚀 Discover What the Internet is Talking About – Right Now!
          </div>
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2">
            🌐 Trending Now
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Stay updated with viral posts from Reddit, Hacker News, Twitter & more.
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="w-full max-w-xs">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grouped Cards */}
        <div className="space-y-12">
          {Object.entries(groupedTrends).map(([group, items]) => {
            if (category !== 'all' && group !== category) return null;

            return (
              <div key={group}>
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                  {group === 'Reddit' && (
                    <img
                      src="https://www.redditstatic.com/desktop2x/img/favicon/apple-icon-57x57.png"
                      alt="Reddit"
                      className="w-6 h-6"
                    />
                  )}
                  {group === 'HackerNews' && (
                    <img
                      src="https://news.ycombinator.com/favicon.ico"
                      alt="HN"
                      className="w-6 h-6"
                    />
                  )}
                  {group}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((trend, idx) => (
                    <Card
                      key={idx}
                      className="hover:shadow-xl transition-shadow bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl"
                    >
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2 text-gray-800 dark:text-gray-100">
                          {trend.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-3">
                          {trend.summary || trend.description || 'No summary available.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge variant="outline">{trend.category || trend.source}</Badge>
                          <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">
                            Score: {trend.score}
                          </span>
                        </div>
                        <a
                          href={trend.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          🔗 Read full article
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Load More Button */}
        {trends.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={() => fetchTrends(false)}
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition"
            >
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {/* Chart */}
        {trends.length > 0 && (
          <div className="mt-16">
            <Card className="bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                  📈 Trend Score Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <LineChart width={900} height={320} data={trends.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="title" hide />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendsPage;
