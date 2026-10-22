// Topics Catalog — browse all AZ-900 topics grouped by domain
import { createFileRoute, Link } from '@tanstack/react-router'
import { BookOpen, ChevronRight, Search } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/app/topics/')({
  component: TopicsPage,
})

// ── Static topic data matching az900-seed.json slugs ────────────────────────
const DOMAINS = [
  {
    slug: 'cloud-concepts',
    title: 'Describe Cloud Concepts',
    weight: 28,
    color: 'teal',
    topics: [
      { slug: 'shared-responsibility-model', title: 'Shared Responsibility Model', summary: 'Defines how security and operational responsibilities are shared between Microsoft and the customer across IaaS, PaaS, and SaaS.' },
      { slug: 'cloud-models-public-private-hybrid', title: 'Cloud Deployment Models', summary: 'Public, Private, Hybrid and Multi-Cloud: where infrastructure resides and how access is isolated.' },
      { slug: 'cloud-benefits-high-availability-fault-tolerance', title: 'High Availability & Fault Tolerance', summary: 'SLA uptime guarantees, redundancy strategies, and designing resilient Azure architectures.' },
      { slug: 'cloud-benefits-scalability-elasticity', title: 'Scalability & Elasticity', summary: 'How cloud services scale vertically and horizontally, and auto-scale policies.' },
      { slug: 'cloud-service-types-iaas-paas-saas', title: 'Cloud Service Models (IaaS / PaaS / SaaS)', summary: 'Three abstraction layers of cloud services and who manages what in each.' },
      { slug: 'cloud-economics-capex-vs-opex', title: 'CapEx vs OpEx & Cloud Economics', summary: 'How cloud shifts from upfront capital expenditure to pay-as-you-go operational costs.' },
      { slug: 'cloud-benefits-predictability-and-manageability', title: 'Predictability & Manageability', summary: 'Cost predictability through consumption pricing and management via Azure tools.' },
    ],
  },
  {
    slug: 'azure-architecture',
    title: 'Describe Azure Architecture & Services',
    weight: 35,
    color: 'amber',
    topics: [
      { slug: 'regions-and-availability-zones', title: 'Regions & Availability Zones', summary: 'How Azure organises its global physical footprint into regions, pairs, and availability zones.' },
      { slug: 'sovereign-regions', title: 'Sovereign Regions', summary: 'Azure Government and Azure China: isolated regions for compliance and data sovereignty.' },
      { slug: 'resource-hierarchy-and-management', title: 'Resource Hierarchy & Management', summary: 'Management Groups → Subscriptions → Resource Groups → Resources and ARM.' },
      { slug: 'azure-virtual-machines-and-scale-sets', title: 'Virtual Machines & Scale Sets', summary: 'IaaS compute with VMs, availability sets, and auto-scaling VM Scale Sets.' },
      { slug: 'azure-app-services-and-functions', title: 'App Services & Azure Functions', summary: 'PaaS web hosting and serverless event-driven compute models.' },
      { slug: 'azure-containers-and-aks', title: 'Containers & AKS', summary: 'Azure Container Instances, Azure Kubernetes Service, and containerisation benefits.' },
      { slug: 'azure-networking-vnets-subnets', title: 'VNets, Subnets & Peering', summary: 'Azure Virtual Networks, subnets, NSGs, VNet peering, and private connectivity.' },
      { slug: 'azure-vpn-gateway-and-expressroute', title: 'VPN Gateway & ExpressRoute', summary: 'Encrypted VPN tunnels vs private dedicated fibre links for hybrid connectivity.' },
      { slug: 'azure-storage-types-and-access-tiers', title: 'Storage Types & Access Tiers', summary: 'Blob, File, Queue, Table storage and Hot/Cool/Archive access tiers.' },
      { slug: 'azure-storage-redundancy', title: 'Storage Redundancy (LRS / ZRS / GRS)', summary: 'How Azure protects stored data with local, zone, and geo-redundant replication.' },
      { slug: 'azure-database-services', title: 'Database Services', summary: 'Azure SQL, Cosmos DB, MySQL, PostgreSQL — managed database options on Azure.' },
      { slug: 'azure-virtual-desktop', title: 'Azure Virtual Desktop', summary: 'Desktop-as-a-Service: virtualised Windows desktops and apps from the cloud.' },
      { slug: 'azure-migration-tools-migrate-databox', title: 'Migration Tools & Azure Data Box', summary: 'Azure Migrate, Azure Database Migration Service, and offline Data Box transfers.' },
      { slug: 'azure-storage-security-and-tooling', title: 'Storage Security & Tooling', summary: 'Shared Access Signatures, AzCopy, Storage Explorer, and encryption at rest.' },
    ],
  },
  {
    slug: 'azure-management',
    title: 'Describe Azure Management & Governance',
    weight: 30,
    color: 'indigo',
    topics: [
      { slug: 'pricing-calculator-and-tco', title: 'Pricing & TCO Calculator', summary: 'Estimate Azure costs and compare on-premises vs cloud total cost of ownership.' },
      { slug: 'cost-management-and-budgets', title: 'Cost Management & Budgets', summary: 'Azure Cost Management, budgets, alerts, and cost-saving strategies.' },
      { slug: 'identity-and-entra-id', title: 'Identity & Microsoft Entra ID', summary: 'Entra ID (formerly AAD), SSO, directory services, and identity federation.' },
      { slug: 'multi-factor-authentication-and-conditional-access', title: 'MFA & Conditional Access', summary: 'Multi-factor authentication, Conditional Access policies, and Zero Trust principles.' },
      { slug: 'azure-rbac', title: 'Role-Based Access Control (RBAC)', summary: 'Owner, Contributor, Reader roles; custom roles; scope assignments; least privilege.' },
      { slug: 'azure-policy-and-resource-locks', title: 'Azure Policy & Resource Locks', summary: 'Policy definitions, initiatives, compliance auditing, and Read-Only/Delete locks.' },
      { slug: 'azure-monitor-and-service-health', title: 'Azure Monitor & Service Health', summary: 'Metrics, Log Analytics, Application Insights, alerts, and Azure Service Health.' },
      { slug: 'azure-management-tools-and-arm', title: 'Management Tools & ARM', summary: 'Azure Portal, CLI, PowerShell, ARM templates, Bicep, and Cloud Shell.' },
      { slug: 'compliance-purview-and-trust', title: 'Compliance, Purview & Trust', summary: 'Microsoft Purview, Compliance Manager, Trust Center, and regulatory standards.' },
      { slug: 'azure-advisor-recommendations', title: 'Azure Advisor', summary: 'AI-powered best-practice recommendations across reliability, security, cost, and performance.' },
    ],
  },
]

