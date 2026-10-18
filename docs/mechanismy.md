# Mechanismy hodin: co je v animacích špatně a jak to funguje doopravdy

Návrhová větev `clock-mechanisms`. Všechny animace kapitol s posuvníkem: `npm start` a otevřít `/mechanismy.html`.

## 1. Ozubená kola (lihýřové hodiny, konec 13. století) — přepracováno

**Co bylo špatně**

- Kola se nedotýkala: hroty zubů měly poloměr 50 + 34 = 84, ale osy byly 90 od sebe.
- Zuby měly pevnou šířku 12 bez ohledu na velikost kola, takže by do sebe stejně nepasovaly.
- Velké kolo se točilo po směru hodin, takže lano na jeho levé straně by závaží *zvedalo*.
- Závaží za jednu otáčku kleslo o 70, ale lano viselo na poloměru ~35 (správně by kleslo o 2π·35 ≈ 220).
- Kola se točila plynule. Chyběl krok (lihýř), který je hlavní myšlenkou celé kapitoly („tik, tak“).

**Jak to funguje doopravdy**

```
   foliot (lihýř) s regulačními závažími   ●━━━━━━━━┳━━━━━━━━●
                                                     ┃  vřeteno (verge)
                                          lopatka ▶  ┃
                         korunové kolo  (zuby míří podél osy, lichý počet)
                                          lopatka ◀  ┃
   závaží → buben → velké kolo → pastorek (na ose korunového kola)
```

- Závaží visí na laně navinutém na **bubnu** na ose velkého kola. Klesne přesně o tolik, kolik se odvine z obvodu bubnu.
- Kola v jednom soukolí mají stejný **modul** (velikost zubu): poloměr = modul × počet zubů / 2 a osy jsou od sebe právě o součet poloměrů. Hnané kolo se točí opačně a z₁/z₂-krát rychleji.
- **Korunové kolo** má zuby vystupující do strany (jako koruna) a lichý počet zubů. Svislé **vřeteno** má dvě **lopatky** asi 90–100° od sebe, jednu u horního a jednu u dolního okraje kola. Zub tlačí do lopatky, vřeteno se pootočí, zub vyklouzne a protější lopatka chytí zub na druhé straně. Tím se vřeteno otočí zpátky.
- Na vřetenu je **lihýř** (foliot), vodorovná tyč se závažími. Jeho setrvačnost určuje tempo. Posunutím závaží blíž k ose jdou hodiny rychleji.
- Soukolí tedy postupuje po krocích, o půl zubu korunového kola na každý kyv lihýře. Lihýřové hodiny se podle kvality mýlily o 15 až 60 minut denně.

**Nová animace** (`GearsArt` v `src/components/Mechanisms.jsx`): velké kolo se 40 zuby a bubnem, pastorek s 10 zuby, korunové kolo s 15 zuby, vřeteno se dvěma lopatkami a lihýř. Všechno je odvozené z jednoho počítadla kyvů: kola stojí a poskočí vždy, když lihýř projde středem. Geometrii záběru hlídá test `src/clocks/gear.test.js` (zuby se po celou otáčku dotýkají a nikde se nepřekrývají).

## 2. Kyvadlo (1656, kotva kolem 1670) — přepracováno

**Co bylo špatně:** kyvadlo viselo pod ciferníkem bez jakéhokoli spojení s ručičkou. Nebylo vidět, *proč* ručička skočí.

**Jak to funguje doopravdy (kotvový krok)**

```
            ● čep kotvy (kyvadlo visí ze stejného místa přes vidlici)
           ╱ ╲
   lopatka ◣   ◢ lopatka      lopatky obepínají 7½ zubu
          ╭─────╮
          │  ⚙  │  krokové kolo, 30 zubů, na jeho ose sekundová ručička
          ╰─────╯
             │
             ●  kyvadlo ~1 m = 1 kyv za 1 s
```

- Krokové kolo má **30 zubů**. Každý kyv kyvadla ho pustí o **půl zubu** (6°), takže se otočí jednou za minutu. Proto může sekundová ručička sedět přímo na jeho ose.
- Ramena kotvy jsou tečná ke kolu, takže lopatky se při kyvu noří a vynořují skoro kolmo k okraji kola.
- Skutečné kyvadlo s kotvou kmitá jen o 3–4°. Animace ukazuje ±7°, aby byl pohyb vidět.
- Huygens v roce 1656 použil kyvadlo ještě s vřetenovým krokem (s velkým rozkmitem a cykloidními lícnicemi). Kotvu přidali kolem roku 1670 v Anglii (William Clement nebo Robert Hooke). Animace ukazuje kotvu, protože je srozumitelnější, a text kapitoly teď říká, že kotva „brzy přibyla“.

