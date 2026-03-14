"use client";

import { useMemo, useState } from "react";

type Step = "intro" | "quiz" | "emailGate" | "results";
type GroupType = "žaizdos" | "apsaugos" | "raminimo būdai";

type CategoryKey =
  | "shameWound"
  | "abandonmentWound"
  | "invisibilityWound"
  | "worthinessWound"
  | "unsafetyWound"
  | "peoplePleasing"
  | "controlProtector"
  | "perfectionismProtector"
  | "overworkingProtector"
  | "innerCriticProtector"
  | "angerSoother"
  | "dissociationSoother"
  | "suppressionSoother"
  | "overthinkingSoother"
  | "withdrawalSoother";

type Question = {
  id: number;
  text: string;
  category: CategoryKey;
};

type CategoryMeta = {
  group: GroupType;
  title: string;
  short: string;
  intro: string;
  explanation: string;
  impact: string;
  howToBegin: string[];
};

type ResultItem = {
  key: CategoryKey;
  group: GroupType;
  title: string;
  short: string;
  intro: string;
  explanation: string;
  impact: string;
  howToBegin: string[];
  raw: number;
  max: number;
  percent: number;
};

const SCALE = [
  { label: "Niekada", value: 0 },
  { label: "Retai", value: 1 },
  { label: "Kartais", value: 2 },
  { label: "Dažnai", value: 3 },
  { label: "Beveik visada", value: 4 }
];

const CATEGORY_META: Record<CategoryKey, CategoryMeta> = {
  shameWound: {
    group: "žaizdos",
    title: "Gėdos žaizda",
    short: "Gėda",
    intro:
      "Tai jautrumas vertinimui, atmetimui ir baimė būti pamatytam tokiam, koks esi iš tikrųjų.",
    explanation:
      "Kai ši žaizda aktyvi, žmogus dažnai jaučia, kad su juo kažkas ne taip. Tada kyla poreikis slėpti pažeidžiamumą, tikrąją nuomonę, poreikius ar net savo natūralų spontaniškumą. Iš išorės tai gali atrodyti kaip santūrumas, stiprumas ar kontrolė, bet viduje dažnai veikia įtampa ir savęs vertinimas.",
    impact:
      "Kasdienybėje tai gali reikštis nuolatiniu savęs stebėjimu, noru neapsijuokti, jautrumu kritikai ir sunkumu atsipalaiduoti santykyje. Žmogus gali būti labai funkcionalus, bet kartu retai jaustis saugus būti savimi.",
    howToBegin: [
      "Pastebėk, kur save sumažini, kad tik nebūtum įvertintas ar neteisingai suprastas.",
      "Pradėk vardyti savo poreikius paprastais sakiniais, net jei pradžioje tai atrodo nepatogu.",
      "Sąmoningai atskirk faktus nuo vidinio savęs menkinimo balso."
    ]
  },
  abandonmentWound: {
    group: "žaizdos",
    title: "Palikimo žaizda",
    short: "Palikimas",
    intro:
      "Tai baimė būti paliktam, pakeistam, emociškai pamestam ar nebesvarbiam santykyje.",
    explanation:
      "Kai ši žaizda aktyvi, net mažas atstumas, tylėjimas ar kito žmogaus nuotaikos pokytis gali būti interpretuojamas kaip ryšio praradimo ženklas. Tuomet įsijungia nerimas, bandymas greitai atkurti artumą arba stiprus savęs kaltinimas.",
    impact:
      "Tai gali reikštis prisirišimu, per dideliu jautrumu santykių dinamikai, skausmingu laukimu, įsivaizdavimu blogiausių scenarijų ir baime būti nepakankamam, kad ryšys išliktų.",
    howToBegin: [
      "Kai kyla nerimas, pirmiausia atskirk faktą nuo interpretacijos.",
      "Neskubėk automatiškai gelbėti santykio vien todėl, kad atsirado neaiškumas.",
      "Lavink gebėjimą kalbėti apie savo baimes tiesiai, o ne per kontrolę ar prisitaikymą."
    ]
  },
  invisibilityWound: {
    group: "žaizdos",
    title: "Nematomumo žaizda",
    short: "Nematomumas",
    intro:
      "Tai jausmas, kad tavo balsas, poreikiai ar tikras buvimas lieka nepastebėti.",
    explanation:
      "Kai ši žaizda aktyvi, žmogus gali išmokti mažinti save, mažiau prašyti, mažiau reikalauti, tarsi iš anksto prisitaikydamas prie minties, kad jo vis tiek iki galo neišgirs. Išoriškai tai gali atrodyti kaip ramumas ar kuklumas, bet viduje kaupiasi vienišumas ir nuoskauda.",
    impact:
      "Tai gali reikštis sunkumu aiškiai kalbėti, polinkiu nutylėti, jausmu, kad tenka viską susitvarkyti pačiam, ir slapta viltimi, kad kiti patys supras be žodžių.",
    howToBegin: [
      "Pradėk nuo mažų, aiškių pageidavimų vietoje laukimo, kad kiti supras savaime.",
      "Pastebėk situacijas, kuriose save sumažini automatiškai.",
      "Treniruok balsą: sakyk trumpai, aiškiai ir be ilgų pasiteisinimų."
    ]
  },
  worthinessWound: {
    group: "žaizdos",
    title: "Bevertiškumo žaizda",
    short: "Bevertiškumas",
    intro:
      "Tai būsena, kai vertė siejama su rezultatu, nauda, produktyvumu ar tuo, kiek duodi kitiems.",
    explanation:
      "Kai ši žaizda aktyvi, žmogus retai jaučiasi vertingas vien dėl to, kad yra. Vertė tampa projektu: reikia nusipelnyti, įrodyti, būti naudingu, nepavargti, nenuvilti. Tada poilsis ir priėmimas gali atrodyti tarsi nepelnyta prabanga.",
    impact:
      "Kasdienybėje tai dažnai reiškiasi perdėtu darbu, sunkumu ilsėtis, kaltės jausmu, kai nieko neveiki, ir nuolatiniu vidiniu klausimu, ar aš tikrai pakankamas.",
    howToBegin: [
      "Stebėk, kur tavo vertė automatiškai susiejama su veikimu ar nauda.",
      "Leisk sau bent mažose situacijose nieko neįrodinėti.",
      "Praktikuok mintį, kad vertė nėra užduotis, kurią reikia nuolat atlikti."
    ]
  },
  unsafetyWound: {
    group: "žaizdos",
    title: "Nesaugumo žaizda",
    short: "Nesaugumas",
    intro:
      "Tai būsena, kai net tada, kai išoriškai viskas ramu, nervų sistema lieka budri ir įsitempusi.",
    explanation:
      "Kai ši žaizda aktyvi, pasitikėti tampa sunku, o atsipalaiduoti atrodo rizikinga. Žmogus gali nuolat skenuoti aplinką, stengtis iš anksto numatyti grėsmes, vengti nežinomybės ir manyti, kad saugumas įmanomas tik viską suvaldžius.",
    impact:
      "Tai pasireiškia kūno įtampa, sunkumu ilsėtis, jautrumu netikėtumams, poreikiu viską iš anksto suprasti ir baime paleisti kontrolę.",
    howToBegin: [
      "Pastebėk, kada tavo kūnas elgiasi lyg būtų pavojuje, nors realios grėsmės nėra.",
      "Rinkis mažus sąmoningo atsipalaidavimo momentus vietoje bandymo iškart paleisti viską.",
      "Atskirk saugumą nuo visiškos kontrolės."
    ]
  },
  peoplePleasing: {
    group: "apsaugos",
    title: "Įtikimo apsauga",
    short: "Įtikimas",
    intro:
      "Tai apsauga, kai ryšys saugomas per prisitaikymą, nuolaidžiavimą ir savo poreikių mažinimą.",
    explanation:
      "Ši apsauga dažnai išsivysto ten, kur tiesus savęs reiškimas buvo rizikingas. Tuomet žmogus išmoksta būti patogus, geras, supratingas, nenuviliantis. Iš pirmo žvilgsnio tai atrodo kaip švelnumas, bet ilgainiui tai kainuoja tikrumą ir ribas.",
    impact:
      "Tai gali reikštis sunkumu pasakyti ne, automatiniu prisitaikymu, baime nuliūdinti kitus ir jausmu, kad santykio ramybė yra svarbesnė už savo vidinę tiesą.",
    howToBegin: [
      "Pastebėk, kur sakai taip, nors kūnas jau sako ne.",
      "Pradėk nuo labai mažų ribų kasdienėse situacijose.",
      "Mokykis atskirti gerumą nuo savęs išdavystės."
    ]
  },
  controlProtector: {
    group: "apsaugos",
    title: "Kontrolės apsauga",
    short: "Kontrolė",
    intro:
      "Tai apsauga, kai saugumas kuriamas per valdymą, aiškumą ir norą viską numatyti iš anksto.",
    explanation:
      "Kai ši apsauga stipri, neapibrėžtumas gali būti labai sunkiai pakeliamas. Tuomet protas bando viską sustatyti į vietas, sukurti planą, užkirsti kelią klaidoms ar staigmenoms. Kontrolė tampa bandymu nuslopinti vidinį nerimą.",
    impact:
      "Tai gali pasireikšti įtampa, dirglumu, sunkumu deleguoti, poreikiu greitai žinoti, kas vyksta, ir stipria reakcija į pokyčius, kurių negali suvaldyti.",
    howToBegin: [
      "Paklausk savęs, ar čia tikrai reikia daugiau kontrolės, ar daugiau saugumo.",
      "Sąmoningai leisk kai kurioms smulkmenoms likti netobuloms.",
      "Stebėk, ką bandai suvaldyti išorėje, kai viduje kyla nerimas."
    ]
  },
  perfectionismProtector: {
    group: "apsaugos",
    title: "Perfekcionizmo apsauga",
    short: "Perfekcionizmas",
    intro:
      "Tai apsauga, kai klaidų vengimas tampa būdu apsisaugoti nuo gėdos, kritikos ar atmetimo.",
    explanation:
      "Ši apsauga dažnai atrodo kaip aukšti standartai, bet jos šaknis dažniausiai yra ne meilė kokybei, o baimė suklysti. Tuomet žmogus verčiau pervargsta, vilkina arba perdirba, nei leidžia sau būti tiesiog pakankamai geras.",
    impact:
      "Kasdienybėje tai reiškiasi spaudimu, vilkinimu, nuolatiniu savo rezultato taisymu ir jausmu, kad padaryta nepakankamai, net kai objektyviai viskas yra gerai.",
    howToBegin: [
      "Pradėk sąmoningai užbaigti kai kuriuos dalykus ne idealiai, o pakankamai gerai.",
      "Stebėk, kur aukštas standartas slepia baimę būti sukritikuotam.",
      "Mokykis vertinti progresą, o ne tik tobulumą."
    ]
  },
  overworkingProtector: {
    group: "apsaugos",
    title: "Perdėto darbo apsauga",
    short: "Perdarbas",
    intro:
      "Tai apsauga, kai nerimas reguliuojamas per veikimą, produktyvumą ir nuolatinį užimtumą.",
    explanation:
      "Kai ši apsauga aktyvi, sustoti gali būti sunkiau negu dirbti. Veikimas tampa ne tik darbu, bet ir būdu nenugrimzti į jausmus, tuštumą ar nepakankamumo pojūtį. Tada poilsis ima kelti kaltę ar net įtampą.",
    impact:
      "Tai pasireiškia nuolatiniu užimtumu, sunkumu ilsėtis, poreikiu jaustis naudingu ir įpročiu save vertinti pagal tai, kiek padarei šiandien.",
    howToBegin: [
      "Pastebėk, kada darbas tampa reguliacijos priemone, o ne tik užduotimi.",
      "Įtrauk mažas pauzes be bandymo jų nusipelnyti.",
      "Leisk sau bent trumpai pabūti be produktyvumo tapatybės."
    ]
  },
  innerCriticProtector: {
    group: "apsaugos",
    title: "Vidinio kritiko apsauga",
    short: "Vidinis kritikas",
    intro:
      "Tai apsauga, kai žmogus pats save spaudžia ir kritikuoja tarsi bandydamas apsaugoti nuo išorinio vertinimo.",
    explanation:
      "Vidinis kritikas dažnai atrodo kaip objektyvus balsas, bet iš tiesų jis dažnai tik atkartoja išmoktą spaudimą. Jo logika paprasta: jei pirmas save sukritikuosiu aš, gal niekas kitas nebeturės galios to padaryti skaudžiau.",
    impact:
      "Tai pasireiškia griežtu vidiniu tonu, sunkumu džiaugtis savo progresu, nuolatiniu savęs taisymu ir įpročiu daugiau matyti trūkumus nei augimą.",
    howToBegin: [
      "Išmok atpažinti savo vidinio balso toną, o ne tik jo turinį.",
      "Keisk vidinę kalbą iš baudžiančios į aiškią ir brandžią.",
      "Paklausk savęs, ar šis balsas padeda augti, ar tik palaiko baimę."
    ]
  },
  angerSoother: {
    group: "raminimo būdai",
    title: "Pykčio raminimo būdas",
    short: "Pyktis",
    intro:
      "Tai būdas greitai atgauti jėgą ir ribas per pykčio energiją, kai viduje per daug pažeidžiamumo.",
    explanation:
      "Pyktis pats savaime nėra problema. Tačiau kai jis tampa pagrindiniu reguliacijos keliu, po juo dažnai slepiasi bejėgiškumas, skausmas, atstūmimo baimė ar nuovargis. Tuomet pykčio energija padeda nejausti to, kas po juo.",
    impact:
      "Tai gali pasireikšti dirglumu, aštresniu tonu, staigesnėmis reakcijomis, greitu gynybiškumu ir sunkumu išbūti švelnesniuose jausmuose.",
    howToBegin: [
      "Kai kyla pyktis, paklausk savęs, kas slepiasi po juo.",
      "Prieš reaguodamas į santykį, pirmiausia sureguliuok kūną.",
      "Mokykis naudoti pykčio energiją riboms, o ne sprogimui."
    ]
  },
  dissociationSoother: {
    group: "raminimo būdai",
    title: "Atsijungimo raminimo būdas",
    short: "Atsijungimas",
    intro:
      "Tai būdas išgyventi per atsitraukimą nuo kūno, emocijų, kontakto ar buvimo čia ir dabar.",
    explanation:
      "Kai įtampos per daug, nervų sistema gali pasirinkti ne kovą ir ne bėgimą, o nutolimą. Tada žmogus tarsi aptemsta, atšąla, tampa sunkiau jausti, susikaupti ar būti gyvame ryšyje. Tai nėra tingumas ar abejingumas, tai reguliacijos forma.",
    impact:
      "Kasdienybėje tai gali reikštis sunkumu būti kontakte, noru pabėgti į telefoną, miglotu jausmu, kad savęs nėra iki galo, arba emociniu užsidarymu, kai viduje per daug.",
    howToBegin: [
      "Pastebėk pirmus signalus, kada pradedi tolti nuo savęs.",
      "Grįžk per kūno pojūčius: pėdas, kvėpavimą, atramą, temperatūrą.",
      "Rinkis mažus grįžimus į kontaktą vietoje savęs spaudimo iškart jausti viską."
    ]
  },
  suppressionSoother: {
    group: "raminimo būdai",
    title: "Slopinimo raminimo būdas",
    short: "Slopinimas",
    intro:
      "Tai būdas nuslopinti skausmą, poreikius ar emocinį diskomfortą, kad būtų lengviau funkcionuoti.",
    explanation:
      "Kai jausmai anksčiau atrodė per dideli, nepatogūs ar nepageidaujami, žmogus galėjo išmokti juos greitai užspausti. Išoriškai tai gali atrodyti kaip racionalumas ir susitvardymas, bet viduje dažnai kaupiasi neužbaigta emocinė įtampa.",
    impact:
      "Tai pasireiškia nutylėjimu, jausmų atidėjimu, sunkumu pravirkti ar tiesiai įvardyti savo poreikius, taip pat įpročiu pirmiausia tvarkyti situaciją, o ne save.",
    howToBegin: [
      "Pradėk vardyti būsenas paprastai, nespausdamas savęs iškart visko giliai suprasti.",
      "Mokykis atpažinti, kada 'aš tvarkausi' iš tiesų reiškia 'aš užspaudžiu'.",
      "Leisk sau jausti mažomis dozėmis, užuot bandęs būti visiškai stiprus."
    ]
  },
  overthinkingSoother: {
    group: "raminimo būdai",
    title: "Pergalvojimo raminimo būdas",
    short: "Pergalvojimas",
    intro:
      "Tai būdas nusiraminti bandant viską pergalvoti, numatyti ir suprasti iki galo.",
    explanation:
      "Pergalvojimas dažnai atrodo kaip brandus analizavimas, tačiau neretai tai yra proto strategija perimti kontrolę ten, kur kūnas jaučia nerimą. Tuomet mąstymas nebeveda į aiškumą, o tik sukuria uždarą ratą.",
    impact:
      "Tai pasireiškia scenarijų kūrimu, nuolatiniu savęs ir kitų analizavimu, sunkumu paleisti mintį ir įpročiu ieškoti tobulo atsakymo, kad tik nejaustum neapibrėžtumo.",
    howToBegin: [
      "Paklausk savęs, ar dabar mąstai tam, kad suprastum, ar tam, kad nusiramintum.",
      "Kai mintys sukasi ratu, grįžk iš proto į kūną.",
      "Leisk kai kuriems klausimams likti neišspręstiems bent trumpam."
    ]
  },
  withdrawalSoother: {
    group: "raminimo būdai",
    title: "Atsitraukimo raminimo būdas",
    short: "Atsitraukimas",
    intro:
      "Tai būdas apsisaugoti per tylą, užsidarymą, atsitraukimą ir emocinį nuotolį.",
    explanation:
      "Kai ryšys atrodo pavojingas, apkraunantis ar per daug aktyvuojantis, žmogus gali rinktis atsitraukti. Taip trumpam atsiranda daugiau erdvės kvėpuoti, bet kartu gali stiprėti vienišumo ir nesupratimo jausmas.",
    impact:
      "Tai pasireiškia dingimu iš kontakto, užsisklendimu, sunkumu pratęsti pokalbį apie jausmus ir įpročiu pirmiausia nueiti į save, kai tik kyla vidinė įtampa.",
    howToBegin: [
      "Pastebėk, kada atsitraukimas tau iš tiesų padeda, o kada tik atitolina nuo sprendimo.",
      "Pradėk įvardyti, kad tau reikia laiko, vietoje tyliai dingti iš kontakto.",
      "Kur įmanoma, grįžk į ryšį mažais žingsniais, o ne tik tada, kai jau visiškai saugu."
    ]
  }
};

