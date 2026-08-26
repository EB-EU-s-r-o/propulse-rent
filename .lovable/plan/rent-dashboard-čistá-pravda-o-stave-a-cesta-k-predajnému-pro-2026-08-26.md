# RENT Dashboard — čistá pravda o stave a cesta k predajnému produktu

## Krátka odpoveď
Dnes máš **veľmi dobre vyzerajúce demo / UI prototyp**, nie produkčný SaaS.
Vizuál, navigácia, prihlásenie a téma fungujú. **Všetky dáta sú falošné (mock JSON v kóde)** — nič sa neukladá, nič sa nedá reálne pridať ani editovať. Maklérovi to dnes môžeš predať ako ukážku, nie ako nástroj na prácu.

## Čo je HOTOVÉ (funguje)
- Industriálny dark/light dizajn, prepínač témy s pamätaním nastavenia.
- Layout: Sidebar, Header, mobilné menu, welcome/loading obrazovka.
- Stránky: Dashboard, Properties, Pipeline (Kanban), Payments, 404.
- Prihlásenie e-mailom + heslom (registrácia/login), chránené trasy, odhlásenie, používateľské menu.
- Backend základ: tabuľky `profiles` a `user_roles` s rolami a bezpečnostnými politikami; automatické vytvorenie profilu po registrácii.
- Zabezpečený serverový proxy pre Bitrix24 (kľúč nie je v prehliadači), s kontrolou rolí.
- Viacjazyčnosť pripravená (EN/SK/TH), i18n súbory existujú.

## Čo NEFUNGUJE (najdôležitejšie)
1. **Žiadna databáza pre biznis dáta.** Neexistujú tabuľky properties, units, leads, tenants, leases, payments. Dashboard, Properties, Pipeline aj Payments čítajú z `src/data/mockData.ts` a JSON súborov.
2. **Nič sa neukladá.** Tlačidlá „Add Property“, „Filters“, „CSV/PDF export“ sú vizuálne bez logiky. Po refreshi je všetko rovnaké.
3. **Kanban pipeline** zobrazuje mock leady; drag & drop verzia existuje len v starom nezapojenom komponente (`src/components/features/PipelineBoard.jsx`) a nič neukladá.
4. **Platby sú fikcia.** Žiadny Stripe, žiadne faktúry, žiadne pripomienky.
5. **Bitrix24 prepojenie je nedokončené.** Proxy funkcia beží, ale mapovanie polí je „TODO“ (vracia iba id/title) a tajný `BITRIX_WEBHOOK_URL` nie je nastavený → integrácia je momentálne mimo.
6. **Role sa nikomu neprideľujú.** Prvý používateľ nemá rolu → serverové zápisy cez proxy mu vrátia „Forbidden“. Chýba admin obrazovka na správu používateľov.
7. **Multi-tenancy chýba.** Nie je oddelenie dát podľa agentúry/makléra — pri predaji viacerým klientom by videli to isté.
8. **Chýbajúce stránky:** Settings a Reports sú len alias na Dashboard; detail nehnuteľnosti/nájmu nie je zapojený.
9. **Neporiadok v repozitári:** duplicitné staré priečinky `core-functionality`, `core-functionality 2`, `.zip`, `wordpress-roof21`, mix .jsx/.tsx. Zvyšuje riziko chýb a mätie.
10. **Žiadne testy, žiadny onboarding, žiadny fakturačný model pre predaj (predplatné).**

## Ako to dostať do predajného stavu (poradie prác)
**Fáza 1 — Skutočný produkt (nevyhnutné)**
1. Dátový model v databáze: properties, units, tenants, leases, leads, payments (+ organizácie/agentúry) s bezpečnostnými politikami podľa rolí a príslušnosti k organizácii.
2. Prepojiť všetky stránky na databázu cez TanStack Query, odstrániť mock JSON.
3. Funkčné CRUD: pridať/upraviť/zmazať nehnuteľnosť, jednotku, leada, nájom, platbu (formuláre + validácia).
4. Kanban s drag & drop, ktorý reálne mení stav leada v databáze.
5. Role: automatické priradenie prvého admina, admin obrazovka na pozývanie makléra a nastavenie rolí.

**Fáza 2 — Predajné funkcie**
6. Reporty a Settings ako reálne stránky; CSV/PDF export skutočne generovaný.
7. Stripe: prijímanie platieb nájmu a/alebo predplatné pre maklérov, faktúry, e-maily.
8. Notifikácie (splatné platby, nové leady), globálne vyhľadávanie a filtre.

**Fáza 3 — Zrelosť pred predajom**
9. Dokončiť Bitrix24 mapovanie polí + nastaviť tajný kľúč; voliteľne WordPress sync.
10. Vyčistiť repozitár (zmazať duplicitné legacy priečinky), zjednotiť na TypeScript.
11. Onboarding pre nového makléra, demo dáta na jeden klik, SEO/marketingová stránka, základné testy.

## Technické detaily
- Zdroje dát dnes: `src/data/mockData.ts`, `src/data/properties.json`, `units.json`, `leads.json`, `src/store/dashboardStore.ts` (simulované oneskorenie 800 ms).
- V databáze existujú len `public.profiles` a `public.user_roles` (+ `has_role`, trigger `on_auth_user_created`).
- Edge funkcia: `supabase/functions/bitrix-proxy` — vyžaduje rolu, tajný kľúč `BITRIX_WEBHOOK_URL` nie je nastavený.
- Auth: e-mail/heslo; Google prihlásenie nie je zapojené.

## Otázka na teba
Chceš, aby som začal Fázou 1 (databáza + reálne CRUD nad Properties/Units/Leads/Payments), alebo najprv multi-tenancy a predplatné, aby si to mohol predávať viacerým maklérom?
