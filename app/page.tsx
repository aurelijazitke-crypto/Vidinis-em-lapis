"use client";

import { useMemo, useState } from "react";

type Step = "intro" | "quiz" | "results";

const QUESTIONS = [
  "Man sunku prašyti pagalbos.",
  "Dažnai jaučiuosi nepastebėtas(-a).",
  "Bijau būti atstumtas(-a).",
  "Linkstu prisitaikyti prie kitų.",
  "Dažnai save kritikuoju.",
  "Kai stresuoju, imu viską kontroliuoti.",
  "Poilsio metu man sunku atsipalaiduoti.",
  "Jaučiu, kad mano vertė priklauso nuo to, kiek padarau.",
  "Kai būna per daug, imu emociškai atsijungti.",
  "Santykiuose greitai aktyvuojasi palikimo baimė."
];

const SCALE = [
  { label: "Niekada", value: 0 },
  { label: "Retai", value: 1 },
  { label: "Kartais", value: 2 },
  { label: "Dažnai", value: 3 },
  { label: "Beveik visada", value: 4 }
];

type ResultRow = {
  title: string;
  short: string;
  description: string;
  percent: number;
};

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress">
      <div className="progressFill" style={{ width: `${value}%` }} />
    </div>
  );
}

function ResultChart({ items }: { items: ResultRow[] }) {
  return (
    <div className="chart">
      {items.map((item) => (
        <div className="chartRow" key={item.title}>
          <div className="chartHead">
            <span>{item.short}</span>
            <strong>{item.percent}%</strong>
          </div>
          <div className="chartTrack">
            <div className="chartBar" style={{ width: `${item.percent}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Page() {
  const [step, setStep] = useState<Step>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const total = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const answeredCount = answers.filter((v) => v !== undefined).length;
  const progress = Math.round((answeredCount / total) * 100);

  const resultData = useMemo<ResultRow[]>(() => {
    const sum = answers.reduce((a, b) => a + (b ?? 0), 0);
    const max = total * 4;
    const base = max === 0 ? 0 : Math.round((sum / max) * 100);

    return [
      {
        title: "Gėdos žaizda",
        short: "Gėda",
        description: "Jautrumas vertinimui, atmetimui ir baimė būti pamatytam tikram.",
        percent: Math.min(100, Math.max(25, base + 8))
      },
      {
        title: "Kontrolės apsauga",
        short: "Kontrolė",
        description: "Saugumas siejamas su aiškumu, valdymu ir numatymu.",
        percent: Math.min(100, Math.max(20, base))
      },
      {
        title: "Vidinio kritiko apsauga",
        short: "Kritikas",
        description: "Vidinis balsas spaudžia, taiso ir kritikuoja.",
        percent: Math.min(100, Math.max(15, base - 6))
      },
      {
        title: "Atsijungimo raminimo būdas",
        short: "Atsijungimas",
        description: "Per didelė įtampa reguliuojama atsitraukimu nuo jausmų ar kontakto.",
        percent: Math.min(100, Math.max(10, base - 10))
      }
    ].sort((a, b) => b.percent - a.percent);
  }, [answers]);

  const top3 = resultData.slice(0, 3);

  const resultSummary = useMemo(() => {
    if (!top3.length) return "Rezultatai apskaičiuoti pagal tavo atsakymus.";
    return `Ryškiausiai matosi ${top3.map((item) => item.title.toLowerCase()).join(", ")} temos.`;
  }, [top3]);

  function handleAnswer(value: number) {
    const next = [...answers];
    next[currentIndex] = value;
    setAnswers(next);
  }

  function nextStep() {
    if (answers[currentIndex] === undefined) return;

    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setStep("results");
  }

  function prevStep() {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  }

  function resetTest() {
    setStep("intro");
    setCurrentIndex(0);
    setAnswers([]);
    setEmail("");
    setConsent(false);
    setMessage("");
    setSending(false);
  }

  async function handleEmailSubmit() {
    setMessage("");

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage("Įvesk teisingą el. pašto adresą.");
      return;
    }

    if (!consent) {
      setMessage("Pažymėk sutikimą gauti rezultatus el. paštu.");
      return;
    }

    try {
      setSending(true);

      const response = await fetch("/api/request-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          consent,
          results: {
            top3,
            all: resultData
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Nepavyko išsiųsti duomenų.");
      }

      setMessage("Puiku. Tavo užklausa priimta. Vėliau čia prijungsime pilnos analizės siuntimą el. paštu.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Įvyko klaida.");
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="pageShell">
      <div className="bgGlow bgGlowOne" />
      <div className="bgGlow bgGlowTwo" />

      <div className="container">
        {step === "intro" && (
          <section className="heroCard">
            <div className="heroLeft">
              <h1>Tavo vidinis žemėlapis</h1>
              <p className="lead">
                Šis testas padeda pamatyti, kokie emociniai modeliai, apsaugos ir
                reakcijos į stresą šiuo metu gali stipriausiai veikti tavo
                santykius, savivertę ir kasdienę būseną.
              </p>

              <div className="featureGrid">
                <div className="featureCard">
                  <h3>Trumpas formatas</h3>
                  <p>Aiškūs klausimai, patogi eiga ir progreso juosta nuo pradžios iki pabaigos.</p>
                </div>
                <div className="featureCard">
                  <h3>Momentinė apžvalga</h3>
                  <p>Po testo žmogus pamato diagramą, pagrindinius aktyvumus ir trumpą interpretaciją.</p>
                </div>
                <div className="featureCard">
                  <h3>Pilnesnė analizė</h3>
                  <p>Po mini rezultatų galima palikti el. paštą ir gauti pilnesnį paaiškinimą.</p>
                </div>
              </div>

              <button className="primaryBtn" onClick={() => setStep("quiz")}>
                Pradėti testą
              </button>
            </div>

            <div className="heroRight">
              <div className="illustrationCard">
                <div className="orb orb1" />
                <div className="orb orb2" />
                <div className="orb orb3" />
                <div className="illustrationContent">
                  <div className="miniBadge">Emocijų žemėlapis</div>
                  <div className="miniChart">
                    <div className="miniChartBar" style={{ height: "78%" }} />
                    <div className="miniChartBar" style={{ height: "58%" }} />
                    <div className="miniChartBar" style={{ height: "88%" }} />
                    <div className="miniChartBar" style={{ height: "66%" }} />
                  </div>
                  <div className="miniLines">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {step === "quiz" && (
          <section className="quizLayout">
            <div className="quizCard">
              <div className="quizTop">
                <div>
                  <div className="eyebrow">Progresas</div>
                  <div className="progressMeta">
                    {answeredCount} iš {total} atsakyta
                  </div>
                </div>
                <div className="progressNumber">{progress}%</div>
              </div>

              <ProgressBar value={progress} />

              <div className="questionCard">
                <div className="questionCounter">
                  Klausimas {currentIndex + 1} / {total}
                </div>
                <h2>{currentQuestion}</h2>
              </div>

              <div className="answersGrid">
                {SCALE.map((option) => {
                  const selected = answers[currentIndex] === option.value;
                  return (
                    <button
                      key={option.value}
                      className={`answerCard ${selected ? "selected" : ""}`}
                      onClick={() => handleAnswer(option.value)}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>

              <div className="actionRow">
                <button className="secondaryBtn" onClick={prevStep} disabled={currentIndex === 0}>
                  Atgal
                </button>

                <button
                  className="primaryBtn"
                  onClick={nextStep}
                  disabled={answers[currentIndex] === undefined}
                >
                  {currentIndex === total - 1 ? "Peržiūrėti rezultatus" : "Kitas"}
                </button>
              </div>
            </div>

            <aside className="sideCard">
              <div className="sideBadge">Kas vyksta</div>
              <h3>Tavo atsakymai kuria žemėlapį</h3>
              <p>
                Testo pabaigoje bus parodyta trumpa rezultatų suvestinė su
                diagrama, o po to žmogus galės paprašyti pilnesnės analizės el. paštu.
              </p>

              <div className="sideStat">
                <strong>{total}</strong>
                <span>Klausimų</span>
              </div>
              <div className="sideStat">
                <strong>1</strong>
                <span>Mini rezultatų puslapis</span>
              </div>
              <div className="sideStat">
                <strong>1</strong>
                <span>El. pašto forma pilnai analizei</span>
              </div>
            </aside>
          </section>
        )}

        {step === "results" && (
          <section className="resultsLayout">
            <div className="resultsMain">
              <div className="resultsHero">
                <div className="eyebrow">Tavo rezultatų apžvalga</div>
                <h2>Mini rezultatų suvestinė</h2>
                <p>{resultSummary}</p>
              </div>

              <div className="topCards">
                {top3.map((item, index) => (
                  <div className="topResultCard" key={item.title}>
                    <div className="topLabel">TOP {index + 1}</div>
                    <h3>{item.title}</h3>
                    <div className="scoreCircle">
                      <span>{item.percent}%</span>
                    </div>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="panel">
                <div className="panelHeader">
                  <h3>Rezultatų diagrama</h3>
                  <span>Vizualinė apžvalga</span>
                </div>
                <ResultChart items={resultData} />
              </div>

              <div className="panel">
                <div className="panelHeader">
                  <h3>Trumpa lentelė</h3>
                  <span>Pagrindinės sritys</span>
                </div>

                <div className="tableLike">
                  {resultData.map((item) => (
                    <div className="tableRow" key={item.title}>
                      <div className="tableMain">
                        <strong>{item.title}</strong>
                        <p>{item.description}</p>
                      </div>
                      <div className="tableScore">{item.percent}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <aside className="emailCard">
              <div className="emailArtwork">
                <div className="emailGlow" />
                <div className="mailIcon">✦</div>
              </div>

              <div className="eyebrow">Pilna analizė</div>
              <h3>Gauk pilnesnį rezultatų paaiškinimą el. paštu</h3>
              <p>
                Įvesk savo el. paštą ir pateik užklausą pilnesnei analizei.
              </p>

              <label className="inputLabel">El. paštas</label>
              <input
                className="emailInput"
                type="email"
                placeholder="vardas@pastas.lt"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label className="checkboxWrap">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                />
                <span>
                  Sutinku gauti savo testo rezultatus ir susijusią informaciją el. paštu.
                </span>
              </label>

              <button className="primaryBtn fullWidth" onClick={handleEmailSubmit} disabled={sending}>
                {sending ? "Siunčiama..." : "Gauti pilną analizę"}
              </button>

              {message && <div className="messageBox">{message}</div>}

              <button className="ghostBtn fullWidth" onClick={resetTest}>
                Kartoti testą
              </button>
            </aside>
          </section>
        )}
      </div>
    </main>
  );
}