const QUESTIONS: Question[] = [
  { id: 1, text: "Man sunku prašyti pagalbos.", category: "invisibilityWound" },
  { id: 2, text: "Dažnai jaučiuosi nepastebėtas(-a).", category: "invisibilityWound" },
  { id: 3, text: "Bijau būti atstumtas(-a).", category: "abandonmentWound" },
  { id: 4, text: "Linkstu prisitaikyti prie kitų.", category: "peoplePleasing" },
  { id: 5, text: "Dažnai save kritikuoju.", category: "innerCriticProtector" },
  { id: 6, text: "Kai stresuoju, imu viską kontroliuoti.", category: "controlProtector" },
  { id: 7, text: "Poilsio metu man sunku atsipalaiduoti.", category: "unsafetyWound" },
  { id: 8, text: "Jaučiu, kad mano vertė priklauso nuo to, kiek padarau.", category: "worthinessWound" },
  { id: 9, text: "Kai būna per daug, imu emociškai atsijungti.", category: "dissociationSoother" },
  { id: 10, text: "Santykiuose greitai aktyvuojasi palikimo baimė.", category: "abandonmentWound" },
  { id: 11, text: "Kai man sunku, dažniau užsisklendžiu nei atsiveriu.", category: "withdrawalSoother" },
  { id: 12, text: "Man sunku pasakyti „ne“ net kai to noriu.", category: "peoplePleasing" },
  { id: 13, text: "Dažnai jaučiu, kad turiu būti stiprus(-i) dėl kitų.", category: "suppressionSoother" },
  { id: 14, text: "Greitai perimu atsakomybę už kitų jausmus.", category: "peoplePleasing" },
  { id: 15, text: "Kai suklystu, ilgai save kaltinu.", category: "shameWound" },
  { id: 16, text: "Man sunku būti spontaniškam(-ai), kai nėra aiškumo.", category: "unsafetyWound" },
  { id: 17, text: "Dažnai galvoju, ką apie mane pagalvos kiti.", category: "shameWound" },
  { id: 18, text: "Kai jaučiu įtampą, imu per daug planuoti.", category: "overthinkingSoother" },
  { id: 19, text: "Man sunku tiesiai parodyti savo poreikius.", category: "invisibilityWound" },
  { id: 20, text: "Dažnai bijau, kad būsiu nepakankamas(-a).", category: "worthinessWound" },
  { id: 21, text: "Kai santykyje atsiranda atstumas, imu nerimauti.", category: "abandonmentWound" },
  { id: 22, text: "Net kai viskas gerai, kūne lieka budrumas.", category: "unsafetyWound" },
  { id: 23, text: "Mano vidinis balsas dažnai griežtas ir spaudžiantis.", category: "innerCriticProtector" },
  { id: 24, text: "Kai jaučiu pažeidžiamumą, galiu reaguoti pykčiu.", category: "angerSoother" },
  { id: 25, text: "Jaučiu, kad turiu nusipelnyti meilę ar priėmimą.", category: "worthinessWound" },
  { id: 26, text: "Dažnai nutyliu, ką iš tikrųjų jaučiu.", category: "suppressionSoother" },
  { id: 27, text: "Man sunku išbūti nežinomybėje.", category: "controlProtector" },
  { id: 28, text: "Kai esu pavargęs(-usi), dar labiau save spaudžiu.", category: "overworkingProtector" },
  { id: 29, text: "Stengiuosi viską padaryti labai gerai, kad nebūčiau kritikuojamas(-a).", category: "perfectionismProtector" },
  { id: 30, text: "Kartais jaučiuosi tarsi atsijungęs(-usi) nuo savęs.", category: "dissociationSoother" },
  { id: 31, text: "Kai kitas žmogus nusivilia, imu jaustis kaltas(-a).", category: "shameWound" },
  { id: 32, text: "Man sunku atsipalaiduoti, jei kažkas nebaigta.", category: "overworkingProtector" },
  { id: 33, text: "Dažnai jaučiu, kad mano poreikiai yra per dideli.", category: "invisibilityWound" },
  { id: 34, text: "Bijau, kad jei parodysiu tikrą save, būsiu atstumtas(-a).", category: "shameWound" },
  { id: 35, text: "Kai man skaudu, pirmiausia bandau tai nuslopinti.", category: "suppressionSoother" },
  { id: 36, text: "Dažnai bandau nuspėti blogiausią scenarijų.", category: "overthinkingSoother" },
  { id: 37, text: "Jaučiu įtampą, kai negaliu kontroliuoti situacijos.", category: "controlProtector" },
  { id: 38, text: "Man sunku priimti pagalbą be kaltės jausmo.", category: "worthinessWound" },
  { id: 39, text: "Kai kas nors nutolsta, imu kaltinti save.", category: "abandonmentWound" },
  { id: 40, text: "Dažnai gyvenu taip, lyg negalėčiau suklysti.", category: "perfectionismProtector" }
];

