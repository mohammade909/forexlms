import React, { useMemo, useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ArrowUp, ArrowDown } from "lucide-react";

const TradingDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=demo"
      );
      const json = await response.json();
      setData(json);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const processedData = useMemo(() => {
    if (!data || !data["Time Series (5min)"]) return [];
    
    return Object.entries(data["Time Series (5min)"])
      .map(([timestamp, values]) => ({
        time: timestamp.split(" ")[1],
        open: parseFloat(values["1. open"]),
        high: parseFloat(values["2. high"]),
        low: parseFloat(values["3. low"]),
        close: parseFloat(values["4. close"]),
        volume: parseInt(values["5. volume"]),
      }))
      .reverse();
  }, [data]);

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex items-center justify-center h-64">
        <p className="text-xl">Loading trading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex items-center justify-center h-64">
        <p className="text-xl text-red-500">Error loading data: {error}</p>
      </div>
    );
  }

  if (!data || !processedData.length) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4 flex items-center justify-center h-64">
        <p className="text-xl">No trading data available</p>
      </div>
    );
  }

  const latestPrice = processedData[processedData.length - 1];
  const previousPrice = processedData[processedData.length - 2];
  const priceChange = latestPrice.close - previousPrice.close;
  const priceChangePercent = (priceChange / previousPrice.close) * 100;

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-4">
      <div>
        <div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold">
                {data["Meta Data"]["2. Symbol"]}
              </span>
              <span className="ml-4 text-gray-500">
                Last Updated: {data["Meta Data"]["3. Last Refreshed"]}
              </span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                ${latestPrice.close.toFixed(2)}
              </span>
              <div
                className={`ml-4 flex items-center ${
                  priceChange >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {priceChange >= 0 ? (
                  <ArrowUp className="w-5 h-5" />
                ) : (
                  <ArrowDown className="w-5 h-5" />
                )}
                <span className="ml-1">
                  {Math.abs(priceChange).toFixed(2)} (
                  {Math.abs(priceChangePercent).toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="h-64 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <XAxis dataKey="time" />
                <YAxis domain={["auto", "auto"]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="close"
                  stroke="#2563eb"
                  dot={false}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={processedData}>
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="volume" fill="#93c5fd" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-xl font-bold mb-4">Trading Statistics</h2>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Open</p>
                <p className="text-lg font-semibold">
                  ${latestPrice.open.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Close</p>
                <p className="text-lg font-semibold">
                  ${latestPrice.close.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">High</p>
                <p className="text-lg font-semibold">
                  ${latestPrice.high.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Low</p>
                <p className="text-lg font-semibold">
                  ${latestPrice.low.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <div>
            <h2 className="text-xl font-bold mb-4">Market Information</h2>
          </div>
          <div>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Interval</p>
                <p className="text-lg font-semibold">
                  {data["Meta Data"]["4. Interval"]}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Time Zone</p>
                <p className="text-lg font-semibold">
                  {data["Meta Data"]["6. Time Zone"]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingDashboard;