"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m} : ${s}`;
}

function CountdownBar() {
  const START = 16 * 60 - 1;
  const [left, setLeft] = useState(START);

  useEffect(() => {
    const id = setInterval(() => {
      setLeft((v) => (v > 0 ? v - 1 : 0));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-green-800 text-white py-3 px-4 text-center rounded-t-3xl relative">
      <div className="text-sm sm:text-base">
        Успейте открыть пробную неделю
        <span className="font-extrabold text-yellow-300 ml-2">
          • {formatTime(left)} •
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white py-10">
      <section className="max-w-6xl mx-auto rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl bg-neutral-900">
        <CountdownBar />

        <div className="px-6 sm:px-10 pb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-center mt-6">
            Выбери подходящий для себя тариф
          </h1>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Left: Image */}
            <div className="flex justify-center">
              <div className="p-2 border-4 border-purple-500 rounded-xl">
                <Image
                  src="/assets/athlete.png" // update the filename if different
                  alt="Атлет"
                  width={380}
                  height={760}
                  priority
                  className="h-auto w-auto"
                />
              </div>
            </div>

            {/* Right: Pricing */}
            <div className="space-y-5">
              {/* Lifetime highlight */}
              <div className="relative rounded-xl border border-amber-400/60 bg-neutral-800 p-4 sm:p-5">
                <div className="absolute -top-3 -right-3 bg-amber-400 text-black text-xs font-bold px-2 py-1 rounded">
                  ХИТ
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <span className="bg-red-500 text-white px-2 py-0.5 rounded font-bold">
                    -70%
                  </span>
                  <span className="opacity-80">Навсегда</span>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <span className="bg-amber-300 text-black font-extrabold px-3 py-1.5 rounded">
                    Skytrack P
                  </span>
                  <span className="line-through text-neutral-400 text-sm">
                    19 990 Р
                  </span>
                </div>
                <p className="mt-3 text-neutral-300 text-sm">
                  Для тех, кто хочет всегда быть в форме и поддерживать здоровье
                </p>
              </div>

              {/* Plans */}
              <div className="grid sm:grid-cols-3 gap-4">
                {/* 3 months */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-800 p-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-red-500 text-white px-2 py-0.5 rounded font-bold">
                      -50%
                    </span>
                    <span className="opacity-80">3 месяца</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-extrabold">1 990 Р</div>
                    <div className="text-xs text-neutral-400 line-through">
                      3 990 Р
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-neutral-300">
                    Привести тело в форму
                  </p>
                </div>

                {/* 1 month */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-800 p-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-orange-500 text-white px-2 py-0.5 rounded font-bold">
                      -40%
                    </span>
                    <span className="opacity-80">1 месяц</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-extrabold">990 Р</div>
                    <div className="text-xs text-neutral-400 line-through">
                      1 690 Р
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-neutral-300">
                    Можно получить первые результаты
                  </p>
                </div>

                {/* 1 week */}
                <div className="rounded-xl border border-neutral-800 bg-neutral-800 p-4">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-amber-600 text-white px-2 py-0.5 rounded font-bold">
                      -30%
                    </span>
                    <span className="opacity-80">1 неделя</span>
                  </div>
                  <div className="mt-3">
                    <div className="text-2xl font-extrabold">690 Р</div>
                    <div className="text-xs text-neutral-400 line-through">
                      990 Р
                    </div>
                  </div>
                  <p className="mt-3 text-sm text-neutral-300">
                    Чтобы просто начать
                  </p>
                </div>
              </div>

              {/* Agreement */}
              <label className="mt-2 flex items-start gap-3 text-xs text-neutral-300">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-neutral-600 bg-neutral-800 text-amber-400"
                />
                <span>
                  Я соглашаюсь с условиями предоставления услуг и Политикой
                  конфиденциальности
                </span>
              </label>

              {/* CTA */}
              <button className="w-full rounded-xl bg-amber-400 px-6 py-3 font-semibold text-black hover:bg-amber-300 active:translate-y-px transition">
                Купить
              </button>

              {/* Fine print */}
              <p className="text-[11px] leading-relaxed text-neutral-400">
                Следуя плану на 3 месяца и больше, люди получают до 2х раз
                лучших результатов. Мы не списываем деньги автоматически. Ты
                можешь отменить покупку в любой момент.
              </p>

              {/* Guarantee */}
              <div className="mt-6 rounded-2xl border border-green-700 p-4 text-green-400 bg-neutral-900/40">
                <div className="font-semibold">гарантия возврата 30 дней</div>
                <p className="mt-1 text-sm text-green-200/80">
                  Мы уверены, что наш план сработает для тебя и ты увидишь
                  видимые результаты уже через 4 недели! Мы даже готовы вернуть
                  твои деньги в течение 30 дней с момента покупки, если ты не
                  получишь видимых результатов.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
