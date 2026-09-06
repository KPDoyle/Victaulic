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
  { id: "command" as const, label: "Network overview", icon: Gauge },
  { id: "opportunities" as const, label: "Project pipeline", icon: Target },
  { id: "planner" as const, label: "Customer network", icon: Map },
  { id: "value" as const, label: "BIM conversion", icon: TrendingUp },
  { id: "partners" as const, label: "Delivery network", icon: Network },
];

const initialOpportunities: Opportunity[] = [
  {
    id: 1,
    name: "Nordic data-centre programme",
    market: "Mission critical",
    region: "Nordics",
    stage: "Coordination room live",
    value: 4.8,
    probability: 78,
    due: "12 Sep 2026",
    signal: "Three hyperscale campuses are entering federated MEP coordination. The immediate play is to connect the design lead, BIM manager and mechanical contractor around a project-specific cooling model review.",
    systemFit: ["Coordinated piping model", "Validated BIM content", "Model-based bill of materials", "VDC design review"],
    stakeholders: ["MEP consultant", "Cooling designer", "General contractor", "Regional distributor"],
  },
  {
    id: 2,
    name: "Gulf healthcare expansion",
    market: "Healthcare",
    region: "Saudi Arabia",
    stage: "Design team connected",
    value: 3.2,
    probability: 71,
    due: "18 Sep 2026",
    signal: "A multi-site hospital programme needs a repeatable design standard. Connect the healthcare developer, MEP consultant and fire contractor before the first coordinated model is issued.",
    systemFit: ["Design standard template", "Hydronic BIM content", "Fire protection families", "Applications engineering review"],
    stakeholders: ["Healthcare developer", "Design consultant", "Fire contractor", "Technical distributor"],
  },
  {
    id: 3,
    name: "UK water resilience framework",
    market: "Infrastructure",
    region: "United Kingdom",
    stage: "BIM discovery",
    value: 6.1,
    probability: 66,
    due: "25 Sep 2026",
    signal: "Framework teams are prioritising schedule certainty and maintainability. A BIM discovery workshop can translate the design intent into repeatable assemblies and an approved delivery pathway.",
    systemFit: ["Repeatable plant assemblies", "Flow-control content", "Large-diameter coordination", "Model review workshop"],
    stakeholders: ["Water company", "Framework contractor", "Process engineer", "Stocking distributor"],
  },
  {
    id: 4,
    name: "European gigafactory cluster",
    market: "Industrial",
    region: "Central Europe",
    stage: "Project team mapped",
    value: 5.4,
    probability: 58,
    due: "03 Oct 2026",
    signal: "Four advanced-manufacturing projects are entering concept design. The platform has identified the owner engineering, EPC and mechanical delivery roles required for early design engagement.",
    systemFit: ["Utility piping design kit", "Stainless-system content", "Flow-control schedules", "VDC design support"],
    stakeholders: ["Owner engineering", "EPC", "Mechanical contractor", "Industrial distributor"],
  },
  {
    id: 5,
    name: "North American logistics programme",
    market: "Fire protection",
    region: "North America",
    stage: "Model-to-quote",
    value: 7.3,
    probability: 63,
    due: "08 Oct 2026",
    signal: "A logistics developer is standardising fire protection across a repeat-build portfolio. The coordinated model can now be converted into a repeatable schedule, bill of materials and local quote pathway.",
    systemFit: ["Fire protection design kit", "Valve and device schedules", "Model-based bill of materials", "Installer enablement"],
    stakeholders: ["Developer", "Fire consultant", "Sprinkler contractor", "Distribution partner"],
  },
  {
    id: 6,
    name: "Australian mine water upgrade",
    market: "Mining",
    region: "Australia",
    stage: "Contractor engagement",
    value: 5,
    probability: 55,
    due: "14 Oct 2026",
    signal: "A brownfield upgrade needs accurate existing-condition data and installation planning. Connect the EPCM, contractor and regional distributor around a scan-to-model coordination sprint.",
    systemFit: ["Scan-to-model brief", "HDPE transition content", "Installation sequencing", "Remote team training"],
    stakeholders: ["Mine operator", "EPCM", "Maintenance lead", "Regional distributor"],
  },
];

