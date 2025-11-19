"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

type TripType = "solo" | "couple" | "family" | "friends";

type Interest =
  | "nature"
  | "food"
  | "adventure"
  | "culture"
  | "shopping"
  | "relax";

interface ItineraryItem {
  day: number;
  title: string;
  description: string;
  morning: string;
  afternoon: string;
  evening: string;
}

interface RouteStop {
  name: string;
  distanceFromStart: string;
  timeNeeded: string;
  category: string;
  shortNote: string;
}

interface Hotel {
  name: string;
  area: string;
  priceRange: string;
  type: string;
  bestFor: string;
  rating: number;
  highlight: string;
}

interface BudgetBreakdown {
  totalBudget: number;
  accommodation: number;
  transport: number;
  food: number;
  activities: number;
  buffer: number;
}

const CURRENT_USER_KEY = "MapMyTrip_current_user";

export default function MapMyTrip() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const user = localStorage.getItem(CURRENT_USER_KEY);
    if (!user) {
      router.push("/login");
    }
  }, [router]);

  const [from, setFrom] = useState("Colombo");
  const [to, setTo] = useState("Ella");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [days, setDays] = useState(3);
  const [budget, setBudget] = useState(50000);
  const [people, setPeople] = useState(2);
  const [tripType, setTripType] = useState<TripType>("couple");
  const [interests, setInterests] = useState<Interest[]>([
    "nature",
    "food",
    "relax",
  ]);

  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);
  const [routeStops, setRouteStops] = useState<RouteStop[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [budgetBreakdown, setBudgetBreakdown] =
    useState<BudgetBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleInterest = (interest: Interest) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const generatedItinerary: ItineraryItem[] = Array.from(
      { length: days },
      (_, i) => {
        const day = i + 1;
        return {
          day,
          title:
            day === 1
              ? `Arrival & Scenic Route to ${to}`
              : day === days
              ? `Relax & Departure`
              : `Explore ${to} – Day ${day}`,
          description:
            day === 1
              ? `Start from ${from}, enjoy a relaxed drive with a few stops on the way before reaching ${to}.`
              : day === days
              ? `Slow morning, a few light activities, and head back towards ${from}.`
              : `Full exploration day around ${to} based on your interests.`,
          morning:
            tripType === "family"
              ? "Family-friendly viewpoint and easy walk."
              : "Light exploration and coffee with a view.",
          afternoon:
            interests.includes("food")
              ? "Local lunch spot + food crawl."
              : "Main attractions and photo stops.",
          evening:
            interests.includes("relax")
              ? "Sunset spot + chill time at the hotel."
              : "Night walk / market / street food.",
        };
      }
    );

    const generatedRouteStops: RouteStop[] = [
      {
        name: "Scenic Tea Estate Viewpoint",
        distanceFromStart: "45 km from start",
        timeNeeded: "30–45 mins",
        category: "Viewpoint",
        shortNote:
          "Short stop for photos, tea, and a restroom break with a classic hill-country view.",
      },
      {
        name: "Local Rice & Curry Spot",
        distanceFromStart: "95 km from start",
        timeNeeded: "45–60 mins",
        category: "Food",
        shortNote:
          "Affordable buffet-style Sri Lankan rice & curry, great for groups and families.",
      },
      {
        name: "Waterfall Stop",
        distanceFromStart: "130 km from start",
        timeNeeded: "45 mins",
        category: "Nature",
        shortNote:
          "Quick walk from the main road to a waterfall; good mid-journey stretch and photos.",
      },
      {
        name: "Town Viewpoint / Night Lights",
        distanceFromStart: "10 km before destination",
        timeNeeded: "20–30 mins",
        category: "Viewpoint",
        shortNote:
          "Stop for a panoramic view of the town before checking into your hotel.",
      },
    ];

    const generatedHotels: Hotel[] = [
      {
        name: `${to} Budget Haven`,
        area: `Central ${to}`,
        priceRange: "LKR 6,000 – 9,000/night",
        type: "Budget Guesthouse",
        bestFor: "Backpackers & students",
        rating: 4.2,
        highlight:
          "Simple, clean rooms with great views and walking distance to town.",
      },
      {
        name: `${to} Hillside Retreat`,
        area: `Upper ${to}`,
        priceRange: "LKR 10,000 – 16,000/night",
        type: "Mid-range Boutique",
        bestFor: "Couples & small families",
        rating: 4.6,
        highlight:
          "Cozy rooms, balcony views, and breakfast included. Perfect balance of comfort and price.",
      },
      {
        name: `${to} Valley View Resort`,
        area: `Just outside ${to}`,
        priceRange: "LKR 18,000 – 28,000/night",
        type: "Comfort Resort",
        bestFor: "Families & groups",
        rating: 4.8,
        highlight:
          "Spacious rooms, pool, and on-site restaurant. Great for relaxing after full exploration days.",
      },
    ];

    const totalBudget = budget || 0;
    const accommodation = Math.round(totalBudget * 0.4);
    const transport = Math.round(totalBudget * 0.25);
    const food = Math.round(totalBudget * 0.2);
    const activities = Math.round(totalBudget * 0.1);
    const buffer = totalBudget - (accommodation + transport + food + activities);

    const generatedBudgetBreakdown: BudgetBreakdown = {
      totalBudget,
      accommodation,
      transport,
      food,
      activities,
      buffer,
    };

    setTimeout(() => {
      setItinerary(generatedItinerary);
      setRouteStops(generatedRouteStops);
      setHotels(generatedHotels);
      setBudgetBreakdown(generatedBudgetBreakdown);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-emerald-50 text-slate-900">
      <header className="border-b border-emerald-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex justify-center">
              <Image
                src="/MapMyTrip.jpg"
                alt="MapMyTrip Logo"
                width={72}
                height={72}
                className="rounded-2xl shadow-md shadow-emerald-200"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight">
                MapMyTrip
              </h1>
              <p className="text-xs text-slate-600">
                AI-powered trip planner for Sri Lanka & beyond
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-3 text-xs md:flex">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 border border-emerald-200">
              SaaS Project
            </span>

            <Link
              href="/"
              className="rounded-lg border border-emerald-200 bg-white px-3 py-1 text-slate-700 hover:border-emerald-400 hover:text-emerald-700"
            >
              Logout
            </Link>
          </div>
        </div>
      </header>

      <main className="w-full px-6 py-8 max-w-[1400px] mx-auto">
        <div className="grid gap-8 md:grid-cols-2 w-full">

          {/* LEFT: FORM */}
          <section className="space-y-2 rounded-2xl border border-emerald-200 bg-white p-4 shadow-md shadow-emerald-100 md:p-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Plan your trip
            </h2>
            <p className="text-xs text-slate-600">
              Enter your trip details and let MapMyTrip generate a personalized
              itinerary, route stops, and hotel suggestions.
            </p>

            <form onSubmit={handleGenerate} className="space-y-4 text-sm">
              {/* From & To */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    From
                  </label>
                  <input
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                    placeholder="Starting city"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    To
                  </label>
                  <input
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                    placeholder="Destination city"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Start date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    End date
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  />
                </div>
              </div>

              {/* Days / People / Budget */}
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Trip length (days)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={days}
                    onChange={(e) =>
                      setDays(Math.min(10, Math.max(1, Number(e.target.value))))
                    }
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Travelers
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={people}
                    onChange={(e) =>
                      setPeople(
                        Math.min(10, Math.max(1, Number(e.target.value)))
                      )
                    }
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-700">
                    Total budget (LKR)
                  </label>
                  <input
                    type="number"
                    min={10000}
                    step={1000}
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60"
                  />
                </div>
              </div>

              {/* Trip type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Trip type
                </label>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      ["solo", "Solo"],
                      ["friends", "Friends/Group Travelers"],
                      ["content creaters", "Content Creaters"],
                      ["couple", "Couple"],
                      
                      ,
                    ] as [TripType, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setTripType(value)}
                      className={`rounded-full border px-3 py-1 text-xs transition ${
                        tripType === value
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-emerald-200 bg-emerald-50 text-slate-700 hover:border-emerald-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-slate-700">
                  Interests
                </label>
                <div className="flex flex-wrap gap-2 text-xs">
                  {(
                    [
                      ["nature", "Nature"],
                      ["food", "Food"],
                      ["adventure", "Adventure"],
                      ["culture", "Culture"],
                      ["shopping", "Shopping"],
                      ["relax", "Relax"],
                    ] as [Interest, string][]
                  ).map(([value, label]) => {
                    const active = interests.includes(value);
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => toggleInterest(value)}
                        className={`rounded-full border px-3 py-1 transition ${
                          active
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-emerald-200 bg-white text-slate-700 hover:border-emerald-400"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Submit */}
              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-slate-600">
                  This is a front-end demo. Replace the mock generators with AI
                  / API calls for production.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-emerald-200 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Generating…
                    </>
                  ) : (
                    <>Generate plan</>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* RIGHT: OUTPUT */}
          <section className="space-y-4">
            {/* Summary */}
            <div className="rounded-2xl border border-emerald-200 bg-white p-4 md:p-5 shadow-sm">
              <h2 className="text-sm font-semibold tracking-tight">
                Trip summary
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                {from} → {to} · {days} day trip · {people} traveler
                {people > 1 ? "s" : ""} · {tripType} · Budget: LKR{" "}
                {budget.toLocaleString("en-LK")}
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-slate-700">
                {interests.map((i) => (
                  <span
                    key={i}
                    className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-800 border border-emerald-100"
                  >
                    {i.charAt(0).toUpperCase() + i.slice(1)}
                  </span>
                ))}
              </div>
            </div>

            {/* Budget */}
            {budgetBreakdown && (
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 md:p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold tracking-tight">
                    Budget breakdown
                  </h2>
                  <span className="text-[11px] text-emerald-700">
                    Total: LKR{" "}
                    {budgetBreakdown.totalBudget.toLocaleString("en-LK")}
                  </span>
                </div>
                <div className="mt-3 grid gap-3 text-xs md:grid-cols-5">
                  {[
                    ["Stay", budgetBreakdown.accommodation],
                    ["Transport", budgetBreakdown.transport],
                    ["Food", budgetBreakdown.food],
                    ["Activities", budgetBreakdown.activities],
                    ["Buffer", budgetBreakdown.buffer],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-2"
                    >
                      <p className="text-[11px] text-slate-600">{label}</p>
                      <p className="mt-0.5 text-xs font-semibold text-slate-900">
                        LKR {(value as number).toLocaleString("en-LK")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Itinerary */}
            {itinerary.length > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 md:p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold tracking-tight">
                    Itinerary
                  </h2>
                  <div className="flex gap-2 text-[11px]">
                    <button className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-slate-700 hover:border-emerald-400">
                      Export as PDF
                    </button>
                    <button className="rounded-full border border-emerald-200 bg-white px-3 py-1 text-slate-700 hover:border-emerald-400">
                      Share trip link
                    </button>
                  </div>
                </div>

                <div className="mt-3 space-y-3 text-xs">
                  {itinerary.map((day) => (
                    <div
                      key={day.day}
                      className="rounded-xl border border-emerald-100 bg-emerald-50 p-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-semibold text-emerald-700">
                          Day {day.day}
                        </p>
                        <p className="text-[11px] text-slate-600">
                          {day.title}
                        </p>
                      </div>
                      <p className="mt-1 text-[11px] text-slate-700">
                        {day.description}
                      </p>
                      <div className="mt-2 grid gap-2 md:grid-cols-3">
                        <div className="rounded-lg bg-white border border-emerald-100 p-2">
                          <p className="text-[10px] uppercase text-slate-500">
                            Morning
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-900">
                            {day.morning}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white border border-emerald-100 p-2">
                          <p className="text-[10px] uppercase text-slate-500">
                            Afternoon
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-900">
                            {day.afternoon}
                          </p>
                        </div>
                        <div className="rounded-lg bg-white border border-emerald-100 p-2">
                          <p className="text-[10px] uppercase text-slate-500">
                            Evening
                          </p>
                          <p className="mt-0.5 text-[11px] text-slate-900">
                            {day.evening}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Route stops */}
            {routeStops.length > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 md:p-5 shadow-sm">
                <h2 className="text-sm font-semibold tracking-tight">
                  Places to visit on the route
                </h2>
                <p className="mt-1 text-[11px] text-slate-600">
                  Hand-picked stops between {from} and {to}. Great for
                  stretching your legs, eating, and enjoying the views.
                </p>
                <div className="mt-3 grid gap-3 text-xs md:grid-cols-2">
                  {routeStops.map((stop, idx) => (
                    <div
                      key={idx}
                      className="relative rounded-xl border border-emerald-100 bg-emerald-50 p-3"
                    >
                      <div className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white shadow-sm shadow-emerald-300">
                        {idx + 1}
                      </div>
                      <p className="pl-4 text-[11px] font-semibold text-slate-900">
                        {stop.name}
                      </p>
                      <p className="mt-0.5 pl-4 text-[11px] text-slate-600">
                        {stop.category} · {stop.timeNeeded}
                      </p>
                      <p className="mt-1 pl-4 text-[11px] text-slate-700">
                        {stop.shortNote}
                      </p>
                      <p className="mt-1 pl-4 text-[10px] text-slate-500">
                        Approx. {stop.distanceFromStart}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Hotels */}
            {hotels.length > 0 && (
              <div className="rounded-2xl border border-emerald-200 bg-white p-4 md:p-5 shadow-sm">
                <h2 className="text-sm font-semibold tracking-tight">
                  Hotel recommendations for your budget
                </h2>
                <p className="mt-1 text-[11px] text-slate-600">
                  Curated options near {to}. Replace this mocked list with real
                  hotel data or an external API.
                </p>
                <div className="mt-3 grid gap-3 text-xs md:grid-cols-3">
                  {hotels.map((hotel, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col rounded-xl border border-emerald-100 bg-emerald-50 p-3"
                    >
                      <p className="text-[11px] font-semibold text-slate-900">
                        {hotel.name}
                      </p>
                      <p className="mt-0.5 text-[11px] text-slate-600">
                        {hotel.area}
                      </p>
                      <p className="mt-1 text-[11px] text-emerald-700 font-medium">
                        {hotel.priceRange}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-700">
                        {hotel.highlight}
                      </p>
                      <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
                        <span>{hotel.type}</span>
                        <span>⭐ {hotel.rating.toFixed(1)}</span>
                      </div>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Best for: {hotel.bestFor}
                      </p>
                      <button className="mt-2 rounded-lg border border-emerald-300 bg-white px-3 py-1 text-[11px] text-emerald-700 hover:bg-emerald-50">
                        Add to trip
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {itinerary.length === 0 && !loading && (
              <div className="rounded-2xl border border-dashed border-emerald-300 bg-emerald-50 p-6 text-center text-xs text-slate-600">
                Fill out the trip details on the left and click{" "}
                <span className="font-semibold text-emerald-700">
                  “Generate plan”
                </span>{" "}
                to see your AI-assisted itinerary, route stops, and hotel
                recommendations.
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