function getQuestionsByCategory() {
  return QUESTIONS.reduce<Record<CategoryKey, Question[]>>((acc, q) => {
    if (!acc[q.category]) {
      acc[q.category] = [];
    }
    acc[q.category].push(q);
    return acc;
  }, {} as Record<CategoryKey, Question[]>);
}

function getResults(answers: Record<number, number>) {
  const questionsByCategory = getQuestionsByCategory();

  const all: ResultItem[] = (Object.keys(CATEGORY_META) as CategoryKey[]).map((key) => {
    const meta = CATEGORY_META[key];
    const qs = questionsByCategory[key] || [];
    const raw = qs.reduce((sum, q) => sum + (answers[q.id] ?? 0), 0);
    const max = qs.length * 4;
    const percent = max === 0 ? 0 : Math.round((raw / max) * 100);

    return {
      key,
      group: meta.group,
      title: meta.title,
      short: meta.short,
      intro: meta.intro,
      explanation: meta.explanation,
      impact: meta.impact,
      howToBegin: meta.howToBegin,
      raw,
      max,
      percent
    };
  });

  const wounds = all
    .filter((item) => item.group === "žaizdos")
    .sort((a, b) => b.percent - a.percent);

  const protectors = all
    .filter((item) => item.group === "apsaugos")
    .sort((a, b) => b.percent - a.percent);

  const soothers = all
    .filter((item) => item.group === "raminimo būdai")
    .sort((a, b) => b.percent - a.percent);

  return {
    all: [...all].sort((a, b) => b.percent - a.percent),
    wounds,
    protectors,
    soothers,
    top3: [...all].sort((a, b) => b.percent - a.percent).slice(0, 3),
    topWound: wounds[0],
    topProtector: protectors[0],
    topSoother: soothers[0]
  };
}

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="progress">
      <div className="progressFill" style={{ width: `${value}%` }} />
    </div>
  );
}

