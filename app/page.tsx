"use client";

import { useMemo, useState, type CSSProperties, type FormEvent } from "react";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Download,
  Factory,
  Flame,
  Gauge,
  Globe2,
  HardHat,
  Layers3,
  Map,
  Network,
  PackageCheck,
  Plus,
  Printer,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  UsersRound,
  Waves,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type ViewId = "command" | "opportunities" | "planner" | "value" | "partners";
type Opportunity = {
  id: number;
  name: string;
  market: string;
  region: string;
  stage: string;
  value: number;
  probability: number;
  due: string;
  signal: string;
  systemFit: string[];
  stakeholders: string[];
};

const nav = [
  { id: "command" as const, label: "Executive overview", icon: Gauge },
  { id: "opportunities" as const, label: "Growth pipeline", icon: Target },
  { id: "planner" as const, label: "Market intelligence", icon: Map },
  { id: "value" as const, label: "Commercial case", icon: TrendingUp },
  { id: "partners" as const, label: "Partner coverage", icon: Network },
];

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    name: "Nordic data-centre programme",
    market: "Mission critical",
    region: "Nordics",
    stage: "Specifier engagement",
    value: 4.8,
    probability: 78,
    due: "12 Sep 2026",
    signal: "Three hyperscale campuses are moving into MEP design coordination. Cooling adaptability and repeatable delivery are the strongest entry points.",
    systemFit: ["Grooved mechanical systems", "Hydronic flow control", "Fire protection", "VDC services"],
    stakeholders: ["MEP consultant", "Cooling designer", "General contractor", "Regional distributor"],
  },
  {
    id: 2,
    name: "Gulf healthcare expansion",
    market: "Healthcare",
    region: "Saudi Arabia",
    stage: "Partner validation",
    value: 3.2,
    probability: 71,
    due: "18 Sep 2026",
    signal: "A multi-site hospital programme needs a repeatable specification and local installation capacity before procurement begins.",
    systemFit: ["Mechanical pipe joining", "Hydronic balancing", "Fire protection", "Applications engineering"],
    stakeholders: ["Healthcare developer", "Design consultant", "Fire contractor", "Technical distributor"],
  },
  {
    id: 3,
    name: "UK water resilience framework",
    market: "Infrastructure",
    region: "United Kingdom",
    stage: "Solution mapping",
    value: 6.1,
    probability: 66,
    due: "25 Sep 2026",
    signal: "Framework teams are prioritising schedule compression, safer installation and maintainability across constrained treatment sites.",
    systemFit: ["AWWA grooved systems", "Flow control", "Large-diameter solutions", "Applications engineering"],
    stakeholders: ["Water company", "Framework contractor", "Process engineer", "Stocking distributor"],
  },
  {
    id: 4,
    name: "European gigafactory cluster",
    market: "Industrial",
    region: "Central Europe",
    stage: "Project identified",
    value: 5.4,
    probability: 58,
    due: "03 Oct 2026",
    signal: "Four advanced-manufacturing projects are entering concept design with compressed construction schedules and extensive utility piping.",
    systemFit: ["Advanced grooved systems", "Stainless systems", "Flow control", "VDC services"],
    stakeholders: ["Owner engineering", "EPC", "Mechanical contractor", "Industrial distributor"],
  },
  {
    id: 5,
    name: "North American logistics portfolio",
    market: "Fire protection",
    region: "North America",
    stage: "Commercial case",
    value: 7.3,
    probability: 63,
    due: "08 Oct 2026",
    signal: "A logistics developer is standardising fire protection across a repeat-build warehouse portfolio.",
    systemFit: ["Sprinklers", "Fire valves and devices", "Grooved fire protection", "Training"],
    stakeholders: ["Developer", "Fire consultant", "Sprinkler contractor", "Distribution partner"],
  },
  {
    id: 6,
    name: "Australian mine water upgrade",
    market: "Mining",
    region: "Australia",
    stage: "Partner validation",
    value: 5,
    probability: 55,
    due: "14 Oct 2026",
    signal: "A brownfield water-handling upgrade needs fast installation, HDPE transitions and maintenance access in remote operating conditions.",
    systemFit: ["HDPE solutions", "Advanced grooved systems", "Flow control", "Training"],
    stakeholders: ["Mine operator", "EPCM", "Maintenance lead", "Regional distributor"],
  },
];

