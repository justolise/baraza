// Topic Detail — study notes + quick-launch buddy/quiz for a specific topic
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import {
  BookOpen,
  Sparkles,
  CheckSquare,
  ChevronRight,
  Tag,
  ArrowLeft,
  Lightbulb,
} from 'lucide-react'
import { retrieveChunks } from '../lib/rag.ts'
import { z } from 'zod'

export const Route = createFileRoute('/app/topics/$slug')({
  loader: async ({ params }) => {
    const chunks = await loadTopicChunks({ data: { slug: params.slug } })
    return { slug: params.slug, chunks }
  },
  component: TopicDetailPage,
})

const loadTopicChunksSchema = z.object({
  slug: z.string().trim().min(1).max(100),
})

// Load content chunks for a topic (server-side)
const loadTopicChunks = createServerFn({ method: 'GET' })
  .validator((d: unknown) => loadTopicChunksSchema.parse(d))
  .handler(async ({ data }) => {
    const chunks = await retrieveChunks('', {
      topicSlug: data.slug,
      topK: 20,
      threshold: 0,
    })
    return chunks.map((c) => ({ id: c.id, title: c.title, body: c.body, topicTitle: c.topicTitle }))
  })

// ── Static topic metadata matching az900-seed.json ───────────────────────────
interface TopicMeta {
  title: string
  summary: string
  analogy: string
  keyTerms: string[]
  domain: string
  domainSlug: string
  color: string
}