const regionModels = {
  "Saudi Arabia": { activity: 72, channel: 61, influence: 78, ease: 59, lead: "Connect the healthcare design authority" },
  Nordics: { activity: 81, channel: 74, influence: 85, ease: 78, lead: "Open the data-centre BIM room" },
  "United Kingdom": { activity: 76, channel: 84, influence: 72, ease: 82, lead: "Convene the water framework team" },
  "Central Europe": { activity: 69, channel: 76, influence: 71, ease: 74, lead: "Engage owner engineering and the EPC" },
  Australia: { activity: 68, channel: 68, influence: 65, ease: 76, lead: "Launch a scan-to-model workshop" },
};

const partners = [
  { name: "Riyadh project fulfilment connection", region: "Saudi Arabia", capability: "Distribution", readiness: 48, gap: "Technical stockholding", status: "Shortlisting" },
  { name: "Gulf fire contractor enablement", region: "Saudi Arabia", capability: "Installation", readiness: 57, gap: "Model-to-field training", status: "In development" },
  { name: "Nordic VDC delivery cell", region: "Nordics", capability: "VDC", readiness: 64, gap: "Local coordination capacity", status: "Capability gap" },
  { name: "UK water framework fulfilment", region: "United Kingdom", capability: "Distribution", readiness: 88, gap: "Project-room sponsor", status: "Validated" },
  { name: "Central Europe design integrator", region: "Central Europe", capability: "Specification", readiness: 72, gap: "Reference assemblies", status: "Due diligence" },
  { name: "Australian mining field network", region: "Australia", capability: "Installation", readiness: 69, gap: "Remote coordination support", status: "Due diligence" },
];

const marketMatrix = [
  { market: "Nordic data-centre ecosystem", momentum: 86, fit: 92, cycle: "12 organisations", route: "Mechanical contractor BIM lead" },
  { market: "UK water frameworks", momentum: 82, fit: 84, cycle: "18 organisations", route: "Framework digital delivery lead" },
  { market: "Gulf healthcare network", momentum: 73, fit: 78, cycle: "15 organisations", route: "MEP design authority" },
  { market: "Central European manufacturing", momentum: 69, fit: 81, cycle: "11 organisations", route: "Owner engineering director" },
  { market: "Australian mining delivery", momentum: 66, fit: 72, cycle: "9 organisations", route: "EPCM piping and BIM lead" },
];