**Opraven text:** „Každý kyv pustí ozubené kolo o *půl zubu* dál“ (dřív „o jeden zub“).

**Nová animace** (`PendulumArt`): kotva, kyvadlo, krokové kolo s 30 zuby a sekundovou ručičkou na jeho ose. Ciferník je kostrový (průhledný), aby kolo bylo vidět.

## 3. Hodiny na moři (Harrison H4, 1761) — přepracováno

**Bylo:** houpající se loď a ciferník. Pocit je správný, ale nic neukazuje, proč tyhle hodiny vlny nerozhodí.

**Doopravdy:** místo kyvadla kmitá **setrvačka** (balance), kolečko se spirálovým **vláskem**. Vlásek se střídavě navíjí a odvíjí. Na setrvačku nepůsobí gravitace jako na kyvadlo, a proto jí houpání lodi nevadí. H4 měla vřetenový krok s diamantovými lopatkami a **remontoár**, malou pružinu natahovanou každých 7,5 s, aby krok dostával pořád stejnou sílu. Pozdější námořní chronometry měly pružinový zádržný krok (detent) a šnek (fusee).

**Nová animace** (`ChronometerArt`, komponenta `Balance` v `Mechanisms.jsx`): v pouzdře hodinek nad houpající se lodí je místo ciferníku vidět setrvačka (±150°) s vláskem, jehož závity se spolu s ní stahují a povolují. Loď se kolébá, ale setrvačka kmitá pořád stejně.

## 4. Slunce a stín — přepracováno

**Bylo:** slunce šlo zleva doprava, tedy díváme se na jih a východ je vlevo. Ráno proto stín ukazuje doprava, kde je ale napsáno **III**, a odpoledne doleva na **IX**. Ranní stín tedy ukazuje odpolední hodinu. Navíc v poledne stín míří nahoru, směrem ke slunci.

**Doopravdy:**

- Hodinové čáry nejsou rovnoměrné. Pro vodorovné hodiny platí tan θ = sin φ · tan(15° · h), kde φ je zeměpisná šířka a h počet hodin od poledne. Pro svislé jižní hodiny (na zdi kostela) platí tan θ = cos φ · tan(15° · h).
- Praha (φ ≈ 50,1°):

  | hodiny od poledne | 1 | 2 | 3 | 4 | 5 | 6 |
  |---|---|---|---|---|---|---|
  | vodorovné | 11,6° | 23,9° | 37,5° | 53,0° | 70,7° | 90° |
  | svislé jižní | 9,8° | 20,3° | 32,7° | 48,0° | 67,3° | 90° |

- Šikmý ukazatel (polos) musí být rovnoběžný se zemskou osou, tedy skloněný o úhel φ. To je ale středověký vynález. Egyptský gnómon byl svislý, nebo to byla tyč ve tvaru T (merchet). Ukazoval dobově proměnlivé „sezónní“ hodiny.

**Nová scéna** (`src/components/Sundial.jsx`, výpočet v `src/clocks/sundial.js`): **svislé jižní hodiny na zdi** pro Prahu ve dne rovnodennosti. Slunce je za divákem a jde zprava doleva, stín ukazatele padá dolů a ranní hodiny jsou vlevo. Hodinové čáry VII–V jsou spočítané podle tabulky (hlídá je test). Na ukazateli je uzel (nodus), jehož stín se ve dne rovnodennosti posouvá po vodorovné přímce (modrá čárkovaná). Proto je stín ráno a večer dlouhý a v poledne nejkratší, což sedí na text kapitoly. Posuvník pokrývá 7:00–17:00 slunečního času, protože dřív a později svítí slunce na zeď z boku nebo zezadu. Výstup ukazuje „sluneční čas“, který se od času na hodinkách liší o pár minut až čtvrt hodiny.

## 5. Voda a písek — upraven text