const regionModels = {
  "Saudi Arabia": { activity: 88, channel: 61, influence: 78, ease: 59, lead: "Healthcare & mission critical" },
  Nordics: { activity: 83, channel: 74, influence: 85, ease: 78, lead: "Mission-critical cooling" },
  "United Kingdom": { activity: 76, channel: 84, influence: 72, ease: 82, lead: "Water infrastructure" },
  "Central Europe": { activity: 81, channel: 76, influence: 71, ease: 74, lead: "Advanced manufacturing" },
  Australia: { activity: 72, channel: 68, influence: 65, ease: 76, lead: "Mining & water" },
};

const partners = [
  { name: "Riyadh technical distributor search", region: "Saudi Arabia", capability: "Distribution", readiness: 48, gap: "Technical stockholding", status: "Shortlisting" },
  { name: "Gulf fire installer network", region: "Saudi Arabia", capability: "Installation", readiness: 57, gap: "Product training", status: "In development" },
  { name: "Nordic VDC delivery cell", region: "Nordics", capability: "VDC", readiness: 64, gap: "Local modelling capacity", status: "Capability gap" },
  { name: "UK water framework channel", region: "United Kingdom", capability: "Distribution", readiness: 88, gap: "Executive sponsor", status: "Validated" },
  { name: "Central Europe industrial integrator", region: "Central Europe", capability: "Specification", readiness: 72, gap: "Factory references", status: "Due diligence" },
  { name: "Australian mining coverage", region: "Australia", capability: "Installation", readiness: 69, gap: "Remote field support", status: "Due diligence" },
];

const marketMatrix = [
  { market: "Mission critical", momentum: 92, fit: 94, cycle: "6–18 mo", route: "Specifier → VDC → contractor" },
  { market: "Water infrastructure", momentum: 84, fit: 89, cycle: "12–30 mo", route: "Owner → framework → distributor" },
  { market: "Healthcare", momentum: 78, fit: 86, cycle: "9–24 mo", route: "Developer → MEP → installers" },
  { market: "Advanced manufacturing", momentum: 75, fit: 82, cycle: "8–20 mo", route: "Owner → EPC → contractor" },
  { market: "Fire protection", momentum: 70, fit: 91, cycle: "4–15 mo", route: "Developer → fire consultant → installer" },
];

const titles: Record<ViewId, { eyebrow: string; title: string }> = {
  command: { eyebrow: "Global growth portfolio · Q3 2026", title: "Executive overview" },
  opportunities: { eyebrow: "Opportunity qualification", title: "Growth pipeline" },
  planner: { eyebrow: "Territory and sector intelligence", title: "Market prioritisation" },
  value: { eyebrow: "Project economics", title: "Commercial value case" },
  partners: { eyebrow: "Route-to-market capability", title: "Partner coverage" },
};

function MarketIcon({ market }: { market: string }) {
  const Icon = market === "Mission critical" ? Building2 : market === "Infrastructure" ? Waves : market === "Industrial" || market === "Mining" ? Factory : market === "Fire protection" ? Flame : HardHat;
  return <Icon aria-hidden="true" />;
}