const TOPIC_META: Record<string, TopicMeta | undefined> = {
  'shared-responsibility-model': {
    title: 'Shared Responsibility Model',
    summary: 'Defines how security and operational responsibilities are shared between Microsoft and the customer across IaaS, PaaS, and SaaS.',
    analogy: 'Renting an apartment in Nairobi: the landlord secures the compound gate and roof, but locking your own door is your responsibility.',
    keyTerms: ['IaaS', 'PaaS', 'SaaS', 'Customer Responsibility', 'Microsoft Responsibility'],
    domain: 'Describe Cloud Concepts', domainSlug: 'cloud-concepts', color: 'teal',
  },
  'cloud-models-public-private-hybrid': {
    title: 'Cloud Deployment Models',
    summary: 'Public, Private, Hybrid and Multi-Cloud: where infrastructure resides and how access is isolated.',
    analogy: 'Public cloud is the SGR train (shared); Private cloud is a chartered corporate van; Hybrid cloud is driving to the station then boarding the train.',
    keyTerms: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Multi-Cloud', 'Azure Arc'],
    domain: 'Describe Cloud Concepts', domainSlug: 'cloud-concepts', color: 'teal',
  },
  'cloud-benefits-high-availability-fault-tolerance': {
    title: 'High Availability & Fault Tolerance',
    summary: 'SLA uptime guarantees, redundancy strategies, and designing resilient Azure architectures.',
    analogy: 'M-Pesa agent network: if one agent runs out of float, another agent handles the transaction instantly — no downtime for the customer.',
    keyTerms: ['High Availability', 'Fault Tolerance', 'SLA', 'Redundancy', 'Disaster Recovery'],
    domain: 'Describe Cloud Concepts', domainSlug: 'cloud-concepts', color: 'teal',
  },
  'cloud-benefits-scalability-elasticity': {
    title: 'Scalability & Elasticity',
    summary: 'How cloud services scale vertically and horizontally, and auto-scale policies in Azure.',
    analogy: 'A market stall expanding to additional stalls during a busy season, then reducing back to one stall during the quiet period — automatically.',
    keyTerms: ['Scalability', 'Elasticity', 'Vertical Scaling', 'Horizontal Scaling', 'Auto-Scale'],
    domain: 'Describe Cloud Concepts', domainSlug: 'cloud-concepts', color: 'teal',
  },
  'cloud-service-types-iaas-paas-saas': {
    title: 'Cloud Service Models (IaaS / PaaS / SaaS)',
    summary: 'Three abstraction layers of cloud services and who manages what in each.',
    analogy: 'IaaS is leasing an empty plot; PaaS is renting a furnished shop space; SaaS is ordering food from a restaurant — you just eat.',
    keyTerms: ['IaaS', 'PaaS', 'SaaS', 'Management Boundary', 'Azure VM', 'App Service'],
    domain: 'Describe Cloud Concepts', domainSlug: 'cloud-concepts', color: 'teal',
  },
  'cloud-economics-capex-vs-opex': {
    title: 'CapEx vs OpEx & Cloud Economics',
    summary: 'How cloud shifts from upfront capital expenditure to pay-as-you-go operational costs.',
    analogy: 'CapEx is buying a generator outright; OpEx is KPLC prepaid tokens — you only pay for electricity you actually use.',
    keyTerms: ['CapEx', 'OpEx', 'Pay-As-You-Go', 'Consumption Model', 'Economies of Scale'],
    domain: 'Describe Cloud Concepts', domainSlug: 'cloud-concepts', color: 'teal',
  },
  'cloud-benefits-predictability-and-manageability': {
    title: 'Predictability & Manageability',
    summary: 'Cost predictability through consumption pricing and management via Azure tools and automation.',
    analogy: 'A monthly mobile data bundle gives you predictable costs; Azure budgets and alerts do the same for cloud spending.',
    keyTerms: ['Predictability', 'Manageability', 'Azure Budget', 'Cost Alerts', 'Governance'],
    domain: 'Describe Cloud Concepts', domainSlug: 'cloud-concepts', color: 'teal',
  },
  'regions-and-availability-zones': {
    title: 'Regions & Availability Zones',
    summary: 'How Azure organises its global footprint into regions, region pairs, and availability zones.',
    analogy: 'Azure regions are county headquarters; Availability Zones are separate sub-county offices — if one office floods, the others stay open.',
    keyTerms: ['Region', 'Region Pair', 'Availability Zone', 'Data Residency', 'Latency'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'sovereign-regions': {
    title: 'Sovereign Regions',
    summary: 'Azure Government and Azure China: isolated regions for compliance and data sovereignty.',
    analogy: 'Like a secure government-only building with restricted access — only authorised government personnel may enter, separate from public facilities.',
    keyTerms: ['Azure Government', 'Azure China', 'Data Sovereignty', 'Compliance', 'Isolated Region'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'resource-hierarchy-and-management': {
    title: 'Resource Hierarchy & Management',
    summary: 'Management Groups, Subscriptions, Resource Groups, and Resources — plus Azure Resource Manager.',
    analogy: 'National government (Management Group) > County (Subscription) > Department (Resource Group) > Specific project (Resource).',
    keyTerms: ['Management Group', 'Subscription', 'Resource Group', 'ARM', 'Azure Policy'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-virtual-machines-and-scale-sets': {
    title: 'Virtual Machines & Scale Sets',
    summary: 'IaaS compute: Azure VMs, availability sets, and auto-scaling VM Scale Sets for resilient deployments.',
    analogy: 'A VM is like renting an office space fully fitted out; VM Scale Sets automatically open more offices when customer queues grow.',
    keyTerms: ['Virtual Machine', 'VM Scale Set', 'Availability Set', 'IaaS', 'Fault Domain'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-app-services-and-functions': {
    title: 'App Services & Azure Functions',
    summary: 'PaaS web and API hosting with App Service; event-driven serverless compute with Azure Functions.',
    analogy: 'App Service is a coworking space where you focus on your work; Azure Functions is a pay-per-task remote freelancer hired only when needed.',
    keyTerms: ['App Service', 'Azure Functions', 'PaaS', 'Serverless', 'Consumption Plan'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-containers-and-aks': {
    title: 'Containers & AKS',
    summary: 'Azure Container Instances for quick runs; Azure Kubernetes Service (AKS) for orchestrated production workloads.',
    analogy: 'Containers are standardised shipping containers — identical contents, move anywhere. AKS is a port authority managing hundreds of containers efficiently.',
    keyTerms: ['Container', 'Docker', 'ACI', 'AKS', 'Kubernetes', 'Orchestration'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-networking-vnets-subnets': {
    title: 'VNets, Subnets & Peering',
    summary: 'Azure Virtual Networks, subnets, NSGs, VNet peering, and private connectivity between resources.',
    analogy: 'A VNet is a gated residential estate; subnets are individual streets within it; NSGs are the security guards controlling entry per street.',
    keyTerms: ['VNet', 'Subnet', 'NSG', 'VNet Peering', 'Private Endpoint'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-vpn-gateway-and-expressroute': {
    title: 'VPN Gateway & ExpressRoute',
    summary: 'Encrypted VPN tunnels for hybrid connectivity vs private dedicated fibre ExpressRoute links.',
    analogy: 'VPN Gateway is a secure encrypted tunnel through a public road; ExpressRoute is your own private tarmac highway bypassing public traffic entirely.',
    keyTerms: ['VPN Gateway', 'ExpressRoute', 'Site-to-Site VPN', 'Hybrid Connectivity', 'BGP'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-storage-types-and-access-tiers': {
    title: 'Storage Types & Access Tiers',
    summary: 'Blob, File, Queue, Table storage types; Hot, Cool, Cold, and Archive access tiers for cost optimisation.',
    analogy: 'Hot storage is your active desk drawer (instant access); Cool is a filing cabinet nearby; Archive is a warehouse across town (cheap but slow to retrieve).',
    keyTerms: ['Blob Storage', 'Azure Files', 'Hot', 'Cool', 'Archive', 'Storage Account'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-storage-redundancy': {
    title: 'Storage Redundancy (LRS / ZRS / GRS)',
    summary: 'How Azure protects stored data with local, zone, and geo-redundant replication options.',
    analogy: 'LRS is making 3 copies in the same building; ZRS copies across 3 buildings in a city; GRS replicates to a city hundreds of kilometres away.',
    keyTerms: ['LRS', 'ZRS', 'GRS', 'GZRS', 'RA-GRS', 'Replication'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-database-services': {
    title: 'Database Services',
    summary: 'Azure SQL Database, Cosmos DB, Azure Database for MySQL/PostgreSQL — managed options on Azure.',
    analogy: 'Azure SQL is a well-organised filing cabinet with strict folders; Cosmos DB is a flexible market stall that stores any type of goods in any format.',
    keyTerms: ['Azure SQL', 'Cosmos DB', 'MySQL', 'PostgreSQL', 'NoSQL', 'Managed Database'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-virtual-desktop': {
    title: 'Azure Virtual Desktop',
    summary: 'Desktop-as-a-Service: virtualised Windows desktops and apps streamed from the cloud to any device.',
    analogy: 'Like accessing a fully equipped office computer from your phone via remote access — your desktop and apps are in the cloud, your device is just the screen.',
    keyTerms: ['AVD', 'Virtual Desktop', 'DaaS', 'Remote Desktop', 'Windows 10/11 Multi-session'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-migration-tools-migrate-databox': {
    title: 'Migration Tools & Azure Data Box',
    summary: 'Azure Migrate for workload assessment and migration; Azure Data Box for offline large-data transfers.',
    analogy: 'Azure Migrate is a professional moving company that assesses and plans your relocation; Data Box is a physical lorry that physically drives your data to Azure.',
    keyTerms: ['Azure Migrate', 'Data Box', 'Migration Assessment', 'Database Migration Service'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'azure-storage-security-and-tooling': {
    title: 'Storage Security & Tooling',
    summary: 'Shared Access Signatures (SAS), AzCopy, Azure Storage Explorer, and encryption at rest.',
    analogy: 'A SAS token is like a dated visitor badge for a secure building — grants temporary, limited access without sharing the master key.',
    keyTerms: ['SAS Token', 'AzCopy', 'Storage Explorer', 'Encryption at Rest', 'Access Keys'],
    domain: 'Describe Azure Architecture & Services', domainSlug: 'azure-architecture', color: 'amber',
  },
  'pricing-calculator-and-tco': {
    title: 'Pricing & TCO Calculator',
    summary: 'Estimate Azure costs per service with the Pricing Calculator; compare cloud vs on-premises costs with the TCO Calculator.',
    analogy: 'The Pricing Calculator is like asking a contractor for a quote per item; the TCO Calculator is like comparing buying vs renting a house over 10 years.',
    keyTerms: ['Pricing Calculator', 'TCO Calculator', 'Cost Estimation', 'Total Cost of Ownership'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'cost-management-and-budgets': {
    title: 'Cost Management & Budgets',
    summary: 'Azure Cost Management dashboards, budget alerts, and cost-saving strategies like reservations and spot VMs.',
    analogy: 'Azure Cost Management is like M-Pesa statement monitoring — see every shilling spent, set spending limits, and get alerts before overspending.',
    keyTerms: ['Cost Management', 'Budget', 'Alerts', 'Reservations', 'Spot VMs', 'Tags'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'identity-and-entra-id': {
    title: 'Identity & Microsoft Entra ID',
    summary: 'Microsoft Entra ID (formerly Azure Active Directory): SSO, directory services, and identity federation.',
    analogy: 'Entra ID is the security desk receptionist of a corporate building — checks ID badges and decides which floors you can access.',
    keyTerms: ['Entra ID', 'Azure AD', 'SSO', 'Directory Service', 'Identity Federation'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'multi-factor-authentication-and-conditional-access': {
    title: 'MFA & Conditional Access',
    summary: 'Multi-factor authentication, Conditional Access policies, and Zero Trust security principles.',
    analogy: 'MFA is like using your ATM card plus a PIN — one factor stolen alone is not enough to withdraw money.',
    keyTerms: ['MFA', 'Conditional Access', 'Zero Trust', 'Passwordless', 'Security Defaults'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'azure-rbac': {
    title: 'Role-Based Access Control (RBAC)',
    summary: 'Owner, Contributor, Reader built-in roles; custom roles; scope-based assignments; least privilege principle.',
    analogy: 'Hospital access control: nurses access wards, pharmacists access the dispensary, administrators access billing — each role sees only what they need.',
    keyTerms: ['Owner', 'Contributor', 'Reader', 'Custom Role', 'Scope', 'Least Privilege'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'azure-policy-and-resource-locks': {
    title: 'Azure Policy & Resource Locks',
    summary: 'Policy definitions, initiatives, compliance auditing, and Read-Only/Delete locks to prevent accidental changes.',
    analogy: 'Azure Policy is a county planning authority enforcing building codes — it auto-flags or blocks non-compliant constructions.',
    keyTerms: ['Azure Policy', 'Initiative', 'Compliance', 'Read-Only Lock', 'Delete Lock'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'azure-monitor-and-service-health': {
    title: 'Azure Monitor & Service Health',
    summary: 'Metrics, Log Analytics, Application Insights, alert rules, dashboards, and Azure Service Health status.',
    analogy: 'Azure Monitor is the CCTV control room for your cloud — watch all cameras (metrics), review archives (logs), and trigger alarms (alerts).',
    keyTerms: ['Azure Monitor', 'Log Analytics', 'Application Insights', 'Alerts', 'Service Health'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'azure-management-tools-and-arm': {
    title: 'Management Tools & ARM',
    summary: 'Azure Portal, CLI, PowerShell, ARM templates, Bicep, Cloud Shell — tools to manage Azure resources.',
    analogy: 'Azure Portal is the physical bank branch; Azure CLI/PowerShell is internet banking; ARM templates are pre-filled bulk transaction forms.',
    keyTerms: ['Azure Portal', 'Azure CLI', 'PowerShell', 'ARM Templates', 'Bicep', 'Cloud Shell'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'compliance-purview-and-trust': {
    title: 'Compliance, Purview & Trust',
    summary: 'Microsoft Purview compliance tools, Compliance Manager, Trust Center, and major regulatory standards.',
    analogy: 'Microsoft compliance certifications are like ISO quality certificates — they prove to regulators and customers that data is handled responsibly.',
    keyTerms: ['Purview', 'Compliance Manager', 'Trust Center', 'GDPR', 'ISO 27001', 'Sovereign Cloud'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
  'azure-advisor-recommendations': {
    title: 'Azure Advisor',
    summary: 'AI-powered best-practice recommendations across reliability, security, cost, performance, and operational excellence.',
    analogy: 'Azure Advisor is like a personal financial advisor who reviews your accounts and says: "You are spending too much here, and this investment is risky — here is what to do."',
    keyTerms: ['Azure Advisor', 'Reliability', 'Security Score', 'Cost Recommendations', 'Performance'],
    domain: 'Describe Azure Management & Governance', domainSlug: 'azure-management', color: 'indigo',
  },
}

const colorMap: Record<string, { badge: string; bg: string; text: string; border: string }> = {
  teal: { badge: 'bg-teal-700 text-white', bg: 'bg-teal-50 dark:bg-teal-950/40', text: 'text-teal-700 dark:text-teal-400', border: 'border-teal-200 dark:border-teal-800' },
  amber: { badge: 'bg-amber-600 text-white', bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-800' },
  indigo: { badge: 'bg-indigo-700 text-white', bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-400', border: 'border-indigo-200 dark:border-indigo-800' },
}

function TopicDetailPage() {
  const { slug, chunks } = Route.useLoaderData()
  const navigate = useNavigate()

  const meta = TOPIC_META[slug]

  if (!meta) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <BookOpen className="mb-4 h-12 w-12 text-[var(--text-muted)]" />
        <h1 className="text-xl font-bold text-[var(--text-main)]">Topic not found</h1>
        <p className="mt-2 text-sm text-[var(--text-muted)]">The topic &ldquo;{slug}&rdquo; does not exist in the catalog.</p>
        <Link to="/app/topics" className="mt-4 text-sm font-semibold text-teal-700 dark:text-teal-400 hover:underline">
          Back to catalog
        </Link>
      </div>
    )
  }

  const c = colorMap[meta.color] ?? colorMap['teal']

  return (
    <div className="mx-auto max-w-3xl space-y-7">
      {/* Back */}
      <Link
        to="/app/topics"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Topic Catalog
      </Link>

      {/* Topic header */}
      <div className={`rounded-2xl border p-6 ${c.border} ${c.bg}`}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className={`rounded-lg px-2.5 py-1 text-xs font-bold ${c.badge}`}>{meta.domain}</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-[var(--text-main)]">{meta.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{meta.summary}</p>

        {/* African Analogy */}
        <div className="mt-4 flex gap-2.5 rounded-xl bg-amber-50 p-4 dark:bg-amber-950/50">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              African Analogy
            </p>
            <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-100">{meta.analogy}</p>
          </div>
        </div>

        {/* Key Terms */}
        {meta.keyTerms.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Tag className={`h-4 w-4 ${c.text}`} />
            {meta.keyTerms.map((term) => (
              <span
                key={term}
                className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${c.border} ${c.text} bg-white dark:bg-[var(--bg-surface)]`}
              >
                {term}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Study Notes (chunks) */}
      {chunks.length > 0 && (
        <section className="space-y-4">
          <h2 className="font-display text-lg font-bold text-[var(--text-main)]">Study Notes</h2>
          {chunks.map((chunk) => (
            <div key={chunk.id} className="card-glass p-5">
              <h3 className="mb-2 text-sm font-bold text-[var(--text-main)]">{chunk.title}</h3>
              <p className="text-sm leading-relaxed text-[var(--text-muted)] whitespace-pre-wrap">{chunk.body}</p>
            </div>
          ))}
        </section>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/app/buddy"
          className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition hover:border-teal-400"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white">
              <Sparkles className="h-5 w-5 text-amber-300" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-main)]">Ask Buddy Baraza</p>
              <p className="text-xs text-[var(--text-muted)]">Get AI explanations about {meta.title}</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
        </Link>

        <button
          onClick={() => void navigate({ to: '/app/quiz', search: { topic: slug } })}
          className="flex items-center justify-between rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 transition hover:border-amber-400"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white">
              <CheckSquare className="h-5 w-5 text-amber-100" />
            </div>
            <div>
              <p className="text-sm font-bold text-[var(--text-main)]">Practice Quiz</p>
              <p className="text-xs text-[var(--text-muted)]">Test your knowledge on this topic</p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-[var(--text-muted)]" />
        </button>
      </div>
    </div>
  )
}