const colorMap: Record<string, { border: string; bg: string; badge: string; text: string; ring: string }> = {
  teal: {
    border: 'border-teal-200 dark:border-teal-800',
    bg: 'bg-teal-50 dark:bg-teal-950/40',
    badge: 'bg-teal-700 text-white',
    text: 'text-teal-700 dark:text-teal-400',
    ring: 'hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/60',
  },
  amber: {
    border: 'border-amber-200 dark:border-amber-800',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    badge: 'bg-amber-600 text-white',
    text: 'text-amber-700 dark:text-amber-400',
    ring: 'hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60',
  },
  indigo: {
    border: 'border-indigo-200 dark:border-indigo-800',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    badge: 'bg-indigo-700 text-white',
    text: 'text-indigo-700 dark:text-indigo-400',
    ring: 'hover:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/60',
  },
}

export { DOMAINS }

function TopicsPage() {
  const [query, setQuery] = useState('')
  const q = query.toLowerCase()

  const filtered = DOMAINS.map((domain) => ({
    ...domain,
    topics: domain.topics.filter(
      (t) =>
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.summary.toLowerCase().includes(q)
    ),
  })).filter((d) => d.topics.length > 0)

  const totalTopics = DOMAINS.reduce((a, d) => a + d.topics.length, 0)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow">
            <BookOpen className="h-5 w-5 text-teal-200" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">
              AZ-900 Topic Catalog
            </h1>
            <p className="text-xs text-[var(--text-muted)]">
              {totalTopics} topics across 3 exam domains &middot; Click a topic to study
            </p>
          </div>
        </div>
        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            id="topic-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search topics&hellip;"
            className="w-full rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] py-2 pl-9 pr-3 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* Domain Groups */}
      {filtered.length === 0 ? (
        <div className="card-glass flex flex-col items-center py-12 text-center">
          <Search className="mb-3 h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm font-semibold text-[var(--text-main)]">No topics match &ldquo;{query}&rdquo;</p>
          <p className="mt-1 text-xs text-[var(--text-muted)]">Try a different keyword</p>
        </div>
      ) : (
        filtered.map((domain) => {
          const c = colorMap[domain.color]
          return (
            <section key={domain.slug}>
              <div className={`mb-3 flex items-center gap-3 rounded-xl border px-4 py-3 ${c.border} ${c.bg}`}>
                <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${c.badge}`}>
                  {domain.weight}%
                </span>
                <h2 className={`font-display text-base font-bold ${c.text}`}>{domain.title}</h2>
                <span className="ml-auto text-xs text-[var(--text-muted)]">
                  {domain.topics.length} topics
                </span>
              </div>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {domain.topics.map((topic) => (
                  <Link
                    key={topic.slug}
                    to="/app/topics/$slug"
                    params={{ slug: topic.slug }}
                    className={`flex items-start justify-between gap-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 transition ${c.ring}`}
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[var(--text-main)] leading-snug">
                        {topic.title}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)] line-clamp-2">
                        {topic.summary}
                      </p>
                    </div>
                    <ChevronRight className={`mt-0.5 h-4 w-4 shrink-0 ${c.text}`} />
                  </Link>
                ))}
              </div>
            </section>
          )
        })
      )}
    </div>
  )
}
