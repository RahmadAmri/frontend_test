"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Tariff = {
  id: string;
  period: string;
  price: number;
  full_price: number;
  is_best: boolean;
  text: string;
};

const API_URL = "https://t-core.fit-hub.pro/Test/GetTariffs";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m} : ${s}`;
}

const nf = new Intl.NumberFormat("ru-RU");
const fmt = (n: number) => nf.format(n) + " Р";
const discount = (price: number, full: number) =>
  Math.max(0, Math.round(100 - (price / full) * 100));

export default function Home() {
  const START = 120;
  const [left, setLeft] = useState(START);
  const urgent = left <= 30 && left > 0;
  const saleActive = left > 0;

  const [tariffs, setTariffs] = useState<Tariff[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [agree, setAgree] = useState(false);
  const [agreeError, setAgreeError] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    let alive = true;
    fetch(API_URL, { cache: "no-store" })
      .then((r) => r.json())
      .then((data: Tariff[]) => {
        if (!alive) return;
        setTariffs(data);
        const def = data.find((t) => t.is_best) ?? data[0];
        if (def) setSelectedId(def.id);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const bestTariff = useMemo(() => tariffs.find((t) => t.is_best), [tariffs]);
  const otherTariffs = useMemo(
    () => tariffs.filter((t) => !t.is_best),
    [tariffs]
  );

  return (
    <main className="min-h-screen bg-neutral-900 text-white pt-24 pb-10">
      {/* Fixed header timer */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 text-white text-center py-3 ${
          urgent ? "bg-red-600 animate-pulse" : "bg-green-800"
        } rounded-b-2xl`}
      >
        <span className="text-sm sm:text-base">
          Успейте открыть пробную неделю
          <span className="font-extrabold ml-2 text-yellow-300">
            • {formatTime(left)} •
          </span>
        </span>
      </div>

      <section className="max-w-6xl mx-auto rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
        <div className="px-6 sm:px-10 pb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mt-6">
            Выбери подходящий для себя тариф
          </h1>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Image */}
            <div className="flex justify-center">
              <div className="p-2 rounded-xl">
                <Image
                  src="/assets/body.png"
                  alt="Атлет"
                  width={381}
                  height={767}
                  priority
                  className="h-auto w-[381px]"
                />
              </div>
            </div>

            {/* Right: Pricing */}
            <div className="space-y-5">
              {/* Lifetime highlight from API */}
              {bestTariff && (
                <div className="relative rounded-[28px] border-[3px] border-amber-400 bg-neutral-800/90 px-6 py-6 md:px-8 md:py-7">
                  <span className="absolute -top-3 left-14 bg-rose-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
                    -{discount(bestTariff.price, bestTariff.full_price)}%
                  </span>
                  <span className="absolute top-3 right-4 text-amber-300 font-semibold">
                    хит!
                  </span>

                  <div className="md:flex md:items-center md:gap-10">
                    {/* Left: title + price */}
                    <div className="md:w-1/2">
                      <h3 className="text-2xl md:text-3xl font-semibold text-center md:text-left">
                        {bestTariff.period}
                      </h3>

                      {/* Prices with small crossfade */}
                      <div className="mt-2">
                        <div className="relative h-[60px] md:h-[72px]">
                          {/* Discount price (visible only while saleActive) */}
                          <div
                            className={`absolute inset-0 flex items-center transition-opacity duration-300 ${
                              saleActive
                                ? "opacity-100"
                                : "opacity-0 pointer-events-none"
                            }`}
                          >
                            <div className="text-[40px] md:text-[56px] font-extrabold text-amber-300 leading-none tracking-tight">
                              {fmt(bestTariff.price)}
                            </div>
                          </div>
                          {/* Full price as main after timer */}
                          <div
                            className={`absolute inset-0 flex items-center transition-opacity duration-300 ${
                              saleActive
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100"
                            }`}
                          >
                            <div className="text-[40px] md:text-[56px] font-extrabold text-amber-300 leading-none tracking-tight">
                              {fmt(bestTariff.full_price)}
                            </div>
                          </div>
                        </div>

                        {/* Old price (strike) while discount is active */}
                        {saleActive && (
                          <div className="mt-2 text-neutral-400 line-through text-lg md:text-xl">
                            {fmt(bestTariff.full_price)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Right: description */}
                    <p className="md:w-1/2 mt-4 md:mt-0 text-sm md:text-base text-neutral-200">
                      {bestTariff.text}
                    </p>
                  </div>
                </div>
              )}

              {/* Plans from API */}
              <div className="grid sm:grid-cols-3 gap-4 justify-items-center">
                {otherTariffs.map((t) => {
                  const isSelected = selectedId === t.id;
                  const pct = discount(t.price, t.full_price);
                  const showBadge = saleActive && pct > 0;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      className={`relative rounded-[22px] p-5 w-[240px] h-[335px] flex flex-col justify-between text-left transition border bg-neutral-800
                        ${
                          isSelected
                            ? "border-pink-400 shadow-[0_0_0_3px_rgba(244,114,182,0.35)]"
                            : "border-neutral-800 hover:border-neutral-700"
                        }`}
                    >
                      <div className="flex items-center gap-2 text-xs">
                        {showBadge && (
                          <span className="bg-rose-500 text-white px-2 py-0.5 rounded font-bold">
                            -{pct}%
                          </span>
                        )}
                        <span className="opacity-80">{t.period}</span>
                      </div>

                      {/* Price block */}
                      <div className="mt-1">
                        <div className="text-2xl font-extrabold">
                          {fmt(saleActive ? t.price : t.full_price)}
                        </div>
                        {saleActive && (
                          <div className="text-xs text-neutral-400 line-through">
                            {fmt(t.full_price)}
                          </div>
                        )}
                      </div>

                      <p className="mt-3 text-sm text-neutral-300">{t.text}</p>
                    </button>
                  );
                })}
              </div>

              {/* Info pill below cards */}
              <div className="flex items-start gap-3">
                <div className="shrink-0 mt-1 h-6 w-6 rounded-full bg-neutral-700/70 flex items-center justify-center">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    className="text-amber-300"
                  >
                    <path
                      fill="currentColor"
                      d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 14h-2v-6h2v6Zm0-8h-2V6h2v2Z"
                    />
                  </svg>
                </div>
                <div className="flex-1 bg-neutral-800 text-neutral-200 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <span className="text-sm">
                    Следуя плану на 3 месяца и более, люди получают в 2 раза
                    лучший результат, чем за 1 месяц
                  </span>
                  <span className="ml-3 shrink-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-md">
                    Skytrack
                  </span>
                </div>
              </div>

              {/* Agreement */}
              <label
                className={`mt-2 flex items-start gap-3 text-xs ${
                  agreeError ? "text-red-400" : "text-neutral-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => {
                    setAgree(e.target.checked);
                    setAgreeError(false);
                  }}
                  className={`mt-0.5 h-4 w-4 rounded bg-neutral-800 ${
                    agreeError
                      ? "border-red-500 ring-2 ring-red-500"
                      : "border-neutral-600"
                  } text-amber-400`}
                />
                <span>
                  Я соглашаюсь с офертой рекуррентных платежей и Политикой
                  конфиденциальности
                </span>
              </label>

              {/* CTA */}
              <button
                onClick={() => {
                  if (!agree) {
                    setAgreeError(true);
                    return;
                  }
                  alert("Покупка оформлена (демо).");
                }}
                className="w-full rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300 active:translate-y-px transition shadow-lg animate-pulse"
              >
                Купить
              </button>

              {/* Fine print */}
              <p className="text-[11px] leading-relaxed text-neutral-400">
                Следуя плану на 3 месяца и более, люди получают в 2 раза лучшие
                результаты, чем за 1 месяц. Мы не списываем деньги
                автоматически. Можно отменить покупку в любой момент.
              </p>
            </div>
          </div>
        </div>

        {/* Guarantee at bottom */}
        <div className="mt-10 rounded-2xl border border-green-700 p-4 text-green-400 bg-neutral-900/40 max-w-4xl mx-auto">
          <div className="font-semibold">гарантия возврата 30 дней</div>
          <p className="mt-1 text-sm text-green-200/80">
            Мы уверены, что наш план сработает для тебя и ты увидишь видимые
            результаты уже через 4 недели! Мы даже готовы вернуть твои деньги в
            течение 30 дней с момента покупки, если ты не получишь видимых
            результатов.
          </p>
        </div>
      </section>
    </main>
  );
}