const titles: Record<ViewId, { eyebrow: string; title: string }> = {
  command: { eyebrow: "Victaulic construction customer platform", title: "Network overview" },
  opportunities: { eyebrow: "Project discovery and conversion", title: "Connected project pipeline" },
  planner: { eyebrow: "Construction customer relationships", title: "Customer network" },
  value: { eyebrow: "BIM-led customer engagement", title: "BIM conversion studio" },
  partners: { eyebrow: "Procurement and field execution", title: "Delivery network" },
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
    stage: "Project team mapped",
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
      name: newOpportunity.name.trim() || "New construction project",
      market: newOpportunity.market,
      region: newOpportunity.region.trim() || "Territory to confirm",
      stage: newOpportunity.stage,
      value: Number(newOpportunity.value) || 1.5,
      probability: 45,
      due: "To be scheduled",
      signal: "New project recorded. Map the project team, confirm BIM maturity and identify the first high-value customer connection.",
      systemFit: ["BIM discovery required", "Victaulic VDC review"],
      stakeholders: ["Project owner", "Specifier", "Contractor", "Distribution partner"],
    };
    setOpportunities((current) => [next, ...current]);
    setSelectedId(next.id);
    setActiveView("opportunities");
    setDialogOpen(false);
    setNewOpportunity({ name: "", market: "Mission critical", region: "", stage: "Project team mapped", value: "1.5" });
  }

  function exportPipeline() {
    const headings = ["Project", "Segment", "Territory", "Engagement stage", "Addressable value GBP m", "BIM readiness score", "Decision date"];
    const rows = opportunities.map((item) => [item.name, item.market, item.region, item.stage, item.value, item.probability, item.due]);
    const csv = [headings, ...rows].map((row) => row.map((value) => '"' + String(value).replaceAll('"', '""') + '"').join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "headroom-connected-project-pipeline.csv";
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
        <button className="brand brand-button" onClick={() => switchView("command")} aria-label="Open network overview">
          <div className="brand-mark" aria-hidden="true"><span /><span /></div>
          <div><strong>Headroom</strong><small>GrowthOS · Build network</small></div>
        </button>

        <nav aria-label="Primary navigation" className="primary-nav">
          <p>Customer platform</p>
          {nav.map((item) => (
            <button className={activeView === item.id ? "active" : ""} key={item.id} onClick={() => switchView(item.id)} aria-current={activeView === item.id ? "page" : undefined}>
              <item.icon aria-hidden="true" /><span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-note">
          <CircleDot aria-hidden="true" />
          <div><strong>Victaulic Customer &amp; BIM Workspace</strong><span>Independent connected-construction platform</span></div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="page-title"><p>{titles[activeView].eyebrow}</p><h1>{titles[activeView].title}</h1></div>
          <div className="top-actions">
            <div className="data-status"><span /><div><small>Network status</small><strong>47 organisations connected</strong></div></div>
            <label className="search-box">
              <Search aria-hidden="true" />
              <span className="sr-only">Search projects</span>
              <input
                placeholder="Search projects and organisations"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") setActiveView("opportunities");
                }}
              />
            </label>
            <Button className="primary-action" onClick={() => setDialogOpen(true)}>
              <Plus aria-hidden="true" /> Add project
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
        {activeView === "value" && <BimPlayStudio />}
        {activeView === "partners" && <PartnerView />}

        <footer className="global-footer">
          <p>Headroom GrowthOS is independently owned and demonstrates a proposed customer-engagement platform for Victaulic Company. It is not affiliated with or endorsed by Victaulic Company. All project, organisation and readiness data is illustrative. Product and BIM-content applicability must be validated against current manufacturer documentation and project-specific engineering requirements.</p>
        </footer>
      </section>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="opportunity-dialog">
          <form onSubmit={addOpportunity}>
            <DialogHeader>
              <DialogTitle>Add a construction project</DialogTitle>
              <DialogDescription>Record the core project signal. The platform will guide project-team mapping, BIM discovery and the first customer connection.</DialogDescription>
            </DialogHeader>
            <div className="dialog-form">
              <label className="field full"><span>Project or programme name</span><input required value={newOpportunity.name} onChange={(e) => setNewOpportunity({ ...newOpportunity, name: e.target.value })} placeholder="e.g. Nordic hospital programme" /></label>
              <label className="field"><span>Construction segment</span>
                <Select value={newOpportunity.market} onValueChange={(value) => setNewOpportunity({ ...newOpportunity, market: value })}>
                  <SelectTrigger className="select-control"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Mission critical", "Healthcare", "Infrastructure", "Industrial", "Fire protection", "Mining"].map((market) => <SelectItem value={market} key={market}>{market}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
              <label className="field"><span>Territory</span><input required value={newOpportunity.region} onChange={(e) => setNewOpportunity({ ...newOpportunity, region: e.target.value })} placeholder="Country or territory" /></label>
              <label className="field"><span>Engagement stage</span>
                <Select value={newOpportunity.stage} onValueChange={(value) => setNewOpportunity({ ...newOpportunity, stage: value })}>
                  <SelectTrigger className="select-control"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Project team mapped", "Design team connected", "BIM discovery", "Coordination room live", "Contractor engagement", "Model-to-quote"].map((stage) => <SelectItem value={stage} key={stage}>{stage}</SelectItem>)}
                  </SelectContent>
                </Select>
              </label>
              <label className="field"><span>Addressable value (£m)</span><input type="number" min="0.1" step="0.1" value={newOpportunity.value} onChange={(e) => setNewOpportunity({ ...newOpportunity, value: e.target.value })} /></label>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit">Add project</Button>
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
      <section className="portfolio-hero" aria-label="Connected construction network outlook">
        <article className="outlook-card">
          <div className="outlook-topline"><p className="eyebrow">Connected construction pipeline</p><span className="live-indicator"><i /> Illustrative network</span></div>
          <div className="outlook-copy">
            <span>Addressable project value</span>
            <strong>{formatMoney(pipelineValue)}</strong>
            <p>One shared operating layer connecting Victaulic with owners, design teams, contractors, fabricators and channel partners across six priority construction programmes.</p>
          </div>
          <div className="outlook-footer">
            <div><small>BIM-engaged value</small><b>{formatMoney(weightedValue)}</b></div>
            <div><small>Connected organisations</small><b className="positive">47</b></div>
            <div><small>Active project rooms</small><b>9</b></div>
            <div className="signal-bars" aria-label="Customer connection activity strengthening over eight periods">
              {[32, 39, 35, 48, 54, 63, 69, 78].map((height, index) => <i key={index} style={{ height: height + "%" }} />)}
            </div>
          </div>
        </article>

        <div className="metric-grid">
          <article><span className="metric-icon blue"><Layers3 /></span><p>Active projects</p><strong>{opportunities.length}</strong><small>Four ready for BIM engagement</small></article>
          <article><span className="metric-icon gold"><UsersRound /></span><p>Customer connections</p><strong>47</strong><small>Across five project ecosystems</small></article>
          <article><span className="metric-icon green"><CalendarDays /></span><p>Specification decisions</p><strong>7</strong><small>Due within 30 days</small></article>
          <article><span className="metric-icon coral"><ShieldCheck /></span><p>BIM readiness</p><strong>68</strong><small>Portfolio-weighted score</small></article>
        </div>
      </section>

      <section className="dashboard-grid">
        <article className="panel pipeline-panel">
          <div className="panel-heading"><div><p className="eyebrow">Project network</p><h2>Priority project rooms</h2></div><button className="text-action" onClick={onViewAll}>View pipeline <ArrowUpRight /></button></div>
          <div className="opportunity-list">
            {opportunities.slice(0, 4).map((item) => (
              <button className="opportunity" key={item.id} onClick={() => onOpenOpportunity(item.id)}>
                <span className="opportunity-icon"><MarketIcon market={item.market} /></span>
                <span className="opportunity-main"><strong>{item.name}</strong><small>{item.market} · {item.region}</small></span>
                <span className="stage">{item.stage}</span>
                <span className="probability"><span><i style={{ width: item.probability + "%" }} /></span><small>{item.probability}% BIM-ready</small></span>
                <b>{formatMoney(item.value)}</b><ChevronRight className="chevron" />
              </button>
            ))}
          </div>
        </article>

        <article className="panel action-panel">
          <div className="panel-heading"><div><p className="eyebrow">Connection agenda</p><h2>Next customer moves</h2></div><span className="count-badge">4</span></div>
          <ol className="action-list">
            <li><span className="priority high">Now</span><div><strong>Invite the MEP BIM lead into the project room</strong><small>Nordic data-centre programme · decision due today</small></div></li>
            <li><span className="priority">2d</span><div><strong>Schedule the fire-system BIM discovery</strong><small>Gulf healthcare expansion · design team connected</small></div></li>
            <li><span className="priority">4d</span><div><strong>Issue the repeatable assembly brief</strong><small>UK water resilience framework</small></div></li>
            <li><span className="priority">6d</span><div><strong>Connect owner engineering with the EPC BIM lead</strong><small>European gigafactory cluster</small></div></li>
          </ol>
        </article>
      </section>

      <section className="dashboard-grid lower-grid">
        <article className="panel market-panel">
          <div className="panel-heading"><div><p className="eyebrow">BIM engagement</p><h2>Activation potential by segment</h2></div><span className="updated">Network assessment · 05 Sep</span></div>
          <div className="market-bars">
            {[["Mission critical", 91, "£10.6m"], ["Water infrastructure", 84, "£8.2m"], ["Healthcare", 76, "£5.1m"], ["Advanced manufacturing", 69, "£4.7m"], ["Fire protection", 62, "£3.2m"]].map(([name, score, value]) => (
              <div className="market-row" key={String(name)}><span>{name}</span><div><i style={{ width: score + "%" }} /></div><b>{score}</b><small>{value}</small></div>
            ))}
          </div>
        </article>

        <article className="panel coverage-panel">
          <div className="panel-heading"><div><p className="eyebrow">Network coverage</p><h2>Missing customer connections</h2></div><button className="text-action" onClick={onOpenPartners}>Review network <ArrowUpRight /></button></div>
          <div className="gap-stat"><span><Flame /></span><div><strong>Five missing connections affect £9.4m</strong><small>MEP design authority, BIM coordination and contractor engagement are the immediate priorities.</small></div></div>
          <div className="gap-tags"><span>Saudi Arabia · MEP designer <b>Critical</b></span><span>Nordics · BIM lead <b>Critical</b></span><span>United Kingdom · Digital delivery <b>Elevated</b></span></div>
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
        <div><span className="intro-kicker">From project signal to connected team</span><p>Turn construction intelligence into shared project rooms that connect Victaulic with the people shaping design, procurement, fabrication and installation.</p></div>
        <Button variant="outline" onClick={exportPipeline}><Download /> Export project network</Button>
      </section>
      <section className="filters panel">
        <label className="inline-search"><Search /><span className="sr-only">Filter projects</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search project, territory or segment" /></label>
        <Select value={marketFilter} onValueChange={setMarketFilter}>
          <SelectTrigger className="filter-select"><SelectValue /></SelectTrigger>
          <SelectContent>{["All markets", "Mission critical", "Healthcare", "Infrastructure", "Industrial", "Fire protection", "Mining"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={stageFilter} onValueChange={setStageFilter}>
          <SelectTrigger className="filter-select"><SelectValue /></SelectTrigger>
          <SelectContent>{["All stages", "Project team mapped", "Design team connected", "BIM discovery", "Coordination room live", "Contractor engagement", "Model-to-quote"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent>
        </Select>
        <span className="result-count">{opportunities.length} connected projects</span>
      </section>

      <section className="opportunity-workspace">
        <article className="panel radar-list">
          <div className="table-header"><span>Construction project</span><span>Engagement stage</span><span>BIM readiness</span><span>Value</span></div>
          {opportunities.length ? opportunities.map((item) => (
            <button key={item.id} onClick={() => setSelectedId(item.id)} className={selected.id === item.id ? "radar-row selected" : "radar-row"}>
              <span className="radar-name"><i><MarketIcon market={item.market} /></i><span><strong>{item.name}</strong><small>{item.region} · {item.market}</small></span></span>
              <span className="radar-stage">{item.stage}</span>
              <span className="radar-score"><b>{item.probability}</b><i><em style={{ width: item.probability + "%" }} /></i></span>
              <strong className="radar-value">{formatMoney(item.value)}</strong>
            </button>
          )) : (
            <div className="empty-state"><Search /><strong>No projects match</strong><span>Clear a filter or try a broader search.</span></div>
          )}
        </article>

        <aside className="panel opportunity-detail">
          <div className="detail-head"><div><p className="eyebrow">Project connection plan</p><h2>{selected.name}</h2></div><span className="fit-ring" style={{ "--score": selected.probability } as CSSProperties}>{selected.probability}<small>BIM ready</small></span></div>
          <p className="detail-signal">{selected.signal}</p>
          <div className="detail-meta"><span><CalendarDays /> Next connection milestone <b>{selected.due}</b></span><span><BriefcaseBusiness /> Addressable project value <b>{formatMoney(selected.value)}</b></span></div>
          <div className="detail-section"><h3>BIM engagement deliverables</h3><div className="fit-tags">{selected.systemFit.map((item) => <span key={item}><CheckCircle2 />{item}</span>)}</div></div>
          <div className="detail-section"><h3>Connected project team</h3><ol className="stakeholder-route">{selected.stakeholders.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></div>
          <div className="detail-actions"><Button onClick={() => window.print()}><Printer /> Generate connection brief</Button><a href="https://www.victaulic.com/resource-software/" target="_blank" rel="noreferrer">Review Victaulic BIM content <ArrowUpRight /></a></div>
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
  const score = Math.round(activity * .22 + channel * .2 + influence * .33 + ease * .25);

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
      <section className="module-intro"><div><span className="intro-kicker">Project-centred relationship intelligence</span><p>Measure access to the owners, design teams, contractors and delivery partners influencing live construction projects. Adjust the assessment as relationships develop.</p></div><Select value={region} onValueChange={(value) => chooseRegion(value as keyof typeof regionModels)}><SelectTrigger className="region-select"><Globe2 /><SelectValue /></SelectTrigger><SelectContent>{Object.keys(regionModels).map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select></section>
      <section className="planner-grid">
        <article className="panel scenario-panel">
          <div className="panel-heading"><div><p className="eyebrow">Relationship coverage</p><h2>{region} customer ecosystem</h2></div><span className={score >= 75 ? "score strong" : "score"} style={{ "--score": score } as CSSProperties}>{score}<small>network score</small></span></div>
          <div className="slider-list">
            <ModelSlider label="Owner and developer access" value={activity} setValue={setActivity} hint="Relationships with capital programme decision-makers" />
            <ModelSlider label="Distribution coverage" value={channel} setValue={setChannel} hint="Technical stock, pricing and local fulfilment" />
            <ModelSlider label="Designer and specifier access" value={influence} setValue={setInfluence} hint="MEP, fire protection and digital-design relationships" />
            <ModelSlider label="Contractor engagement" value={ease} setValue={setEase} hint="BIM, fabrication and field-delivery relationships" />
          </div>
          <div className="scenario-actions"><Button onClick={() => setSaved(true)}><ClipboardCheck /> Save network assessment</Button>{saved && <span className="saved-state"><CheckCircle2 /> Assessment saved for this session</span>}</div>
        </article>

        <aside className="panel recommended-play">
          <p className="eyebrow">Priority customer connection</p><h2>{regionModels[region].lead}</h2>
          <p>Use a named live project as the reason to connect. Offer a short BIM discovery session that creates value for the whole project team, not a product presentation.</p>
          <div className="play-steps">
            <span><b>01</b><strong>Map the active project team</strong><small>Identify the owner, MEP designer, BIM lead, contractor and buying route.</small></span>
            <span><b>02</b><strong>Open the BIM discovery room</strong><small>Agree model maturity, coordination constraints and required deliverables.</small></span>
            <span><b>03</b><strong>Connect procurement and delivery</strong><small>Bring pricing, stock, fabrication and site-support partners into the same plan.</small></span>
          </div>
          <div className="reference-links"><a href="https://www.victaulic.com/virtual-design-and-construction/" target="_blank" rel="noreferrer">Victaulic VDC services <ArrowUpRight /></a><a href="https://www.victaulic.com/resource-software/" target="_blank" rel="noreferrer">BIM content library <ArrowUpRight /></a></div>
        </aside>
      </section>

      <article className="panel matrix-panel">
        <div className="panel-heading"><div><p className="eyebrow">Relationship portfolio</p><h2>Customer network coverage</h2></div><span className="updated">Illustrative organisation map</span></div>
        <div className="matrix-table">
          <div className="matrix-head"><span>Customer ecosystem</span><span>Relationship</span><span>BIM relevance</span><span>Network size</span><span>Priority connection</span></div>
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

function BimPlayStudio() {
  const [phase, setPhase] = useState("Design development");
  const [modelMaturity, setModelMaturity] = useState(62);
  const [designerAccess, setDesignerAccess] = useState(72);
  const [contractorReadiness, setContractorReadiness] = useState(55);
  const [activated, setActivated] = useState(false);
  const readiness = Math.round(modelMaturity * .34 + designerAccess * .36 + contractorReadiness * .3);
  const play = phase === "Concept design"
    ? {
        title: "Design-assist launch",
        duration: "Two-week early-design engagement",
        outcome: "A project-specific basis of design, BIM content plan and named specification pathway.",
        outputs: ["Owner and designer discovery", "System strategy workshop", "Validated content set", "Specification action plan"],
      }
    : phase === "Fabrication planning" || contractorReadiness >= 76
      ? {
          title: "Model-to-quote sprint",
          duration: "Five-day commercial conversion",
          outcome: "Convert coordinated model data into a reviewable package, bill of materials and fulfilment route.",
          outputs: ["Model quality review", "Assembly and spool scope", "Bill of materials", "Distributor quote handoff"],
        }
      : {
          title: "BIM Conversion Room",
          duration: "Ten-day connected-team workflow",
          outcome: "Bring the designer, BIM lead, contractor and Victaulic VDC team together to convert coordination work into specification intent.",
          outputs: ["Project-team connection", "Federated model review", "Issue and decision register", "Specification handoff"],
        };

  const playOptions = [
    { number: "01", phase: "Concept design", title: "Design-assist launch", timing: "Concept → 30% design", description: "Create early value for the owner and designer through system strategy, constructability and trusted BIM content." },
    { number: "02", phase: "Design development", title: "BIM Conversion Room", timing: "30% → coordinated design", description: "Connect the whole project team around model decisions that can become specification and procurement intent." },
    { number: "03", phase: "Fabrication planning", title: "Model-to-quote sprint", timing: "Coordination → fabrication", description: "Translate model intelligence into assemblies, material schedules, local pricing and a delivery-ready handoff." },
  ];

  function choosePlay(nextPhase: string) {
    setPhase(nextPhase);
    setActivated(false);
  }

  return (
    <div className="content module-content">
      <section className="module-intro"><div><span className="intro-kicker">A BIM play built around customer value</span><p>Match the engagement to project phase, model maturity and relationship readiness—then connect the right construction customers in one guided workflow.</p></div><Button variant="outline" onClick={() => window.print()}><Printer /> Print BIM playbook</Button></section>
      <section className="value-grid">
        <article className="panel assumptions-panel">
          <div className="panel-heading"><div><p className="eyebrow">Play configurator</p><h2>Project readiness</h2></div><span className={readiness >= 70 ? "score strong" : "score"} style={{ "--score": readiness } as CSSProperties}>{readiness}<small>ready</small></span></div>
          <label className="bim-phase-field"><span>Current project phase</span>
            <Select value={phase} onValueChange={choosePlay}>
              <SelectTrigger className="select-control"><SelectValue /></SelectTrigger>
              <SelectContent>{["Concept design", "Design development", "Construction coordination", "Fabrication planning"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent>
            </Select>
          </label>
          <div className="slider-list bim-sliders">
            <ModelSlider label="Model maturity" value={modelMaturity} setValue={setModelMaturity} hint="Quality, structure and coordination status of the federated model" />
            <ModelSlider label="Designer access" value={designerAccess} setValue={setDesignerAccess} hint="Strength of the relationship with the MEP or fire design authority" />
            <ModelSlider label="Contractor readiness" value={contractorReadiness} setValue={setContractorReadiness} hint="BIM, fabrication, procurement and field-team participation" />
          </div>
          <div className="method-note"><ShieldCheck /><p><strong>Why this play.</strong> Victaulic already supports BIM content, Revit workflows, model-based estimating, fabrication and VDC services. Headroom provides the customer connection and project-room layer around those capabilities.</p></div>
          <div className="scenario-actions"><Button onClick={() => setActivated(true)}><Sparkles /> Activate recommended play</Button>{activated && <span className="saved-state"><CheckCircle2 /> Play activated for this session</span>}</div>
        </article>

        <aside className="panel value-result bim-result">
          <p className="eyebrow">Recommended BIM play</p><h2 className="bim-play-title">{play.title}</h2><span className="value-caption">{play.duration}</span>
          <p className="bim-outcome">{play.outcome}</p>
          <div className="value-breakdown">
            {play.outputs.map((output, index) => <div key={output}><span>0{index + 1}</span><b>{output}</b></div>)}
          </div>
          <div className="value-message"><Sparkles /><p>Success measure: connected decision-makers, an agreed model action, and a traceable handoff from BIM coordination to specification or quote.</p></div>
          <div className="reference-links"><a href="https://www.victaulic.com/virtual-design-and-construction/" target="_blank" rel="noreferrer">Victaulic VDC services <ArrowUpRight /></a><a href="https://www.victaulicsoftware.com/tools-for-revit/" target="_blank" rel="noreferrer">Tools for Revit <ArrowUpRight /></a></div>
        </aside>
      </section>

      <section className="panel bim-playbook">
        <div className="panel-heading"><div><p className="eyebrow">Connected BIM motions</p><h2>Three plays across the project lifecycle</h2></div><span className="updated">Select a play to configure</span></div>
        <div className="bim-play-grid">
          {playOptions.map((option) => (
            <button key={option.title} onClick={() => choosePlay(option.phase)} className={play.title === option.title ? "active" : ""}>
              <span>{option.number}</span><small>{option.timing}</small><strong>{option.title}</strong><p>{option.description}</p><i>Configure play <ArrowUpRight /></i>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

function PartnerView() {
  const [region, setRegion] = useState("All regions");
  const [capability, setCapability] = useState("All capabilities");
  const [selectedPartner, setSelectedPartner] = useState(partners[0].name);
  const filtered = partners.filter((item) => (region === "All regions" || item.region === region) && (capability === "All capabilities" || item.capability === capability));
  const current = partners.find((item) => item.name === selectedPartner) ?? filtered[0] ?? partners[0];

  return (
    <div className="content module-content">
      <section className="module-intro"><div><span className="intro-kicker">From coordinated model to installed system</span><p>Connect each project room to the technical distribution, fabrication, installation and field-support capabilities required to complete the customer journey.</p></div><span className="readiness-summary"><b>76%</b> network readiness</span></section>
      <section className="partner-controls panel">
        <Select value={region} onValueChange={setRegion}><SelectTrigger className="filter-select"><SelectValue /></SelectTrigger><SelectContent>{["All regions", "Saudi Arabia", "Nordics", "United Kingdom", "Central Europe", "Australia"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select>
        <Select value={capability} onValueChange={setCapability}><SelectTrigger className="filter-select"><SelectValue /></SelectTrigger><SelectContent>{["All capabilities", "Distribution", "Installation", "VDC", "Specification"].map((item) => <SelectItem value={item} key={item}>{item}</SelectItem>)}</SelectContent></Select>
        <span>{filtered.length} active workstreams</span>
      </section>
      <section className="partner-grid">
        <article className="panel partner-list">
          <div className="partner-head"><span>Delivery connection</span><span>Network readiness</span><span>Status</span></div>
          {filtered.map((item) => (
            <button key={item.name} className={current.name === item.name ? "partner-row selected" : "partner-row"} onClick={() => setSelectedPartner(item.name)}>
              <span><i><PackageCheck /></i><span><strong>{item.name}</strong><small>{item.region} · {item.capability}</small></span></span>
              <span className="partner-score"><i><em style={{ width: item.readiness + "%" }} /></i><b>{item.readiness}%</b></span>
              <span className={"status-pill " + item.status.toLowerCase().replace(" ", "-")}>{item.status}</span>
            </button>
          ))}
          {!filtered.length && <div className="empty-state"><Network /><strong>No matching connections</strong><span>Change one of the network filters.</span></div>}
        </article>
        <aside className="panel partner-detail">
          <p className="eyebrow">Delivery connection</p><h2>{current.name}</h2>
          <div className="readiness-gauge"><span style={{ "--score": current.readiness } as CSSProperties}><b>{current.readiness}%</b><small>readiness</small></span></div>
          <div className="gap-card"><span>Primary connection gap</span><strong>{current.gap}</strong><small>Resolve before the project advances from coordinated model to procurement.</small></div>
          <div className="partner-checklist"><h3>Connection criteria</h3><span className="done"><CheckCircle2 /> Named delivery contact connected</span><span className={current.readiness > 70 ? "done" : ""}><CheckCircle2 /> Technical capability validated</span><span className={current.readiness > 80 ? "done" : ""}><CheckCircle2 /> Model, stock and logistics plan aligned</span><span><CheckCircle2 /> Project-room handoff accepted</span></div>
          <a href="https://www.victaulic.com/where-to-buy/" target="_blank" rel="noreferrer">Review official distributor coverage <ArrowUpRight /></a>
        </aside>
      </section>
    </div>
  );
}