function GroupChart({ title, items }: { title: string; items: ResultItem[] }) {
  return (
    <div className="panel">
      <div className="panelHeader">
        <h3>{title}</h3>
        <span>Aktyvacija pagal grupę</span>
      </div>

      <div className="chart">
        {items.map((item) => (
          <div className="chartRow" key={item.key}>
            <div className="chartHead">
              <span>{item.title}</span>
              <strong>{item.percent}%</strong>
            </div>
            <div className="chartTrack">
              <div className="chartBar" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BreakdownSection({
  title,
  items
}: {
  title: string;
  items: ResultItem[];
}) {
  return (
    <div className="panel">
      <div className="panelHeader">
        <h3>{title}</h3>
        <span>Detalus išskaidymas</span>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {items.map((item) => (
          <details
            key={item.key}
            style={{
              border: "1px solid var(--line)",
              borderRadius: 18,
              background: "rgba(255,255,255,0.78)",
              overflow: "hidden"
            }}
          >
            <summary
              style={{
                listStyle: "none",
                cursor: "pointer",
                padding: "18px 18px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 16,
                fontWeight: 700
              }}
            >
              <span>{item.title}</span>
              <span style={{ color: "var(--primary)" }}>{item.percent}%</span>
            </summary>

            <div
              style={{
                padding: "0 18px 18px",
                color: "var(--muted)",
                lineHeight: 1.75
              }}
            >
              <p style={{ marginTop: 0 }}>{item.intro}</p>
              <p>{item.explanation}</p>
              <p>{item.impact}</p>

              <div style={{ marginTop: 14 }}>
                <strong style={{ color: "var(--text)" }}>
                  Kaip pradėti dirbti su šia tema
                </strong>
                <ul style={{ margin: "10px 0 0", paddingLeft: 20 }}>
                  {item.howToBegin.map((tip, index) => (
                    <li key={index} style={{ marginBottom: 8 }}>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export default function Page() {
  const [step, setStep] = useState<Step>("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const total = QUESTIONS.length;
  const currentQuestion = QUESTIONS[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = Math.round((answeredCount / total) * 100);

  const results = useMemo(() => getResults(answers), [answers]);

  const summaryText = useMemo(() => {
    if (!results.topWound || !results.topProtector || !results.topSoother) {
      return "Rezultatai apskaičiuoti pagal tavo atsakymus.";
    }

    return `Ryškiausiai matosi ${results.topWound.title.toLowerCase()}, ${results.topProtector.title.toLowerCase()} ir ${results.topSoother.title.toLowerCase()} temos. Tai nėra tavo tapatybė. Tai labiau išmokti prisitaikymo modeliai, kurie tam tikru gyvenimo laikotarpiu padėjo išgyventi, bet šiandien gali riboti ramybę, artumą ir autentišką savęs reiškimą.`;
  }, [results]);

  function handleAnswer(value: number) {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  }

  function nextStep() {
    if (answers[currentQuestion.id] === undefined) return;

    if (currentIndex < total - 1) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    setStep("emailGate");
  }

  function prevStep() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }

  function resetTest() {
    setStep("intro");
    setCurrentIndex(0);
    setAnswers({});
    setEmail("");
    setConsent(false);
    setMessage("");
    setSending(false);
  }

  function savePdf() {
    window.print();
  }

  async function handleUnlockResults() {
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

      try {
        await fetch("/api/request-analysis", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email,
            consent,
            results: {
              top3: results.top3,
              wounds: results.wounds,
              protectors: results.protectors,
              soothers: results.soothers
            }
          })
        });
      } catch {
        // Mailer bus prijungtas vėliau, todėl rezultatų nerakinam dėl backend nebuvimo.
      }

      setStep("results");
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
                raminimo būdai šiuo metu gali stipriausiai veikti tavo santykius,
                savivertę ir kasdienę būseną.
              </p>

              <div className="featureGrid">
                <div className="featureCard">
                  <h3>40 klausimų</h3>
                  <p>Vienas klausimas vienu metu, aiški eiga ir švari progreso juosta.</p>
                </div>
                <div className="featureCard">
                  <h3>Pilna analizė</h3>
                  <p>Po testo pateikiama struktūruota rezultatų analizė su diagramomis ir išskaidymu.</p>
                </div>
                <div className="featureCard">
                  <h3>El. pašto vartai</h3>
                  <p>Kad pamatytum rezultatą, pirmiausia reikia įvesti el. paštą.</p>
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
                    <div className="miniChartBar" style={{ height: "82%" }} />
                    <div className="miniChartBar" style={{ height: "54%" }} />
                    <div className="miniChartBar" style={{ height: "88%" }} />
                    <div className="miniChartBar" style={{ height: "64%" }} />
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
                <div className="progressTextWrap">
                  <div className="progressLabel">Progresas</div>
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
                <h2>{currentQuestion.text}</h2>
              </div>

              <div className="answersGrid">
                {SCALE.map((option) => {
                  const selected = answers[currentQuestion.id] === option.value;

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
                <button
                  className="secondaryBtn"
                  onClick={prevStep}
                  disabled={currentIndex === 0}
                >
                  Atgal
                </button>

                <button
                  className="primaryBtn"
                  onClick={nextStep}
                  disabled={answers[currentQuestion.id] === undefined}
                >
                  {currentIndex === total - 1 ? "Tęsti" : "Kitas"}
                </button>
              </div>
            </div>

            <aside className="sideCard">
              <h3>Tavo atsakymai kuria žemėlapį</h3>
              <p>
                Testo pabaigoje pirmiausia paprašysime el. pašto, o po to bus parodyta
                pilna rezultatų analizė su trimis grupėmis: žaizdomis, apsaugomis ir
                raminimo būdais.
              </p>

              <div className="sideStat">
                <strong>{total}</strong>
                <span>Klausimų</span>
              </div>
              <div className="sideStat">
                <strong>3</strong>
                <span>Rezultatų grupės</span>
              </div>
              <div className="sideStat">
                <strong>1</strong>
                <span>Pilnas išskaidymas po testo</span>
              </div>
            </aside>
          </section>
        )}

        {step === "emailGate" && (
  <section className="resultsLayout">
    <div className="resultsMain">
      <div className="resultsHero">
        <h2>Prieš atveriant pilną analizę</h2>
        <p>
          Įvesk savo el. paštą, kad pamatytum pilną savo rezultatų išskaidymą.
        </p>
      </div>

      <div className="panel">
        <div className="panelHeader">
          <h3>Ką matysi po to</h3>
          <span>Pilnas rezultatas</span>
        </div>

        <div className="tableLike">
          <div className="tableRow">
            <div className="tableMain">
              <strong>Žaizdos</strong>
              <p>Matysi, kurios pirminės emocinės temos šiuo metu aktyviausios.</p>
            </div>
          </div>

          <div className="tableRow">
            <div className="tableMain">
              <strong>Apsaugos</strong>
              <p>Matysi, kokiais būdais tavo sistema bando apsisaugoti nuo skausmo.</p>
            </div>
          </div>

          <div className="tableRow">
            <div className="tableMain">
              <strong>Raminimo būdai</strong>
              <p>Matysi, kaip tavo sistema mėgina reguliuoti per didelę vidinę įtampą.</p>
            </div>
          </div>

          <div className="tableRow">
            <div className="tableMain">
              <strong>Pilnas išskaidymas</strong>
              <p>Kiekviena svarbiausia tema bus paaiškinta plačiau, su kryptimis nuo ko pradėti.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <aside className="emailCard">
      <div className="emailArtwork">
        <div className="emailGlow" />
        <div className="mailIcon">✦</div>
      </div>

      <h3>Įvesk el. paštą ir atverk savo analizę</h3>
      <p>
        Vos įvedus el. paštą, iš karto matysi pilną savo rezultatų analizę šiame puslapyje.
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

      <button
        className="primaryBtn fullWidth"
        onClick={handleUnlockResults}
        disabled={sending}
      >
        {sending ? "Atveriama..." : "Pamatyti mano rezultatus"}
      </button>

      {message && <div className="messageBox">{message}</div>}

      <button className="ghostBtn fullWidth" onClick={() => setStep("quiz")}>
        Grįžti prie testo
      </button>
    </aside>
  </section>
)}