function formatMoney(value: number) {
  return "£" + value.toFixed(1) + "m";
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewId>("command");
  const [opportunities, setOpportunities] = useState(initialOpportunities);
  const [query, setQuery] = useState("");
  const [marketFilter, setMarketFilter] = useState("All markets");
  const [stageFilter, setStageFilter] = useState("All stages");
  const [selectedId, setSelectedId] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newOpportunity, setNewOpportunity] = useState({
    name: "",
    market: "Mission critical",
    region: "",
    stage: "Project identified",
    value: "1.5",
  });

  const pipelineValue = opportunities.reduce((total, item) => total + item.value, 0);
  const selected = opportunities.find((item) => item.id === selectedId) ?? opportunities[0];
  const filteredOpportunities = useMemo(() => opportunities.filter((item) => {
    const matchesText = (item.name + " " + item.region + " " + item.market).toLowerCase().includes(query.toLowerCase());
    const matchesMarket = marketFilter === "All markets" || item.market === marketFilter;
    const matchesStage = stageFilter === "All stages" || item.stage === stageFilter;
    return matchesText && matchesMarket && matchesStage;
  }), [opportunities, query, marketFilter, stageFilter]);

  function addOpportunity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next: Opportunity = {
      id: Date.now(),
      name: newOpportunity.name.trim() || "New growth opportunity",
      market: newOpportunity.market,
      region: newOpportunity.region.trim() || "Territory to confirm",
      stage: newOpportunity.stage,
      value: Number(newOpportunity.value) || 1.5,
      probability: 45,
      due: "To be scheduled",
      signal: "New opportunity recorded. Complete the supporting evidence, stakeholder and route-to-market assessment.",
      systemFit: ["Solution applicability to validate", "Applications engineering review"],
      stakeholders: ["Project owner", "Specifier", "Contractor", "Distribution partner"],
    };
    setOpportunities((current) => [next, ...current]);
    setSelectedId(next.id);
    setActiveView("opportunities");
    setDialogOpen(false);
    setNewOpportunity({ name: "", market: "Mission critical", region: "", stage: "Project identified", value: "1.5" });
  }

  function exportPipeline() {
    const headings = ["Opportunity", "Market", "Region", "Stage", "Value GBP m", "Qualification score", "Decision date"];
    const rows = opportunities.map((item) => [item.name, item.market, item.region, item.stage, item.value, item.probability, item.due]);
    const csv = [headings, ...rows].map((row) => row.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "headroom-growthos-opportunity-pipeline.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function switchView(view: ViewId) {
    setActiveView(view);
    if (view !== "opportunities") {
      setQuery("");
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand brand-button" onClick={() => switchView("command")} aria-label="Open executive overview">
          <div className="brand-mark" aria-hidden="true"><span /><span /></div>
          <div><strong>Headroom</strong><small>GrowthOS · Intelligence</small></div>
        </button>

        <nav aria-label="Primary navigation" className="primary-nav">
          <p>Portfolio workspace</p>
          {nav.map((item) => (
            <button className={activeView === item.id ? "active" : ""} key={item.id} onClick={() => switchView(item.id)} aria-current={activeView === item.id ? "page" : undefined}>
              <item.icon aria-hidden="true" /><span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <CircleDot aria-hidden="true" />
          <div><strong>Victaulic Growth Workspace</strong><span>Independent strategic planning environment</span></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="page-title"><p>{titles[activeView].eyebrow}</p><h1>{titles[activeView].title}</h1></div>
          <div className="top-actions">
            <div className="data-status"><span /><div><small>Portfolio status</small><strong>Refreshed 06 Sep 2026</strong></div></div>
            <label className="search-box">
              <Search aria-hidden="true" />
              <span className="sr-only">Search opportunities</span>
              <input
                placeholder="Search opportunities and markets"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") setActiveView("opportunities");
                }}
              />
            </label>
            <Button className="primary-action" onClick={() => setDialogOpen(true)}>
              <Plus aria-hidden="true" /> Add opportunity
            </Button>
          </div>
        </header>

        {activeView === "command" && (
          <CommandView
            opportunities={opportunities}
            pipelineValue={pipelineValue}
            onOpenOpportunity={(id) => { setSelectedId(id); setActiveView("opportunities"); }}
            onViewAll={() => setActiveView("opportunities")}
            onOpenPartners={() => setActiveView("partners")}
          />
        )}
        {activeView === "opportunities" && (
          <OpportunitiesView
            opportunities={filteredOpportunities}
            selected={selected}
            query={query}
            setQuery={setQuery}
            marketFilter={marketFilter}
            setMarketFilter={setMarketFilter}
            stageFilter={stageFilter}
            setStageFilter={setStageFilter}
            setSelectedId={setSelectedId}
            exportPipeline={exportPipeline}
          />
        )}
        {activeView === "planner" && <PlannerView />}
        {activeView === "value" && <ValueBuilder />}
        {activeView === "partners" && <PartnerView />}

        <footer className="global-footer">
          <p>Headroom GrowthOS is independently owned and is not affiliated with or endorsed by Victaulic Company. All portfolio, opportunity and partner data in this demonstration is illustrative. Product applicability must be validated against current manufacturer documentation and project-specific engineering requirements.</p>
        </footer>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="opportunity-dialog">
          <form onSubmit={addOpportunity}>
            <DialogHeader>
              <DialogTitle>Add a growth opportunity</DialogTitle>
              <DialogDescription>Record the core commercial signal. Complete evidence, stakeholder and route-to-market validation in the Growth pipeline workspace.</DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <label className="field full"><span>Opportunity name</span><input required value={newOpportunity.name} onChange={(e) => setNewOpportunity({ ...newOpportunity, name: e.target.value })} placeholder="e.g. Nordic hospital programme" /></label>
              <label className="field"><span>Market</span>
                <Select value={newOpportunity.market} onValueChange={(value) => setNewOpportunity({ ...newOpportunity, market: value })}>
                  <SelectTrigger className="select-control"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Mission critical", "Healthcare", "Infrastructure", "Industrial", "Fire protection", "Mining"].map((market) => <SelectItem value={market} key={market}>{market}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
              <label className="field"><span>Region</span><input required value={newOpportunity.region} onChange={(e) => setNewOpportunity({ ...newOpportunity, region: e.target.value })} placeholder="Country or territory" /></label>
              <label className="field"><span>Stage</span>
                <Select value={newOpportunity.stage} onValueChange={(value) => setNewOpportunity({ ...newOpportunity, stage: value })}>
                  <SelectTrigger className="select-control"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Project identified", "Solution mapping", "Specifier engagement", "Partner validation", "Commercial case"].map((stage) => <SelectItem value={stage} key={stage}>{stage}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
              <label className="field"><span>Indicative value (£m)</span><input type="number" min="0.1" step="0.1" value={newOpportunity.value} onChange={(e) => setNewOpportunity({ ...newOpportunity, value: e.target.value })} /></label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add opportunity</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function CommandView({ opportunities, pipelineValue, onOpenOpportunity, onViewAll, onOpenPartners }: {
  opportunities: Opportunity[];
  pipelineValue: number;
  onOpenOpportunity: (id: number) => void;
  onViewAll: () => void;
  onOpenPartners: () => void;
}) {
  const weightedValue = opportunities.reduce((total, item) => total + item.value * item.probability / 100, 0);

  return (
    <div className="content">
      <section className="portfolio-hero" aria-label="Portfolio outlook">
        <article className="outlook-card">
          <div className="outlook-topline"><p className="eyebrow">Portfolio outlook</p><span className="live-indicator"><i /> Illustrative model</span></div>
          <div className="outlook-copy">
            <span>Qualified growth portfolio</span>
            <strong>{formatMoney(pipelineValue)}</strong>
            <p>Specification-led opportunities across six programmes, with the strongest near-term conviction in mission-critical, water and healthcare markets.</p>
          </div>
          <div className="outlook-footer">
            <div><small>Conversion-weighted value</small><b>{formatMoney(weightedValue)}</b></div>
            <div><small>Quarterly movement</small><b className="positive">+18.0%</b></div>
            <div><small>Decision horizon</small><b>30 days</b></div>
            <div className="signal-bars" aria-label="Portfolio signal strengthening over eight periods">
              {[32, 39, 35, 48, 54, 63, 69, 78].map((height, index) => <i key={index} style={{ height: height + "%" }} />)}
            </div>
          </div>
        </article>

        <div className="metric-grid">
          <article><span className="metric-icon blue"><Layers3 /></span><p>Active programmes</p><strong>{opportunities.length}</strong><small>3 at specification stage</small></article>
          <article><span className="metric-icon gold"><UsersRound /></span><p>Delivery readiness</p><strong>76%</strong><small>Five dependencies to resolve</small></article>
          <article><span className="metric-icon green"><CalendarDays /></span><p>Decision points</p><strong>7</strong><small>Due within 30 days</small></article>
          <article><span className="metric-icon coral"><ShieldCheck /></span><p>Portfolio confidence</p><strong>68</strong><small>Weighted qualification score</small></article>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel pipeline-panel">
          <div className="panel-heading"><div><p className="eyebrow">Opportunity portfolio</p><h2>Priority growth programmes</h2></div><button className="text-action" onClick={onViewAll}>View portfolio <ArrowUpRight /></button></div>
          <div className="opportunity-list">
            {opportunities.slice(0, 4).map((item) => (
              <button className="opportunity" key={item.id} onClick={() => onOpenOpportunity(item.id)}>
                <span className="opportunity-icon"><MarketIcon market={item.market} /></span>
                <span className="opportunity-main"><strong>{item.name}</strong><small>{item.market} · {item.region}</small></span>
                <span className="stage">{item.stage}</span>
                <span className="probability"><span><i style={{ width: item.probability + "%" }} /></span><small>{item.probability}% qualified</small></span>
                <b>{formatMoney(item.value)}</b><ChevronRight className="chevron" />
              </button>
            ))}
          </div>
        </article>

        <article className="panel action-panel">
          <div className="panel-heading"><div><p className="eyebrow">Execution agenda</p><h2>Recommended priorities</h2></div><span className="count-badge">4</span></div>
          <ol className="action-list">
            <li><span className="priority high">Now</span><div><strong>Confirm the cooling specification route</strong><small>Nordic data-centre programme · decision due today</small></div></li>
            <li><span className="priority">2d</span><div><strong>Resolve installer capability requirements</strong><small>Saudi Arabia · fire protection workstream</small></div></li>
            <li><span className="priority">4d</span><div><strong>Issue the schedule-value evidence brief</strong><small>UK water resilience framework</small></div></li>
            <li><span className="priority">6d</span><div><strong>Validate BIM decision authority</strong><small>European gigafactory cluster</small></div></li>
          </ol>
        </article>
      </section>

      <section className="dashboard-grid lower-grid">
        <article className="panel market-panel">
          <div className="panel-heading"><div><p className="eyebrow">Market intelligence</p><h2>Sector attractiveness</h2></div><span className="updated">Assessment · 05 Sep</span></div>
          <div className="market-bars">
            {[["Mission critical", 91, "£10.6m"], ["Water infrastructure", 84, "£8.2m"], ["Healthcare", 76, "£5.1m"], ["Advanced manufacturing", 69, "£4.7m"], ["Fire protection", 62, "£3.2m"]].map(([name, score, value]) => (
              <div className="market-row" key={String(name)}><span>{name}</span><div><i style={{ width: score + "%" }} /></div><b>{score}</b><small>{value}</small></div>
            ))}
          </div>
        </article>

        <article className="panel coverage-panel">
          <div className="panel-heading"><div><p className="eyebrow">Route to market</p><h2>Execution dependencies</h2></div><button className="text-action" onClick={onOpenPartners}>Review coverage <ArrowUpRight /></button></div>
          <div className="gap-stat"><span><Flame /></span><div><strong>Five dependencies affect £9.4m</strong><small>Technical distribution and trained installer capacity are the immediate priorities.</small></div></div>
          <div className="gap-tags"><span>Saudi Arabia · Fire <b>Critical</b></span><span>Nordics · VDC <b>Critical</b></span><span>United Kingdom · Water <b>Elevated</b></span></div>
        </article>
      </section>
    </div>
  );
}

function OpportunitiesView({ opportunities, selected, query, setQuery, marketFilter, setMarketFilter, stageFilter, setStageFilter, setSelectedId, exportPipeline }: {
  opportunities: Opportunity[];
  selected: Opportunity;
  query: string;
  setQuery: (value: string) => void;
  marketFilter: string;
  setMarketFilter: (value: string) => void;
  stageFilter: string;
  setStageFilter: (value: string) => void;
  setSelectedId: (id: number) => void;
  exportPipeline: () => void;
}) {
  return (
    <div className="content module-content">
      <section className="module-intro">
        <div><span className="intro-kicker">From signal to specification</span><p>Qualify emerging project demand, establish the stakeholder route and coordinate the commercial actions required to convert each programme.</p></div>
        <Button variant="outline" onClick={exportPipeline}><Download /> Export portfolio</Button>
      </section>
      <section className="filters panel">
        <label className="inline-search"><Search /><span className="sr-only">Filter opportunities</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search opportunity, region or market" /></label>
        <Select value={marketFilter} onValueChange={setMarketFilter}>
          <SelectTrigger className="filter-select"><SelectValue /></SelectTrigger>
          <SelectContent>{["All markets", "Mission critical", "Healthcare", "Infrastructure", "Industrial", "Fire protection", "Mining"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="filter-select"><SelectValue /></SelectTrigger>
          <SelectContent>{["All stages", "Project identified", "Solution mapping", "Specifier engagement", "Partner validation", "Commercial case"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <span className="result-count">{opportunities.length} opportunities</span>
      </section>

      <section className="opportunity-workspace">
        <article className="panel radar-list">
          <div className="table-header"><span>Opportunity</span><span>Qualification stage</span><span>Score</span><span>Value</span></div>
          {opportunities.length ? opportunities.map((item) => (
            <button key={item.id} onClick={() => setSelectedId(item.id)} className={selected.id === item.id ? "radar-row selected" : "radar-row"}>
              <span className="radar-name"><i><MarketIcon market={item.market} /></i><span><strong>{item.name}</strong><small>{item.region} · {item.market}</small></span></span>
              <span className="radar-stage">{item.stage}</span>
              <span className="radar-score"><b>{item.probability}</b><i><em style={{ width: item.probability + "%" }} /></i></span>
              <strong className="radar-value">{formatMoney(item.value)}</strong>
            </button>
          )) : (
            <div className="empty-state"><Search /><strong>No opportunities match</strong><span>Clear a filter or try a broader search.</span></div>
          )}
        </article>

        <aside className="panel opportunity-detail">
          <div className="detail-head"><div><p className="eyebrow">Opportunity brief</p><h2>{selected.name}</h2></div><span className="fit-ring" style={{ "--score": selected.probability } as CSSProperties}>{selected.probability}<small>score</small></span></div>
          <p className="detail-signal">{selected.signal}</p>
          <div className="detail-meta"><span><CalendarDays /> Decision milestone <b>{selected.due}</b></span><span><BriefcaseBusiness /> Indicative pipeline value <b>{formatMoney(selected.value)}</b></span></div>
          <div className="detail-section"><h3>Solution alignment hypothesis</h3><div className="fit-tags">{selected.systemFit.map((item) => <span key={item}><CheckCircle2 />{item}</span>)}</div></div>
          <div className="detail-section"><h3>Stakeholder pathway</h3><ol className="stakeholder-route">{selected.stakeholders.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></div>
          <div className="detail-actions"><Button onClick={() => window.print()}><Printer /> Generate opportunity brief</Button><a href="https://www.victaulic.com/product-guide/" target="_blank" rel="noreferrer">Validate product applicability <ArrowUpRight /></a></div>
        </aside>
      </section>
    </div>
  );
}

function PlannerView() {
  const [region, setRegion] = useState<keyof typeof regionModels>("Saudi Arabia");
  const [activity, setActivity] = useState(regionModels[region].activity);
  const [channel, setChannel] = useState(regionModels[region].channel);
  const [influence, setInfluence] = useState(regionModels[region].influence);
  const [ease, setEase] = useState(regionModels[region].ease);
  const [saved, setSaved] = useState(false);
  const score = Math.round(activity * .3 + channel * .25 + influence * .25 + ease * .2);

  function chooseRegion(value: keyof typeof regionModels) {
    const model = regionModels[value];
    setRegion(value);
    setActivity(model.activity);
    setChannel(model.channel);
    setInfluence(model.influence);
    setEase(model.ease);
    setSaved(false);
  }

  return (
    <div className="content module-content">
      <section className="module-intro"><div><span className="intro-kicker">Evidence-led prioritisation</span><p>Compare addressable project demand with specification access, delivery capability and operating conditions. Adjust the assumptions to evaluate alternative entry strategies.</p></div><Select value={region} onValueChange={(value) => chooseRegion(value as keyof typeof regionModels)}><SelectTrigger className="region-select"><Globe2 /><SelectValue /></SelectTrigger><SelectContent>{Object.keys(regionModels).map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select></section>
      <section className="planner-grid">
        <article className="panel scenario-panel">
          <div className="panel-heading"><div><p className="eyebrow">Market assessment</p><h2>{region} entry scenario</h2></div><span className={score >= 75 ? "score strong" : "score"} style={{ "--score": score } as CSSProperties}>{score}<small>priority score</small></span></div>
          <div className="slider-list">
            <ModelSlider label="Capital project activity" value={activity} setValue={setActivity} hint="Volume and timing of addressable programmes" />
            <ModelSlider label="Channel readiness" value={channel} setValue={setChannel} hint="Distribution, stock and installer coverage" />
            <ModelSlider label="Specification influence" value={influence} setValue={setInfluence} hint="Access to owners, consultants and EPCs" />
            <ModelSlider label="Operating ease" value={ease} setValue={setEase} hint="Approvals, procurement and serviceability" />
          </div>
          <div className="scenario-actions"><Button onClick={() => setSaved(true)}><ClipboardCheck /> Save scenario</Button>{saved && <span className="saved-state"><CheckCircle2 /> Scenario saved for this session</span>}</div>
        </article>

        <aside className="panel recommended-play">
          <p className="eyebrow">Recommended entry thesis</p><h2>{regionModels[region].lead}</h2>
          <p>Lead with project-specific schedule and delivery-risk evidence. Establish the specification pathway before expanding wider channel capacity.</p>
          <div className="play-steps">
            <span><b>01</b><strong>Identify the programme</strong><small>Prioritise named projects entering concept or MEP design.</small></span>
            <span><b>02</b><strong>Establish the specification position</strong><small>Build the technical and commercial evidence with the decision team.</small></span>
            <span><b>03</b><strong>Mobilise delivery capability</strong><small>Align trained installers, stock, logistics and field support.</small></span>
          </div>
          <div className="reference-links"><a href="https://www.victaulic.com/software" target="_blank" rel="noreferrer">VDC services <ArrowUpRight /></a><a href="https://www.victaulic.com/where-to-buy/" target="_blank" rel="noreferrer">Distributor network <ArrowUpRight /></a></div>
        </aside>
      </section>

      <article className="panel matrix-panel">
        <div className="panel-heading"><div><p className="eyebrow">Comparative portfolio</p><h2>Market prioritisation matrix</h2></div><span className="updated">Illustrative planning model</span></div>
        <div className="matrix-table">
          <div className="matrix-head"><span>Market</span><span>Momentum</span><span>Solution alignment</span><span>Typical cycle</span><span>Route to market</span></div>
          {marketMatrix.map((item) => <div className="matrix-row" key={item.market}><strong>{item.market}</strong><span><i style={{ width: item.momentum + "%" }} /><b>{item.momentum}</b></span><span><i style={{ width: item.fit + "%" }} /><b>{item.fit}</b></span><span>{item.cycle}</span><span>{item.route}</span></div>)}
        </div>
      </article>
    </div>
  );
}

function ModelSlider({ label, value, setValue, hint }: { label: string; value: number; setValue: (value: number) => void; hint: string }) {
  return (
    <div className="model-slider"><div><strong>{label}</strong><span>{hint}</span></div><b>{value}</b><Slider min={0} max={100} step={1} value={[value]} onValueChange={(values) => setValue(values[0])} aria-label={label} /></div>
  );
}

function ValueBuilder() {
  const [joints, setJoints] = useState(480);
  const [conventional, setConventional] = useState(65);
  const [mechanical, setMechanical] = useState(22);
  const [crew, setCrew] = useState(4);
  const [rate, setRate] = useState(42);
  const [dayExposure, setDayExposure] = useState(8500);
  const [criticalPath, setCriticalPath] = useState(35);
  const minutesSaved = Math.max(0, conventional - mechanical);
  const crewHoursSaved = joints * minutesSaved / 60;
  const individualHoursSaved = crewHoursSaved * crew;
  const labourValue = individualHoursSaved * rate;
  const workingDaysRecovered = crewHoursSaved / 8;
  const scheduleValue = workingDaysRecovered * dayExposure * criticalPath / 100;
  const totalValue = labourValue + scheduleValue;

  return (
    <div className="content module-content">
      <section className="module-intro"><div><span className="intro-kicker">Quantified project outcomes</span><p>Develop an indicative economic case for replacing a conventional joining method with a faster mechanical approach, using transparent project assumptions.</p></div><Button variant="outline" onClick={() => window.print()}><Printer /> Print value case</Button></section>
      <section className="value-grid">
        <article className="panel assumptions-panel">
          <div className="panel-heading"><div><p className="eyebrow">Model inputs</p><h2>Project assumptions</h2></div><span className="updated">All values are editable</span></div>
          <div className="input-grid">
            <NumberField label="Number of joints" value={joints} setValue={setJoints} suffix="joints" />
            <NumberField label="Crew size" value={crew} setValue={setCrew} suffix="people" />
            <NumberField label="Conventional installation time" value={conventional} setValue={setConventional} suffix="min / joint" />
            <NumberField label="Mechanical installation time" value={mechanical} setValue={setMechanical} suffix="min / joint" />
            <NumberField label="Loaded labour rate" value={rate} setValue={setRate} prefix="£" suffix="/ person hr" />
            <NumberField label="Daily schedule exposure" value={dayExposure} setValue={setDayExposure} prefix="£" suffix="/ day" />
          </div>
          <div className="critical-slider"><div><strong>Critical-path exposure</strong><span>Percentage of recovered working time that affects the overall project schedule</span></div><b>{criticalPath}%</b><Slider min={0} max={100} step={5} value={[criticalPath]} onValueChange={(values) => setCriticalPath(values[0])} aria-label="Critical-path exposure" /></div>
          <div className="method-note"><ShieldCheck /><p><strong>Use verified project inputs.</strong> This is a commercial screening model—not engineering advice, a quotation or a manufacturer performance claim.</p></div>
        </article>

        <aside className="panel value-result">
          <p className="eyebrow">Illustrative value opportunity</p><strong className="total-value">£{Math.round(totalValue).toLocaleString("en-GB")}</strong><span className="value-caption">modelled labour and schedule contribution</span>
          <div className="value-breakdown">
            <div><span>Time per joint</span><b>{minutesSaved} min saved</b></div>
            <div><span>Crew working time</span><b>{Math.round(crewHoursSaved)} hrs</b></div>
            <div><span>Working days recovered</span><b>{workingDaysRecovered.toFixed(1)} days</b></div>
            <div><span>Direct labour value</span><b>£{Math.round(labourValue).toLocaleString("en-GB")}</b></div>
            <div><span>Schedule value</span><b>£{Math.round(scheduleValue).toLocaleString("en-GB")}</b></div>
          </div>
          <div className="value-message"><Sparkles /><p>Use this screening estimate to determine whether a detailed, manufacturer-supported value-engineering assessment is warranted.</p></div>
          <a className="source-action" href="https://www.victaulic.com/solutions/" target="_blank" rel="noreferrer">Review manufacturer solution evidence <ArrowUpRight /></a>
        </aside>
      </section>
    </div>
  );
}

function NumberField({ label, value, setValue, prefix, suffix }: { label: string; value: number; setValue: (value: number) => void; prefix?: string; suffix: string }) {
  return <label className="number-field"><span>{label}</span><div>{prefix && <i>{prefix}</i>}<input type="number" min="0" value={value} onChange={(e) => setValue(Math.max(0, Number(e.target.value)))} /><small>{suffix}</small></div></label>;
}

function PartnerView() {
  const [region, setRegion] = useState("All regions");
  const [capability, setCapability] = useState("All capabilities");
  const [selectedPartner, setSelectedPartner] = useState(partners[0].name);
  const filtered = partners.filter((item) => (region === "All regions" || item.region === region) && (capability === "All capabilities" || item.capability === capability));
  const current = partners.find((item) => item.name === selectedPartner) ?? filtered[0] ?? partners[0];

  return (
    <div className="content module-content">
      <section className="module-intro"><div><span className="intro-kicker">Delivery ecosystem readiness</span><p>Identify the route-to-market dependencies behind each opportunity and coordinate specification, stock, installation and field-support capability by territory.</p></div><span className="readiness-summary"><b>76%</b> portfolio readiness</span></section>
      <section className="partner-controls panel">
        <Select value={region} onValueChange={setRegion}><SelectTrigger className="filter-select"><SelectValue /></SelectTrigger><SelectContent>{["All regions", "Saudi Arabia", "Nordics", "United Kingdom", "Central Europe", "Australia"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={capability} onValueChange={setCapability}><SelectTrigger className="filter-select"><SelectValue /></SelectTrigger><SelectContent>{["All capabilities", "Distribution", "Installation", "VDC", "Specification"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select>
        <span>{filtered.length} active workstreams</span>
      </section>
      <section className="partner-grid">
        <article className="panel partner-list">
          <div className="partner-head"><span>Territory workstream</span><span>Capability readiness</span><span>Status</span></div>
          {filtered.map((item) => (
            <button key={item.name} className={current.name === item.name ? "partner-row selected" : "partner-row"} onClick={() => setSelectedPartner(item.name)}>
              <span><i><PackageCheck /></i><span><strong>{item.name}</strong><small>{item.region} · {item.capability}</small></span></span>
              <span className="partner-score"><i><em style={{ width: item.readiness + "%" }} /></i><b>{item.readiness}%</b></span>
              <span className={"status-pill " + item.status.toLowerCase().replace(" ", "-")}>{item.status}</span>
            </button>
          ))}
          {!filtered.length && <div className="empty-state"><Network /><strong>No matching workstreams</strong><span>Change one of the partner filters.</span></div>}
        </article>
        <aside className="panel partner-detail">
          <p className="eyebrow">Capability workstream</p><h2>{current.name}</h2>
          <div className="readiness-gauge"><span style={{ "--score": current.readiness } as CSSProperties}><b>{current.readiness}%</b><small>readiness</small></span></div>
          <div className="gap-card"><span>Primary dependency</span><strong>{current.gap}</strong><small>Resolve before the opportunity advances into procurement.</small></div>
          <div className="partner-checklist"><h3>Readiness criteria</h3><span className="done"><CheckCircle2 /> Territory lead appointed</span><span className={current.readiness > 70 ? "done" : ""}><CheckCircle2 /> Technical capability validated</span><span className={current.readiness > 80 ? "done" : ""}><CheckCircle2 /> Stock and logistics plan confirmed</span><span><CheckCircle2 /> Joint pursuit plan approved</span></div>
          <a href="https://www.victaulic.com/where-to-buy/" target="_blank" rel="noreferrer">Review official distributor coverage <ArrowUpRight /></a>
        </aside>
      </section>
    </div>
  );
}