Tvar horní nádoby (širší nahoře) odpovídá skutečné klepsydře z Karnaku: šikmé stěny vyrovnávají to, že se slábnoucím tlakem vody odtéká pomaleji. Text kapitoly teď vysvětluje, že šikmé stěny vyrovnávají slábnoucí proud vody. Uvnitř karnacké nádoby bylo 12 sloupců rysek, jeden pro každý měsíc, protože noční hodiny měly během roku různou délku.

## 6. Křemen — přepracováno

**Bylo:** rozsvěcoval se displej. To je pěkné, ale mechanismus to neukazuje.

**Doopravdy:**

```
 ladička z křemene ──32 768 Hz──▶ [÷2]×15 ──1 Hz──▶ krokový motorek (Lavet) ──▶ ručička
  (2¹⁵ kmitů/s)                    děličky
```

**Nová animace** (`QuartzArt`): nahoře se chvěje křemenná ladička (32 768 Hz), pod ní je řada 15 děliček. Každá se překlápí poloviční rychlostí než předchozí; rychlé děličky jsou rozmazané, protože blikají rychleji, než oko stihne. Poslední dělička (1 Hz) posouvá sekundy na displeji a bliká dvojtečkou. Navazuje na fakt o 2¹⁵ ze stejné kapitoly.

## 7. Atomové hodiny — přepracováno

**Bylo:** planetární model atomu s kroužícími elektrony. Vypadá „atomově“, ale s principem hodin nesouvisí.

**Doopravdy (cesiový svazek):**

```
 pícka s cesiem ─▶ magnet A ─▶ mikrovlnná dutina 9 192 631 770 Hz ─▶ magnet B ─▶ detektor
                    (třídí atomy)       (Ramseyho dutina)                 (počítá „překlopené“ atomy)
                         ▲                                                          │
                         └──────── křemenný oscilátor se doladí podle signálu ◀─────┘
```

**Nová animace** (`AtomArt`): z pícky letí atomy cesia přes třídicí magnet, mikrovlnnou dutinu a druhý magnet. Atomy „překlopené“ mikrovlnami zmodrají a druhý magnet je pošle nahoru do detektoru, ostatní odletí dolů. Jak se číslo 9 192 631 770 zleva „zamyká“, překlápí se víc atomů a detektor svítí víc. Čárkovaná šipka „doladění“ ukazuje zpětnou vazbu z detektoru do mikrovln.

## 8. Orloj — v pořádku

Slunce jednou za 24 h, Měsíc opožděný o svou fázi, poledne nahoře, kruhy obzoru dole (stereografická projekce dává kruhy, takže je to správně). Skutečná ručička Slunce navíc během roku jezdí po zvěrokruhu, pro tuto úroveň to není potřeba.

## Zdroje

- Anchor escapement — https://en.wikipedia.org/wiki/Anchor_escapement (30 zubů, 1 otáčka za minutu, lopatky přes 7½ zubu, kyv 3–4°)
- Verge escapement — https://wikipedia.classicistranieri.com/en/articles/v/e/r/Verge_escapement.html
- Foliot a vřetenový krok (animované schéma) — https://www.firgelliauto.com/blogs/mechanisms/foliot
- Zámek Kynžvart, věžní hodiny s vřetenovým krokem (přesnost lihýřových hodin 15–60 min/den) — https://www.zamek-kynzvart.cz/pamatky/kynzvart/ke-stazeni/TZ_Exponat%20mesice%20kveten%20-%20vezni%20hodiny.pdf
- Výpočet hodinových čar — https://sundials.org/education/sundial-math , https://mysundial.ca/tsp/horizontal_sundial.html
- Water clock (Karnak, šikmé stěny, 12 sloupců) — https://en.wikipedia.org/wiki/Water_clock
- Quartz clock (2¹⁵, děličky, Lavetův motorek) — https://en.wikipedia.org/wiki/Quartz_clock
- Cesiový svazek (pícka, magnety A/B, Ramseyho dutina, detektor) — https://www.frontiersin.org/articles/10.3389/fphy.2022.963870/full
- H4: diamantové lopatky, remontoár každých 7,5 s — https://watchesbysjx.com/2019/09/john-harrison-marine-chronometer-h4-diamond-pallets.html , https://quillandpad.com/2017/01/11/making-escapement-remontoir-timing-derek-pratts-reconstruction-john-harrisons-h4-worlds-first-precision-marine-chronometer-part-3-3/
