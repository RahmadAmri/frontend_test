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
const fmt = (n: number) => nf.format(n) + " ₽";
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
            Выбери подходящий для себя{" "}
            <span className="text-amber-400">тариф</span>
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
                <div className="relative rounded-[28px] border-[2.5px] border-amber-400 bg-[#3A3F41] px-8 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <span className="absolute -top-3 left-14 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow">
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-6 justify-items-center">
                {otherTariffs.map((t) => {
                  const isSelected = selectedId === t.id;
                  const pct = discount(t.price, t.full_price);
                  const showBadge = saleActive && pct > 0;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedId(t.id)}
                      className={`group relative w-40 h-60 rounded-[40px] text-left flex flex-col gap-16px
                      pt-[70px] pr-[21px] pb-[26px] pl-[21px]
                      bg-[#3A3F41]/95 border-2 border-[#5A5E61]
                      shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                      transition-[border,box-shadow,transform] duration-200 ease-out
                      hover:-translate-y-[1px]
                      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6EA1]/40
                      ${
                        isSelected
                          ? "border-[#FF6EA1] shadow-[0_8px_24px_rgba(255,110,161,0.22),inset_0_1px_0_rgba(255,255,255,0.05)]"
                          : "hover:border-[#6A6E71] hover:shadow-[0_8px_18px_rgba(0,0,0,0.25)]"
                      }`}
                    >
                      {showBadge && (
                        <span className="absolute -top-3 left-5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
                          -{pct}%
                        </span>
                      )}

                      <div className="flex items-center mb-5 gap-2 text-xl">
                        <span className="opacity-90">{t.period}</span>
                      </div>

                      {/* Price block */}
                      <div>
                        <div className="text-[32px] sm:text-[34px] leading-none font-extrabold tracking-tight">
                          {fmt(saleActive ? t.price : t.full_price)}
                        </div>
                        {saleActive && (
                          <div className="mt-1 ml-8 text-[13px] text-white/60 line-through">
                            {fmt(t.full_price)}
                          </div>
                        )}
                      </div>

                      <p className="mt-2 text-xs text-white/85">{t.text}</p>
                    </button>
                  );
                })}
              </div>

              {/* Info pill below cards */}
              <div className="flex items-start gap-3">
                <div className="mt-1 flex items-center gap-3 rounded-[22px] bg-[#3A3F41] border border-[#5A5E61] px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <Image
                    src="/assets/alert.png"
                    alt="Внимание"
                    width={18}
                    height={18}
                    className="w-[18px] h-[18px]"
                  />
                  <span className="text-sm text-white/90">
                    Следуя плану на 3 месяца и более, люди получают в 2 раза
                    лучший результат, чем за 1 месяц
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
                Нажимая кнопку «Купить», Пользователь соглашается на разовое
                списание денежных средств для получения пожизненного доступа к
                приложению. Пользователь соглашается, что данные
                кредитной/дебетовой карты будут сохранены для осуществления
                покупок дополнительных услуг сервиса в случае желания
                пользователя.
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
