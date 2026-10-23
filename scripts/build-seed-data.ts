import fs from 'node:fs'
import path from 'node:path'

interface Chunk {
  title: string
  body: string
  source_note: string
}

interface Topic {
  slug: string
  title: string
  summary: string
  key_terms: string[]
  analogy: string
  sort: number
  chunks: Chunk[]
}

interface Domain {
  slug: string
  title: string
  weight_pct: number
  sort: number
  topics: Topic[]
}

const domains: Domain[] = [
  {
    slug: 'cloud-concepts',
    title: 'Describe Cloud Concepts',
    weight_pct: 28,
    sort: 1,
    topics: [
      {
        slug: 'shared-responsibility-model',
        title: 'Shared Responsibility Model',
        summary: 'Defines how security and operational responsibilities are shared between Microsoft and the customer across on-premises, IaaS, PaaS, and SaaS.',
        key_terms: ['Shared Responsibility', 'IaaS', 'PaaS', 'SaaS', 'Information & Data Protection'],
        analogy: 'Renting a residential apartment in Nairobi: the landlord secures the compound perimeter gate and roof, but locking your apartment front door and guarding your personal belongings is entirely your responsibility.',
        sort: 1,
        chunks: [
          {
            title: 'Division of Responsibilities in Cloud Computing',
            body: 'The Shared Responsibility Model clearly demarcates which operational, maintenance, and security duties belong to the cloud provider (Microsoft) and which belong to the customer. In traditional on-premises data centers, the customer retains 100% of the responsibility, from physical building security and electrical cooling to server hardware, virtualization, operating systems, and data classification. When migrating to the Azure cloud, Microsoft always assumes responsibility for physical data centers, physical servers, and physical network infrastructure. In contrast, the customer always retains full responsibility for their information assets, data classification, user identities, client endpoints, and access credentials regardless of cloud service model. For intermediate layers like the operating system, network configuration, and middleware, responsibility shifts based on whether you choose IaaS, PaaS, or SaaS. In IaaS, you patch the OS and configure firewalls; in PaaS, Microsoft patches the OS while you write code; in SaaS, Microsoft manages everything up to the application layer. Common confusion: Many learners assume Microsoft backs up and secures your confidential database records automatically. In reality, data protection and identity access permissions are strictly the customer’s responsibility under all cloud models.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Shared Responsibility Across Service Models',
            body: 'Exam questions on the AZ-900 frequently test who is responsible for specific components across IaaS, PaaS, and SaaS. In Infrastructure as a Service (IaaS), such as Azure Virtual Machines, Microsoft manages physical hosts, physical network cables, and datacenter climate control. The customer is responsible for installing, configuring, and patching the guest operating system, network routing rules, antivirus software, and application runtimes. In Platform as a Service (PaaS), such as Azure App Service or Azure SQL Database, Microsoft manages the operating system, hardware scaling, and database patching. The customer only manages the application code, database schema, and user access. In Software as a Service (SaaS), such as Microsoft 365, Microsoft manages the entire technology stack from hardware to application software. The customer is only responsible for configuring user accounts, access permissions, and data. African analogy: In IaaS, you lease an empty commercial truck: you must buy fuel, service brakes, hire the driver, and navigate. In PaaS, you rent a fully equipped restaurant kitchen: the building, stoves, gas, and refrigeration are maintained by the owner, but you bring your own ingredients, cook your custom recipes, and serve your customers. In SaaS, you board a commercial Kenya Airways flight: airline pilots and ground crews manage the entire aircraft and journey, while you simply take your assigned seat.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'cloud-models-public-private-hybrid',
        title: 'Cloud Deployment Models: Public, Private, Hybrid & Multi-Cloud',
        summary: 'Cloud models describe where infrastructure resides and how access is isolated: Public, Private, Hybrid, and Multi-cloud.',
        key_terms: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'Multi-Cloud', 'Azure Arc'],
        analogy: 'Public cloud is riding the public SGR passenger train with shared infrastructure; Private cloud is owning and operating a dedicated corporate shuttle fleet; Hybrid cloud is running your private corporate delivery vans while seamlessly integrating with the national freight railway via a dedicated loading depot.',
        sort: 2,
        chunks: [
          {
            title: 'Comparing Public, Private, and Hybrid Cloud Architectures',
            body: 'A Public Cloud is owned and operated by a third-party cloud service provider like Microsoft Azure. Computing, storage, and networking resources are delivered over the public internet and shared among multiple tenant organizations through secure logical isolation boundaries. Public clouds offer zero hardware maintenance, unlimited scalability, and pay-as-you-go pricing. A Private Cloud consists of computing resources used exclusively by one single business or organization. It can be physically located in the company’s on-premises data center or hosted by a third-party service provider with dedicated private networking. Private clouds offer complete architectural control and meet strict data sovereignty regulations, but require substantial capital investment. A Hybrid Cloud combines public and private clouds by binding them with technology that allows data and applications to be shared between them. Organizations frequently use hybrid clouds to run latency-sensitive or legally regulated banking ledgers on-premises while hosting public customer-facing web apps in Azure. Common confusion: A hybrid cloud is not simply having two cloud accounts; it requires an active, interconnected integration between private on-premises infrastructure and a public cloud.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Multi-Cloud Strategies and Hybrid Management',
            body: 'A Multi-Cloud model describes an architectural strategy where an organization uses services from two or more independent public cloud providers (such as Microsoft Azure alongside Amazon Web Services or Google Cloud Platform). Companies choose multi-cloud to prevent vendor lock-in, leverage specialized niche services from different vendors, and comply with international financial risk regulations that mandate multi-provider redundancy. However, multi-cloud introduces operational complexity, requiring IT teams to master multiple management portals, security frameworks, and billing models. To simplify hybrid and multi-cloud management, Microsoft offers Azure Arc, a governance platform that extends Azure Resource Manager controls, Azure Policy, and monitoring tools to servers and Kubernetes clusters running in on-premises datacenters or other public clouds. Common confusion: AZ-900 tests whether you understand that multi-cloud uses multiple distinct public clouds, whereas hybrid cloud bridges private (on-premises) and public cloud environments. African analogy: Multi-cloud is running separate bank accounts with both Equity Bank and KCB to hedge operational risks; hybrid cloud is keeping cash in your local SACCO safe while linking it to a mobile banking app.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'cloud-benefits-high-availability-fault-tolerance',
        title: 'High Availability, Fault Tolerance & Disaster Recovery',
        summary: 'Core operational benefits ensuring cloud workloads remain accessible, resilient against failures, and recoverable after catastrophic incidents.',
        key_terms: ['High Availability (HA)', 'Fault Tolerance', 'Disaster Recovery (DR)', 'SLA', 'Uptime'],
        analogy: 'Nairobi hospital power: High availability is having dual power lines from the national grid; Fault tolerance is an automatic uninterruptible battery power supply (UPS) that kicks in with zero microsecond flicker; Disaster recovery is having an offsite backup clinic in Nakuru if an earthquake damages the main hospital.',
        sort: 3,
        chunks: [
          {
            title: 'High Availability and Service Level Agreements (SLAs)',
            body: 'High Availability (HA) is the capability of a cloud system to remain operational, reachable, and accessible to users for a very high percentage of time, minimizing unplanned downtime. In Azure, high availability is formally measured and guaranteed through Service Level Agreements (SLAs). SLAs represent Microsoft’s contractual commitments regarding service uptime and connectivity. Typical Azure SLAs range from 99.9% (approx. 8.76 hours of downtime per year) to 99.99% (approx. 52.6 minutes of downtime per year). Azure achieves high availability through redundant components, clustering, and deploying resources across separate Availability Zones. If an individual server hardware blade or network switch fails, redundant infrastructure automatically routes traffic to healthy systems. Common confusion: High availability does not mean 100% uptime is guaranteed; cloud providers never offer a 100% SLA because scheduled maintenance and unexpected extreme failures can occur.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Fault Tolerance vs. Disaster Recovery',
            body: 'Fault Tolerance is the ability of an infrastructure or application to continue functioning smoothly without interruption even when an individual hardware or software component fails completely. For example, using dual power supplies in a server or mirrored storage disks (RAID) provides fault tolerance: if one drive fails, the server continues running with zero downtime. Disaster Recovery (DR), by contrast, is the structured process of recovering and restoring mission-critical business operations, data, and applications following a major catastrophic event (such as a regional power grid blackout, fire, hurricane, or severe fiber cut). While fault tolerance prevents micro-interruptions during minor hardware glitches, disaster recovery restores entire environments in a secondary geographic region after total primary failure. Common confusion: Fault tolerance protects against single component failures in real time; disaster recovery is an emergency response plan to rebuild in an alternative location after catastrophic destruction. African analogy: Fault tolerance is a dual-SIM phone that switches automatically if one telco drops signal; disaster recovery is having a second fully charged phone safely kept at home.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'cloud-benefits-scalability-elasticity',
        title: 'Scalability, Elasticity & Business Agility',
        summary: 'Cloud elasticity and scalability allow applications to dynamically adapt computing resources to meet shifting demand, while agility accelerates deployment.',
        key_terms: ['Vertical Scaling (Scale Up)', 'Horizontal Scaling (Scale Out)', 'Elasticity', 'Agility', 'Auto-scaling'],
        analogy: 'Matatu transport operations: Vertical scaling is replacing a 14-seater van with a 60-passenger bus. Horizontal scaling is adding three extra 14-seater vans to the route. Elasticity is automatically adding those vans at 6 PM rush hour and sending them home when commuters disappear at 10 PM.',
        sort: 4,
        chunks: [
          {
            title: 'Vertical Scaling vs. Horizontal Scaling',
            body: 'Scalability is the measure of a system’s ability to increase or decrease computing capacity to handle changing workloads. Azure supports two distinct scaling strategies: Vertical Scaling (scaling up or down) and Horizontal Scaling (scaling out or in). Vertical scaling involves modifying the configuration of an existing virtual machine by adding more CPU cores, RAM, or faster disk storage (scaling up), or reducing them (scaling down). Vertical scaling is constrained by physical hardware maximums and typically requires a brief virtual machine restart. Horizontal scaling involves adding or removing multiple identical instances of virtual machines or container pods behind a load balancer (scaling out or scaling in). Horizontal scaling provides virtually limitless expansion without service interruption, as new instances handle incoming traffic in parallel. Common confusion: AZ-900 questions frequently test whether scaling out means adding more machines (horizontal) or increasing CPU size (vertical). Remember: out = more instances, up = bigger size.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Elasticity, Predictability, and Agility in Azure',
            body: 'Elasticity is the automated ability of cloud infrastructure to dynamically provision and de-provision computing resources in direct response to real-time workload fluctuations. While scalability describes the capacity to grow, elasticity describes the automatic, reactive nature of that growth. For example, Azure Virtual Machine Scale Sets can automatically add 10 new VM instances during a flash sale and terminate them when web traffic returns to normal, ensuring you never pay for idle computing capacity. Agility is the rapid speed with which IT teams can provision, configure, test, and deploy new applications in the cloud—measured in minutes rather than months required for procurement of on-premises hardware. Predictability refers to confidence in both performance (consistent latency) and cost (transparent billing metrics). African analogy: Elasticity is a roadside food stall making 100 extra plates of samosas only when the Kenya Premier League match crowd pours out of the stadium, avoiding food wastage when the street is quiet.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'cloud-service-types-iaas-paas-saas',
        title: 'Cloud Service Types: IaaS, PaaS & SaaS',
        summary: 'The three primary cloud service types deliver varying degrees of customer control versus managed provider automation.',
        key_terms: ['IaaS', 'PaaS', 'SaaS', 'Azure App Service', 'Microsoft 365'],
        analogy: 'Pizza as a Service: IaaS is renting a commercial pizza oven and kitchen space where you supply the dough, sauce, toppings, and baking time; PaaS is ordering pizza delivery where the restaurant prepares and bakes the pizza, and you provide the dining table and drinks; SaaS is dining out at a restaurant where everything from cooking to dishwashing is handled for you.',
        sort: 5,
        chunks: [
          {
            title: 'Infrastructure as a Service (IaaS) and Platform as a Service (PaaS)',
            body: 'Infrastructure as a Service (IaaS) provides virtualized computing resources over the internet, mimicking the functionality of physical hardware. The provider manages virtualization, servers, storage, and physical networking. The customer configures operating systems, network firewalls, runtime environments, and applications. IaaS offers maximum architectural flexibility and is ideal for migrating existing legacy workloads (lift-and-shift) with minimal modifications. Azure Virtual Machines and Azure Virtual Networks are archetypal IaaS offerings. Platform as a Service (PaaS) provides a managed environment for building, testing, and deploying cloud applications without the administrative burden of operating system management, security patching, or hardware capacity planning. Azure App Service and Azure SQL Database are examples of PaaS. In PaaS, developers focus entirely on application logic and database queries, while Azure handles runtime updates and auto-scaling. Common confusion: You cannot configure or log into the underlying Windows or Linux OS in a PaaS service like Azure App Service; that layer is fully managed by Microsoft.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Software as a Service (SaaS) and Serverless Computing',
            body: 'Software as a Service (SaaS) delivers complete, centrally hosted end-user software applications accessed through web browsers, desktop clients, or mobile apps. The cloud vendor manages all infrastructure, operating systems, data security, middleware, and application code. The customer only manages user accounts, organizational settings, and access permissions. Prominent examples of SaaS include Microsoft 365, Microsoft Teams, and OneDrive. Serverless computing is an evolution of PaaS where developer code executes strictly in response to events (event-driven architecture). With serverless platforms like Azure Functions, servers are completely abstracted away from the developer, and billing is calculated down to execution time in fractions of a second and memory consumption. When the function finishes execution, computing resources drop to zero, incurring zero cost while idle. Common confusion: SaaS delivers ready-to-use software applications to end-users, whereas PaaS delivers development platforms to programmers.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'cloud-economics-capex-vs-opex',
        title: 'CapEx vs. OpEx & Consumption-Based Pricing',
        summary: 'Cloud financial economics shift IT expenditures from large upfront capital investments (CapEx) to agile, recurring operational expenses (OpEx).',
        key_terms: ['CapEx', 'OpEx', 'Consumption-Based Model', 'Total Cost of Ownership', 'Depreciation'],
        analogy: 'Purchasing an electricity generator versus buying prepaid KPLC tokens: CapEx is spending 500,000 shillings upfront to buy a diesel generator and fuel tanks; OpEx is buying 2,000 shillings of prepaid KPLC power tokens each week, paying only for the units you actually consume.',
        sort: 6,
        chunks: [
          {
            title: 'Capital Expenditure (CapEx) vs. Operational Expenditure (OpEx)',
            body: 'Capital Expenditure (CapEx) is the upfront financial investment in physical assets, such as purchasing server hardware, network switches, backup generators, datacenter real estate, and cooling systems. CapEx costs have high upfront financial barriers, require long procurement cycles, and are depreciated over multiple financial years on corporate balance sheets. In contrast, Operational Expenditure (OpEx) is spending money on ongoing business operations, consumables, and subscription services on a recurring basis with zero upfront hardware investment. Cloud computing shifts organizational spending almost entirely from CapEx to OpEx. With OpEx, organizations can immediately deploy enterprise infrastructure without bank loans or capital budgeting delays. Furthermore, operational expenses can be fully deducted on company tax statements in the same billing year they occur. Common confusion: CapEx provides asset ownership but low business flexibility; OpEx provides maximum agility and aligns IT expenses directly with actual business revenue fluctuations.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'The Consumption-Based Pricing Model',
            body: 'Azure operates on a consumption-based pricing model, commonly known as pay-as-you-go. In this economic model, customers are billed only for the computing capacity, storage volume, and network egress bandwidth that they actively consume during a billing period. If you spin up a powerful GPU virtual machine for 3 hours to train a machine learning model and then deallocate it, you pay strictly for those 3 hours of compute time. When an Azure Function is not running, compute costs are exactly zero. Benefits of consumption-based pricing include: no upfront infrastructure fees, no costs associated with procuring hardware for unused peak capacity, and the freedom to terminate unwanted resources instantly. Common confusion: Stopping a Virtual Machine in the Azure Portal does not halt compute charges unless the VM is completely deallocated (status shows Stopped (Deallocated)). Even when deallocated, attached storage disks and static IP addresses continue to incur storage fees.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'cloud-benefits-predictability-and-manageability',
        title: 'Cloud Benefits: Predictability, Governance & Manageability',
        summary: 'Cloud management benefits including performance predictability, cost forecasting, automated provisioning, and centralized governance.',
        key_terms: ['Performance Predictability', 'Cost Predictability', 'Manageability in the Cloud', 'Automated Deployment'],
        analogy: 'Water supply management: Performance predictability is turning on the tap and having clean pressurized water flow every single time at guaranteed litres per minute; Cost predictability is having a calibrated water meter with no surprises on your monthly bill.',
        sort: 7,
        chunks: [
          {
            title: 'Performance and Cost Predictability in Azure',
            body: 'Predictability in cloud computing operates across two distinct dimensions: performance predictability and cost predictability. Performance predictability ensures that workloads receive consistent computing power, storage throughput, and network latency regardless of background multi-tenant activities. Azure guarantees performance predictability through dedicated resource tiers, SLA commitments, and isolated compute instances. Cost predictability enables organizations to accurately anticipate, track, and forecast upcoming IT expenditures. By leveraging the Azure Pricing Calculator, Microsoft Cost Management, and auto-scaling boundaries, business leaders can simulate traffic growth and ensure operational spending scales proportionally with revenue. Common confusion: Performance predictability does not mean performance is static; it means performance metrics stay within predictable, guaranteed SLA parameters.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Cloud Manageability: Automation, APIs, and Governance',
            body: 'Cloud manageability describes how efficiently administrators and developers can maintain, scale, and govern cloud infrastructure. Azure provides two key manageability paths: 1) Management for the cloud: configuring resources to automatically scale up or down during load, sending health alerts during degradation, and deploying resources via automated CI/CD pipelines. 2) Management in the cloud: controlling user access permissions via RBAC, enforcing organizational compliance standards through Azure Policy, and auditing administrative actions via the Azure Activity Log. Consistent REST APIs underlying the Azure Resource Manager (ARM) ensure that whether you manage resources using the Azure Portal, CLI, PowerShell, or SDKs, management behavior is identical. African analogy: Manageability is like a modern agricultural irrigation grid where soil moisture sensors automatically trigger water valves, report water consumption to a mobile app, and shut off during rain.',
            source_note: 'Draft, needs human review'
          }
        ]
      }
    ]
  },
  {
    slug: 'azure-architecture',
    title: 'Describe Azure Architecture & Services',
    weight_pct: 37,
    sort: 2,
    topics: [
      {
        slug: 'regions-and-availability-zones',
        title: 'Azure Regions, Availability Zones & Regional Pairs',
        summary: 'The core geographic hierarchy of Azure global infrastructure: datacenters, Availability Zones, Regions, and Regional Pairs.',
        key_terms: ['Azure Region', 'Availability Zone', 'Data Center', 'Regional Pair', 'Data Residency'],
        analogy: 'A commercial bank network: A datacenter is an individual branch building; an Availability Zone is a distinct fortified branch in Westlands with separate generators and water; a Region is Nairobi containing multiple zones; a Regional Pair is pairing Nairobi with a secondary region over 300 miles away to survive major regional power grid or telecommunication failures.',
        sort: 1,
        chunks: [
          {
            title: 'Azure Regions and Physical Data Centers',
            body: 'An Azure Region is a geographical area on the planet containing at least one, and typically multiple, physical data centers connected via a dedicated, latency-defined fiber optic network. Microsoft operates over 60 announced regions globally, including regions in Africa such as South Africa North (Johannesburg). When deploying Azure resources, you choose the region where your services will run. Choosing a region near your end users minimizes network latency and assists in meeting national data residency laws (ensuring customer data does not leave sovereign borders). A data center is a discrete physical facility with climate control, redundant electrical power feeds, diesel backup generators, and enterprise security perimeters. Common confusion: An Azure Region is not a single building; it is a geographic perimeter containing clusters of data centers.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Availability Zones and Regional Pairs Architecture',
            body: 'An Availability Zone (AZ) is a physically separate datacenter location within an Azure region. Each Availability Zone consists of one or more data centers equipped with independent power, cooling, and networking infrastructure. Azure regions that support zones contain a minimum of three distinct Availability Zones (Zone 1, Zone 2, and Zone 3). By deploying virtual machines and storage across multiple zones, applications achieve high availability with up to a 99.99% uptime SLA: if one zone suffers a local flood or substation blackout, the remaining zones continue operating to preserve service availability. An Azure Regional Pair links two regions within the same geography typically at least 300 miles (approx. 480 km) apart (e.g. South Africa North paired with South Africa West) where geographic scale permits. In widespread multi-region outages, Azure prioritizes restoring one region from each pair first to preserve enterprise continuity. Note that many newer Azure regions rely primarily on Availability Zones rather than paired regions. Common confusion: Availability Zones protect against single datacenter failures within a region; regional pairs protect against broad regional disasters. African analogy: Availability Zones are having backup water tanks at three separate estate gates; regional pairs are having an alternate warehouse in Kisumu if Nairobi hub experiences a prolonged grid blackout.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'sovereign-regions',
        title: 'Azure Sovereign Regions',
        summary: 'Specialized, physically and logically isolated Azure cloud instances built for strict government and national compliance requirements.',
        key_terms: ['Sovereign Regions', 'Azure Government', 'Azure China 21Vianet'],
        analogy: 'A diplomatic embassy compound: situated on foreign soil but operating under completely separate legal sovereignty, dedicated armed security, and diplomatic immunity.',
        sort: 2,
        chunks: [
          {
            title: 'Azure Sovereign and Dedicated Cloud Instances',
            body: 'Azure Sovereign Regions are physically and logically isolated cloud instances designed to meet stringent security, compliance, and legal regulations for specific government entities and jurisdictions. The standard global commercial Azure cloud is separate from these sovereign clouds. Key examples include: 1) Azure Government: a dedicated cloud instance physically isolated within the continental United States, accessible only to US federal, state, local, and tribal government agencies and their vetted commercial contractors. Personnel operating Azure Government must pass rigorous background checks. 2) Azure China 21Vianet: a dedicated cloud instance physically located within mainland China, operated and managed independently by 21Vianet in compliance with Chinese telecommunications laws. Common confusion: You cannot migrate or share resources directly between commercial Azure and sovereign regions using standard subscription transfers; they operate on completely independent directory tenants and network backbones.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Compliance Standards in Sovereign vs. Commercial Azure',
            body: 'Sovereign regions are purpose-built to satisfy mandatory national compliance frameworks that commercial cloud environments cannot legally support. Azure Government satisfies FedRAMP High, DoD Impact Level 5, and CJIS (Criminal Justice Information Services) standards for national security intelligence. Azure China guarantees that all customer data remains physically stored on servers within Chinese national borders under the operational sovereignty of 21Vianet, adhering strictly to the Chinese Cybersecurity Law. In Africa, organizations subject to national data residency requirements (such as central bank directives or national data protection authorities) typically choose the South Africa North commercial region, which guarantees in-country data residency without requiring a completely isolated sovereign instance (with South Africa West functioning as an access-restricted secondary disaster recovery region). Common confusion: Commercial Azure in South Africa is not a sovereign region; it is part of the global commercial Azure fabric with regional data residency guarantees.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'resource-hierarchy-and-management',
        title: 'Azure Resource Hierarchy: Management Groups, Subscriptions & Resource Groups',
        summary: 'Azure organizes all cloud resources into a four-level governance hierarchy: Management Groups, Subscriptions, Resource Groups, and Resources.',
        key_terms: ['Management Group', 'Subscription', 'Resource Group', 'Resource', 'Inheritance'],
        analogy: 'SACCO governance structure: Management group is the National SACCO Federation; Subscriptions are individual regional county branches; Resource Groups are departmental project committees; Resources are the office laptops and furniture.',
        sort: 3,
        chunks: [
          {
            title: 'The Four-Level Azure Management Hierarchy',
            body: 'Azure organizes all cloud infrastructure into a strict hierarchical structure consisting of four levels: 1) Management Groups: containers that help manage access, policy, and compliance across multiple subscriptions. 2) Subscriptions: logical containers linked to an Azure account that serve as billing, authentication, and authorization boundaries. 3) Resource Groups: logical containers into which Azure resources are deployed and managed. 4) Resources: individual instances of services deployed by users, such as Virtual Machines, Storage Accounts, or Virtual Networks. Governance settings applied at a parent level (such as an Azure Policy assigned at a Management Group) are automatically inherited by all child subscriptions, resource groups, and individual resources below it. Common confusion: A resource can only belong to one resource group and one subscription at any given time, and resource groups cannot be nested inside other resource groups (though individual resources can have child resources, such as subnets inside a virtual network).',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Resource Groups and Resource Lifecycle Boundaries',
            body: 'A Resource Group is a fundamental organizational unit in Azure. Every deployed Azure resource must belong to exactly one resource group. The golden rule for resource groups is lifecycle alignment: resources that share the same creation, update, and decommissioning lifecycle should be grouped together. For example, if you are developing a mobile banking backend with a VM, database, and virtual network, putting them in one resource group allows you to delete the entire application with a single command when testing concludes. When a resource group is deleted, Azure automatically deletes every resource contained inside it. Resources inside a single resource group do not need to reside in the same Azure region. Common confusion: The location selected when creating a resource group only dictates where the resource group’s deployment metadata is stored; the resources within it can be deployed to any region worldwide.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-virtual-machines-and-scale-sets',
        title: 'Azure Compute: Virtual Machines & Scale Sets (VMSS)',
        summary: 'On-demand IaaS compute providing configurable CPU, RAM, and storage, with automated auto-scaling across VM scale sets.',
        key_terms: ['Virtual Machine (VM)', 'Virtual Machine Scale Sets (VMSS)', 'IaaS', 'Hypervisor', 'Fault Domain'],
        analogy: 'Hiring commercial vehicles: A Virtual Machine is leasing an Isuzu delivery truck where you hire the driver and service the engine; VM Scale Sets is an automated depot that dispatches 5 additional trucks when morning cargo triples and parks them by noon.',
        sort: 4,
        chunks: [
          {
            title: 'Azure Virtual Machines (VMs) Architecture',
            body: 'Azure Virtual Machines (VMs) provide on-demand, configurable Infrastructure as a Service (IaaS) computing capacity. With Azure VMs, you have total administrative control over the guest operating system (Windows Server or diverse Linux distributions like Ubuntu, Red Hat, and Debian), installed software packages, and network configurations. VMs are ideal when you require full control over the operating system, need to run custom software with specific kernel dependencies, or are lifting and shifting on-premises server images into Azure. When creating a VM, you configure VM size (CPU and RAM), OS disk type, network interfaces, and public IP addresses. Because VMs are IaaS, the customer is strictly responsible for maintaining OS security patches, installing antivirus tools, and setting up operating system backup schedules. Common confusion: Azure does not automatically apply Windows or Linux OS security patches to standard Virtual Machines; operating system maintenance is the customer’s responsibility under the shared responsibility model.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Virtual Machine Scale Sets (VMSS) and High Availability',
            body: 'Azure Virtual Machine Scale Sets (VMSS) allow you to deploy and manage a group of identical, load-balanced virtual machines. As web traffic or CPU utilization changes, VMSS can automatically increase the number of VM instances (scale out) or decrease instances (scale in) based on defined metric thresholds or scheduled timetables. This provides true elasticity and high availability without manual administrator intervention. Furthermore, VMSS distributes VM instances across multiple Availability Zones and Fault Domains (preventing simultaneous failure from physical power, hardware rack, or network switch outages). VMSS is commonly used to build scalable web applications, big data processing pipelines, and container clusters. Common confusion: In a VM Scale Set, all VM instances are identical clones based on the same golden image; VMSS is not for managing disparate, heterogeneous servers.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-app-services-and-functions',
        title: 'Azure App Service & Azure Functions (Serverless)',
        summary: 'PaaS hosting for web apps and APIs alongside event-driven serverless functions with zero server management.',
        key_terms: ['Azure App Service', 'Azure Functions', 'Serverless', 'PaaS', 'Event-Driven'],
        analogy: 'Restaurant kitchen services: Azure App Service is renting a fully furnished commercial kitchen with gas and refrigeration where you just bring your chef to cook; Azure Functions is hiring a catering chef for 45 minutes strictly to fry samosas for an afternoon tea break.',
        sort: 5,
        chunks: [
          {
            title: 'Azure App Service Web Hosting Platform',
            body: 'Azure App Service is a fully managed Platform as a Service (PaaS) offering designed for building, hosting, and scaling web applications, REST APIs, and mobile backends. App Service supports multiple programming languages and frameworks, including .NET, .NET Core, Java, Node.js, PHP, and Python, running on either Windows or Linux environments. Microsoft automatically patches the underlying operating system, web server software (IIS, Apache, NGINX), and runtime frameworks. App Service features built-in automated scaling, high availability, SSL certificate binding, and deployment slots (allowing zero-downtime staging and production swaps). Developers can push code directly via GitHub, Azure DevOps, or Git. Common confusion: In App Service, you have no access to the underlying virtual machine host or root operating system command line; you only manage the application files and configuration.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Azure Functions and Serverless Architecture',
            body: 'Azure Functions is an event-driven serverless compute service that enables developers to run small pieces of code (functions) without managing or provisioning any infrastructure. Functions run in response to specific triggers, such as an HTTP web request, a file uploaded to an Azure Blob Storage container, a new message on an Azure Service Bus queue, or a timer schedule (cron job). Serverless computing features automatic instant scaling: if 10,000 events occur simultaneously, Azure Functions dynamically provisions 10,000 function instances in parallel. Under the Consumption billing plan, you are billed down to the millisecond of execution time and memory consumed; if your function does not execute, your cost is zero. Common confusion: Serverless does not mean there are no physical servers; it means server management, scaling, and provisioning are completely invisible and abstracted away by Microsoft. African analogy: Azure Functions is like an automated M-Pesa transaction SMS notifier: the script wakes up for 200 milliseconds to send the text message and immediately vanishes from memory.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-containers-and-aks',
        title: 'Azure Containers: ACI & Azure Kubernetes Service (AKS)',
        summary: 'Lightweight software packaging via Docker containers with fast serverless hosting in ACI and enterprise orchestration in AKS.',
        key_terms: ['Container', 'Docker', 'Azure Container Instances (ACI)', 'Azure Kubernetes Service (AKS)', 'Microservices'],
        analogy: 'Standard shipping containers at the Port of Mombasa: rather than loose cargo, goods are packed into standard steel containers that any crane, ship, or train flatbed can handle identically without opening the doors.',
        sort: 6,
        chunks: [
          {
            title: 'Containers vs. Virtual Machines and Azure Container Instances (ACI)',
            body: 'A container is a lightweight, standalone executable software package that contains everything needed to run an application: code, runtime engine, system tools, and system libraries. Unlike Virtual Machines, which each run a complete guest operating system on top of a hypervisor, containers share the host operating system’s kernel. Because there is no guest OS overhead, containers launch in seconds and consume a fraction of the RAM and disk space of VMs. Azure Container Instances (ACI) is a serverless solution that lets you run Docker containers directly in Azure without managing any virtual machines or container orchestration clusters. With ACI, you specify the container image and required CPU/memory, and Azure runs it immediately, billing per second of execution. Common confusion: ACI is ideal for isolated batch jobs and rapid prototypes, but does not provide container orchestration, ingress routing, or multi-pod auto-scaling.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Azure Kubernetes Service (AKS) Enterprise Orchestration',
            body: 'Azure Kubernetes Service (AKS) is a highly scalable, fully managed container orchestration platform based on open-source Kubernetes. When modern enterprise architectures deploy hundreds of microservices across dozens of containers, managing their lifecycle manually becomes unfeasible. AKS automates container deployment, rolling software upgrades, self-healing pod restarts, internal service discovery, and horizontal container auto-scaling. In AKS, Microsoft manages the Kubernetes master control plane nodes at no additional charge under the Free cluster management tier, ensuring automated health management and updates. Customers only pay for the worker VM agent nodes running the actual application workloads (with an optional paid Standard Tier available if an enterprise Uptime SLA is required). Common confusion: ACI runs single standalone container instances without cluster overhead; AKS orchestrates complex multi-container microservice applications with automated self-healing and load balancing.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-networking-vnets-subnets',
        title: 'Azure Virtual Networks (VNets), Subnets & Peering',
        summary: 'Logically isolated private cloud networks enabling secure communication among cloud resources, on-premises networks, and the internet.',
        key_terms: ['Virtual Network (VNet)', 'Subnet', 'VNet Peering', 'Network Security Group (NSG)', 'Private IP'],
        analogy: 'A gated residential community in Nairobi: The VNet is the high perimeter wall enclosing the entire estate; Subnets are individual cul-de-sacs or courts inside; Network Security Groups are security guards at each court gate checking visitor passes.',
        sort: 7,
        chunks: [
          {
            title: 'Azure Virtual Networks (VNets) and Subnet Segmentation',
            body: 'An Azure Virtual Network (VNet) is a logically isolated private network in the Azure cloud that represents your own virtual network topology. VNets enable Azure resources (like VMs) to securely communicate with each other, the internet, and on-premises networks using private IP address ranges (RFC 1918). Within a VNet, you divide the address space into one or more Subnets to segment workloads (e.g. creating a public-facing Web subnet and a private Database subnet). Resources within different subnets of the same VNet communicate by default without extra configuration. Network Security Groups (NSGs) act as virtual firewalls containing security rules that allow or deny inbound and outbound network traffic based on source/destination IP, port, and protocol. Common confusion: VNets are scoped to a single Azure region, but can span multiple Availability Zones within that region.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Virtual Network (VNet) Peering',
            body: 'VNet Peering seamlessly connects two Azure Virtual Networks together. Once peered, virtual machines in both VNets communicate with each other directly using private IP addresses as if they were in the same network. VNet Peering routes network traffic entirely across Microsoft’s private fiber-optic backbone network, never traversing the public internet. This provides high-bandwidth, ultra-low-latency private communication. Azure supports Regional VNet Peering (connecting VNets in the same region) and Global VNet Peering (connecting VNets across different Azure regions worldwide). Peering does not cause downtime during setup. Common confusion: VNet peering is non-transitive. If VNet A is peered with VNet B, and VNet B is peered with VNet C, VNet A cannot communicate with VNet C unless an explicit peering is created between A and C. African analogy: VNet peering is opening a private gate in the wall separating two adjacent residential estates so residents can walk between them without driving out onto the congested main highway.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-vpn-gateway-and-expressroute',
        title: 'Hybrid Connectivity: VPN Gateway vs. ExpressRoute',
        summary: 'Connecting corporate on-premises datacenters to Azure via encrypted internet VPN or private dedicated fiber connections.',
        key_terms: ['VPN Gateway', 'Azure ExpressRoute', 'Site-to-Site VPN', 'Point-to-Site VPN', 'Dedicated Circuit'],
        analogy: 'Highway transport options: VPN Gateway is driving an armored security car down the public Mombasa Road with armed escort; ExpressRoute is building a private dedicated tarmac tollway directly from your warehouse to the airport with zero public traffic.',
        sort: 8,
        chunks: [
          {
            title: 'Azure VPN Gateway and Site-to-Site Connections',
            body: 'Azure VPN Gateway is a specialized virtual network gateway used to send encrypted network traffic between an Azure Virtual Network and an on-premises location over the public internet using industry-standard IPsec/IKE VPN tunnels. VPN Gateway supports Site-to-Site (S2S) connections (connecting an entire office network to Azure), Point-to-Site (P2S) connections (allowing remote individual employees to connect from laptops via VPN client software), and VNet-to-VNet connections. VPN Gateway is cost-effective, straightforward to deploy, and suitable for small-to-medium businesses. However, because traffic traverses the public internet, bandwidth is limited (up to 10 Gbps) and latency is subject to public internet congestion. Common confusion: VPN traffic is encrypted, but travels over public internet infrastructure.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Azure ExpressRoute Private Dedicated Connectivity',
            body: 'Azure ExpressRoute establishes a direct, private physical connection between your on-premises infrastructure and Azure private cloud services (with Microsoft peering available for specific services) through a certified connectivity partner. ExpressRoute connections do not traverse the public internet at all. As a result, ExpressRoute offers significantly higher reliability, predictable speeds (ranging up to 100 Gbps), lower latency, and higher security than internet VPNs. ExpressRoute is ideal for mission-critical enterprise workloads, periodic massive data migrations, and financial banking systems with strict regulatory compliance requirements. Note that standard Microsoft 365 traffic is designed to route directly via the public internet; using ExpressRoute for Microsoft 365 is strictly regulated and requires Microsoft pre-authorization. Common confusion: ExpressRoute does not encrypt traffic by default because it travels over private dedicated fiber circuits; if encryption is required, MACsec or an IPsec tunnel over ExpressRoute can be configured. African analogy: ExpressRoute is having a dedicated private railway siding running straight from a tea plantation directly into the Mombasa port container terminal.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-storage-types-and-access-tiers',
        title: 'Azure Storage: Blob, Files, Queues & Tables',
        summary: 'Massively scalable object, file, queue, and table storage with cost-optimized Hot, Cool, Cold, and Archive access tiers.',
        key_terms: ['Blob Storage', 'Azure Files', 'Queue Storage', 'Table Storage', 'Hot Tier', 'Cool Tier', 'Archive Tier'],
        analogy: 'Agricultural granary storage: Hot tier is keeping maize flour in the kitchen for daily ugali; Cool tier is bags in the store for next month; Archive tier is dried maize grain sealed in underground airtight drums for famine relief years later.',
        sort: 9,
        chunks: [
          {
            title: 'Azure Storage Services: Blob, Files, Queues and Tables',
            body: 'Azure Storage is a Microsoft-managed cloud service that provides durable, secure, and scalable cloud storage. An Azure Storage Account provides a unique namespace for four primary storage services: 1) Azure Blob Storage: highly scalable object storage for unstructured data such as text, images, video streaming, and backup files. 2) Azure Files: fully managed cloud file shares accessible via standard Server Message Block (SMB) or Network File System (NFS) protocols, allowing on-premises servers to mount cloud storage as a shared network drive without hardware. 3) Azure Queue Storage: messaging store for reliable asynchronous communication between decoupled application components. 4) Azure Table Storage: cost-effective NoSQL key-value store for rapid development and non-relational structured datasets. Common confusion: Azure Managed Disks are standalone block-level compute resources (Microsoft.Compute/disks) attached to virtual machines, NOT created within an Azure Storage Account namespace. Azure Files allows multiple virtual machines and computers to read and write to the same shared folder concurrently.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Blob Storage Access Tiers: Hot, Cool, Cold & Archive',
            body: 'Azure Blob Storage offers four access tiers to optimize storage expenses based on data access patterns: 1) Hot Tier: optimized for data accessed frequently; has the highest storage cost but the lowest transaction and access fees. 2) Cool Tier: for data stored for at least 30 days and accessed infrequently (e.g. monthly billing statements); lower storage cost but higher access fees. 3) Cold Tier: for data stored for at least 90 days with very low access frequency. 4) Archive Tier: lowest storage cost for long-term historical records and legal compliance (minimum 180 days). Archive data is stored offline; before an archive blob can be read, it must undergo a rehydration process that can take up to several hours to restore the blob back to Hot or Cool. Common confusion: You cannot read or download an Archive blob directly; applications must wait for the blob to rehydrate.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-storage-redundancy',
        title: 'Azure Storage Redundancy: LRS, ZRS, GRS & GZRS',
        summary: 'Data durability strategies replicating data across local datacenters, availability zones, and secondary paired regions.',
        key_terms: ['LRS (Locally Redundant)', 'ZRS (Zone-Redundant)', 'GRS (Geo-Redundant)', 'GZRS (Geo-Zone-Redundant)', 'Durability'],
        analogy: 'Safeguarding paper title deeds: LRS is making three photocopies kept in different cabinets in the same office; ZRS is keeping copies in three distinct offices across Nairobi; GRS is keeping copies in Nairobi and a third set in Mombasa in case of a nationwide emergency.',
        sort: 10,
        chunks: [
          {
            title: 'Locally Redundant (LRS) vs. Zone-Redundant Storage (ZRS)',
            body: 'Azure Storage always replicates multiple copies of your data to ensure high durability. Locally Redundant Storage (LRS) replicates your data three times within a single physical data center in the primary region. LRS provides at least 99.999999999% (11 nines) durability of objects against hardware disk and rack failures. However, if the entire datacenter suffers a catastrophic flood or fire, all three copies could be lost. Zone-Redundant Storage (ZRS) replicates your data synchronously across three distinct Availability Zones in the primary region. ZRS provides at least 12 nines of durability and ensures data remains fully accessible even if an entire datacenter suffers complete failure. Common confusion: LRS is the lowest-cost redundancy tier, but offers zero protection against datacenter-level destruction.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Geo-Redundant (GRS) and Geo-Zone-Redundant Storage (GZRS)',
            body: 'Geo-Redundant Storage (GRS) copies your data three times within a single data center in the primary region using LRS, then replicates data asynchronously to a secondary paired region hundreds of miles away (where it is copied three more times with LRS). GRS provides at least 16 nines of durability and protects against catastrophic regional disasters. Geo-Zone-Redundant Storage (GZRS) provides the highest level of durability: it replicates data across three Availability Zones in the primary region with ZRS, and also replicates asynchronously to the secondary paired region. If read access to the secondary region is needed during normal operations, Read-Access Geo-Redundant Storage (RA-GRS) provides a read-only secondary endpoint. Common confusion: Secondary replication in GRS is asynchronous, meaning there is a slight replication lag before changes appear in the paired region.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-database-services',
        title: 'Azure Databases: Cosmos DB & Azure SQL',
        summary: 'Fully managed relational Azure SQL and globally distributed multi-model NoSQL Cosmos DB.',
        key_terms: ['Azure Cosmos DB', 'Azure SQL Database', 'NoSQL', 'ACID', 'Multi-Model'],
        analogy: 'M-Pesa transaction processing: Azure SQL is the central bank ledger where financial debit and credit transactions must balance strictly (ACID); Cosmos DB is the mobile payment network processing millions of requests per second across 10 countries with sub-10ms response times.',
        sort: 11,
        chunks: [
          {
            title: 'Azure Cosmos DB: Globally Distributed NoSQL',
            body: 'Azure Cosmos DB is Microsoft’s globally distributed, multi-model NoSQL database service. It is architected for modern web, gaming, retail, and IoT applications requiring guaranteed single-digit millisecond response times and turnkey multi-region replication. With a click of a button in the Azure Portal, you can replicate data across any number of Azure regions worldwide. Cosmos DB offers 99.999% high availability SLAs and supports multiple database APIs, including Azure Cosmos DB for NoSQL (formerly SQL Core), MongoDB, Apache Cassandra, Gremlin (graph), and Table API. This allows developers to use familiar query languages without rewriting application logic. Common confusion: Cosmos DB is a non-relational distributed NoSQL database designed for horizontal scaling and low-latency JSON documents; it is not a traditional relational database.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Azure SQL Database and Managed Relational Services',
            body: 'Azure SQL Database is a fully managed Platform as a Service (PaaS) relational database engine built on the latest stable, evergreen Microsoft SQL Server database engine. It handles critical database management functions like automated backups, high availability patching, performance monitoring, and threat detection without user administration. Azure SQL delivers high performance with built-in machine learning optimizations that automatically tune database queries and indexes. Azure also provides Azure SQL Managed Instance, which offers nearly 100% compatibility with on-premises SQL Server instances, making it the premier choice for migrating legacy enterprise SQL databases to PaaS with minimal code changes. Common confusion: In Azure SQL Database, you do not manage a virtual machine or host OS; in Azure VMs running SQL Server (IaaS), you maintain full OS and SQL Server administrative control.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-virtual-desktop',
        title: 'Azure Virtual Desktop (AVD)',
        summary: 'Cloud-hosted desktop and application virtualization delivering Windows 10/11 multi-session experiences to remote users.',
        key_terms: ['Azure Virtual Desktop (AVD)', 'Multi-Session Windows', 'Virtualization', 'Host Pools', 'Remote Work'],
        analogy: 'University cyber cafe or remote terminal: instead of every student carrying an expensive high-powered laptop, students use basic cheap terminals to remotely access fully equipped desktop computers hosted in the central campus server room.',
        sort: 12,
        chunks: [
          {
            title: 'Azure Virtual Desktop (AVD) Architecture and Multi-Session',
            body: 'Azure Virtual Desktop (AVD) is a comprehensive cloud-based desktop and app virtualization service running in Microsoft Azure. It delivers full Windows 10 and Windows 11 enterprise desktop experiences and published remote apps to any end-user device (including Windows, macOS, iOS, Android, and HTML5 web browsers). A revolutionary capability of AVD is Windows 10 and 11 Enterprise Multi-Session, which allows multiple concurrent users to sign into the same underlying Azure Virtual Machine simultaneously while maintaining isolated user profiles. This drastically reduces computing costs for businesses, schools, and call centers across Africa compared to provisioning dedicated physical laptops or individual single-user VMs. Microsoft manages the virtualization infrastructure (gateway, broker, diagnostics, and load balancing) as a service. Common confusion: AVD is not just a remote desktop gateway; it provides multi-session Windows desktop virtualization, centralized security, and FSLogix user profile containers.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'AVD Security, Host Pools and Remote Access',
            body: 'Azure Virtual Desktop enhances enterprise security by keeping all corporate data and intellectual property in the Azure cloud rather than on untrusted personal laptops or smartphones. AVD organizes session host virtual machines into Host Pools (collections of one or more identical VMs). Pooled host pools share resources among multiple users using breadth-first or depth-first load balancing algorithms, while personal host pools assign dedicated individual VMs to specific users (such as software engineers requiring administrative rights). AVD integrates natively with Microsoft Entra ID for Conditional Access and Multi-Factor Authentication. If a student or remote employee loses their laptop, zero corporate data is compromised because no files were saved locally on the device. Common confusion: End-user client devices do not need Windows 11 installed; they can access full Windows 11 cloud desktops through an HTML5 browser from a cheap Android tablet or Linux workstation.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-migration-tools-migrate-databox',
        title: 'Migration Tools: Azure Migrate & Azure Data Box',
        summary: 'Assessing and migrating on-premises servers, databases, and physical bulk data to Microsoft Azure.',
        key_terms: ['Azure Migrate', 'Azure Data Box', 'Lift-and-Shift', 'Offline Migration'],
        analogy: 'Relocating a corporate business headquarters: Azure Migrate is the professional moving survey team inventorying every office desk and calculating moving costs; Azure Data Box is a heavy reinforced shipping container truck sent to your door to haul 100 metric tons of physical files in one road trip.',
        sort: 13,
        chunks: [
          {
            title: 'Azure Migrate Discovery and Assessment',
            body: 'Azure Migrate serves as a centralized hub for discovering, assessing, and migrating on-premises infrastructure, software applications, and databases to Microsoft Azure. Azure Migrate provides agentless discovery of on-premises VMware, Hyper-V, and physical servers to identify inventory, analyze dependencies, and calculate Azure readiness. It calculates accurate cost estimations by recommending appropriately sized Azure Virtual Machines and SQL instances based on actual historical performance utilization rather than unoptimized on-premises allocations. Once assessed, Azure Migrate orchestrates server replication with minimal downtime (lift-and-shift migration). Common confusion: Azure Migrate does not just migrate virtual machines; it also assesses and migrates web apps, virtual desktops, and on-premises SQL Server databases.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Azure Data Box Physical Data Transfer',
            body: 'Azure Data Box is a family of rugged, secure physical appliances designed to transport massive volumes of data (terabytes to petabytes) into Azure when network transfer over the public internet is too slow, expensive, or completely unavailable due to limited bandwidth in remote African regions. Microsoft ships an encrypted, tamper-evident Data Box device (with 80 TB usable capacity) directly to your datacenter. You connect it to your local network via 10 GbE interfaces, copy data onto the device using AES-256 hardware encryption, and ship it back to the Azure datacenter. Once received, Microsoft engineers upload your data directly into your Azure Storage Account and perform a cryptographic erase of the device. Common confusion: Use Azure Data Box when transfer over network cables would take months; use AzCopy or Azure Storage Explorer when transferring moderate data over high-speed internet.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-storage-security-and-tooling',
        title: 'Azure Storage Security, AzCopy & Storage Explorer',
        summary: 'Protecting storage data with encryption at rest, Shared Access Signatures (SAS), and managing data with AzCopy and Storage Explorer.',
        key_terms: ['Storage Encryption (SSE)', 'Shared Access Signature (SAS)', 'AzCopy', 'Azure Storage Explorer'],
        analogy: 'Carrying cash: Encryption at rest is locking the cash in a biometric safe; Shared Access Signature (SAS) is giving a delivery boy a paper voucher that only allows him to collect exactly 500 shillings before 4 PM today; AzCopy is a dedicated high-speed cargo delivery van.',
        sort: 14,
        chunks: [
          {
            title: 'Storage Security: Encryption and Shared Access Signatures',
            body: 'Security in Azure Storage is enforced at multiple layers. All data written to Azure Storage is automatically encrypted at rest using Azure Storage encryption (service-side encryption) with 256-bit AES encryption. Microsoft manages encryption keys by default, or customers can supply their own keys via Azure Key Vault. In addition, all storage data in transit between client apps and Azure can be enforced to use HTTPS (secure transfer required). To grant limited, delegated access to storage resources without exposing root account access keys, Azure provides Shared Access Signatures (SAS). A SAS token is a signed URI that grants granular, time-limited permissions (e.g. read-only access to one specific blob for 2 hours) from designated IP addresses. Common confusion: Never share root storage account access keys with end users or external applications; always generate granular Shared Access Signatures (SAS) or use Entra ID RBAC.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Storage Tooling: AzCopy and Azure Storage Explorer',
            body: 'Managing and transferring data to and from Azure Storage is facilitated through two primary tools: 1) AzCopy: a high-performance command-line utility optimized for copying blobs or files to and from an Azure Storage Account, as well as between different storage accounts. AzCopy supports directory synchronization, parallel asynchronous transfers, and resumes interrupted transfers automatically if network drops. 2) Azure Storage Explorer: a standalone GUI application available for Windows, macOS, and Linux that lets administrators visually upload, download, browse, and manage blobs, queues, tables, and Azure Files. Storage Explorer uses AzCopy under the hood for high-speed file operations. Common confusion: AzCopy is a command-line utility for scripting and bulk transfers; Storage Explorer is a desktop graphical user interface (GUI) application.',
            source_note: 'Draft, needs human review'
          }
        ]
      }
    ]
  },
  {
    slug: 'azure-management',
    title: 'Describe Azure Management & Governance',
    weight_pct: 35,
    sort: 3,
    topics: [
      {
        slug: 'pricing-calculator-and-tco',
        title: 'Cost Estimation: Pricing Calculator & TCO with Azure Migrate',
        summary: 'Tools for forecasting monthly Azure expenditures with the Pricing Calculator and evaluating cloud migration TCO savings via Azure Migrate.',
        key_terms: ['Azure Pricing Calculator', 'Total Cost of Ownership (TCO)', 'Azure Migrate Business Case', 'Cost Factors'],
        analogy: 'Building a home: The Pricing Calculator is estimating the cost of materials and labor before purchasing; TCO analysis in Azure Migrate compares the total multi-year cost of maintaining on-premises datacenters versus cloud migration.',
        sort: 1,
        chunks: [
          {
            title: 'Azure Pricing Calculator vs. Migration TCO Evaluation',
            body: 'The Azure Pricing Calculator is a free web-based estimation tool used to calculate estimated monthly expenditures for new or expanded Azure architectures. Users select specific Azure products, configure technical parameters (such as VM cores, RAM, storage size, and region), and the tool generates a transparent, detailed cost breakdown. It helps organizations plan cloud budgets before deploying a single resource. To evaluate the Total Cost of Ownership (TCO) and savings realized by migrating existing on-premises workloads to Microsoft Azure, Microsoft now integrates TCO and business case modeling directly into Azure Migrate (which replaced the standalone legacy TCO Calculator). The Azure Migrate business case factors in physical server hardware costs, datacenter electricity, cooling, server room real estate, software licensing, and IT labor salaries over 1, 3, or 5 years. Common confusion: The Pricing Calculator estimates new Azure resource expenditures; migration TCO evaluations (in Azure Migrate) compare existing on-premises datacenter operational costs against cloud savings.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Total Cost of Ownership (TCO) Cost Savings Model',
            body: 'Total Cost of Ownership (TCO) analysis quantifies hidden operational expenditures that on-premises datacenter operators frequently overlook. Beyond physical server chassis depreciation, on-premises facilities require round-the-clock air conditioning, diesel fuel reserves for standby generators, municipal physical security guard patrols, server rack space lease payments, and specialized storage area network (SAN) maintenance contracts. In Azure Migrate, you discover your existing physical server inventory, storage volume, and network traffic to automatically generate comprehensive TCO business cases. The tool applies industry benchmarks to show expected percentage savings over 1, 3, or 5 years when migrated to Microsoft Azure. African organizations, especially banks and telcos transitioning from high-cost local generator cooling to Azure South Africa North, use TCO reports to justify cloud migration to company boards of directors. Common confusion: TCO is a financial comparison model for legacy workloads, not a real-time cloud billing dashboard.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'cost-management-and-budgets',
        title: 'Microsoft Cost Management & Budgets',
        summary: 'Monitoring historical cloud spending, analyzing resource costs, and establishing proactive budget alerts.',
        key_terms: ['Microsoft Cost Management', 'Budgets', 'Cost Alerts', 'Resource Tags'],
        analogy: 'M-Pesa balance tracking: Checking your weekly M-Pesa statement to see where your money went, and setting up an automated SMS alert whenever your spending reaches 80% of your monthly budget.',
        sort: 2,
        chunks: [
          {
            title: 'Microsoft Cost Management and Budget Alerts',
            body: 'Microsoft Cost Management is a comprehensive cloud governance suite embedded directly inside the Azure Portal that allows organizations to monitor, allocate, and optimize cloud expenditures. It provides interactive Cost Analysis charts to visualize historical spending patterns, breakdown costs by resource group or department, and identify spending spikes. Organizations can establish formal Cost Budgets with automated alert thresholds (e.g. sending automated notification emails when actual spending hits 50%, 80%, or 100% of the allocated budget). Furthermore, applying Resource Tags (key-value metadata pairs such as Environment: Production or Department: Finance) to resources enables granular cost filtering and departmental chargeback reporting. Common confusion: Cost Management budget alerts notify administrators when spending thresholds are breached, but they do not automatically shut down or delete your running virtual machines unless an automated Action Group script is explicitly wired.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Resource Tagging for Departmental Cost Allocation',
            body: 'Resource Tags are metadata key-value pairs assigned to Azure resources, resource groups, or subscriptions (such as CostCenter: 402 or Owner: Aisha). In Azure Resource Manager, tag names are case-insensitive, but tag values are case-sensitive. Tags do not affect how a virtual machine or database functions, but they are crucial for cloud financial operations (FinOps). In enterprise organizations where multiple teams share a single Azure subscription, Cost Management uses tags to group billing line items and produce departmental chargeback reports. For example, the finance department can group monthly Azure costs by Project or Environment to identify whether Dev or Prod incurred extra network egress fees. Azure Policy can also enforce mandatory tags, automatically preventing deployment of any resource that lacks an approved CostCenter tag. Common confusion: Tags are not inherited by resources inside a resource group automatically unless an Azure Policy with the inheritTag effect is assigned.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'identity-and-entra-id',
        title: 'Identity & Access: Microsoft Entra ID & Authentication',
        summary: 'Microsoft Entra ID cloud identity service providing authentication, single sign-on, and security boundaries.',
        key_terms: ['Microsoft Entra ID', 'Authentication (AuthN)', 'Authorization (AuthZ)', 'Single Sign-On (SSO)', 'Tenant'],
        analogy: 'Entering a secure office building in Upper Hill: Authentication is showing your national ID card at reception to verify who you are; Authorization is the electronic security chip on your guest badge allowing you to open the door to the 4th floor conference room.',
        sort: 3,
        chunks: [
          {
            title: 'Microsoft Entra ID Fundamentals and SSO',
            body: 'Microsoft Entra ID (formerly known as Azure Active Directory or Azure AD) is Microsoft’s cloud-based identity and access management service. It manages user accounts, organizational groups, application registrations, and device credentials across cloud and on-premises environments. Entra ID enables Single Sign-On (SSO), allowing employees to sign in once with a single set of corporate credentials and access thousands of cloud applications, including the Azure Portal, Microsoft 365, Salesforce, and custom in-house software. Authentication (AuthN) is the process of verifying that an identity (user or application) is who they claim to be by validating credentials like passwords, security tokens, or biometrics. Authorization (AuthZ) is the process of determining what actions or resources an authenticated identity is permitted to access. Common confusion: Microsoft Entra ID is not simply traditional Windows Server Active Directory running in a VM; it is a multi-tenant cloud identity platform using modern protocols (SAML, OpenID Connect, OAuth 2.0) instead of Kerberos and NTLM.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Hybrid Identity and Microsoft Entra Connect',
            body: 'Many established enterprises run on-premises Windows Server Active Directory Domain Services (AD DS) to manage physical office desktop logins. When adopting Azure, organizations want employees to use the same corporate credentials without maintaining two separate usernames and passwords. This is known as Hybrid Identity. Microsoft Entra Connect is an on-premises synchronization tool that integrates on-premises AD DS directories with Microsoft Entra ID in the cloud. It synchronizes user accounts, security groups, and password hashes (Password Hash Sync) or federates authentication via Active Directory Federation Services (AD FS). This gives users a seamless Single Sign-On experience whether logging into an on-premises workstation or the cloud Azure Portal. Common confusion: Entra Connect synchronizes identity metadata and password hashes, but does not move on-premises server infrastructure into the cloud.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'multi-factor-authentication-and-conditional-access',
        title: 'MFA & Conditional Access',
        summary: 'Securing access through Multi-Factor Authentication and contextual, signal-driven Conditional Access policies.',
        key_terms: ['Multi-Factor Authentication (MFA)', 'Conditional Access', 'Identity Signals', 'Zero Trust'],
        analogy: 'Airport security boarding: MFA is presenting your passport AND your physical boarding pass AND your fingerprint; Conditional Access is the airline security officer stopping you for extra screening if you booked an international flight 15 minutes before departure from an unrecognized country.',
        sort: 4,
        chunks: [
          {
            title: 'Multi-Factor Authentication (MFA) Verification Factors',
            body: 'Multi-Factor Authentication (MFA) is a security mechanism that requires users to provide two or more distinct evidence factors to successfully authenticate their identity. MFA dramatically reduces the risk of credential compromise. The three recognized categories of authentication factors are: 1) Something you know: a password, PIN, or security passphrase. 2) Something you have: a trusted mobile smartphone, hardware security key (FIDO2), or Microsoft Authenticator app push notification. 3) Something you are: a biometric attribute such as fingerprint scanning, facial recognition, or iris scanning. In Azure, enabling MFA stops over 99.2% of account compromise attacks. Common confusion: Requiring a password and then asking for the answer to a mother’s maiden name is NOT multi-factor authentication; both are merely examples of "something you know". True MFA requires two distinct categories.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Conditional Access Policies in Microsoft Entra ID',
            body: 'Conditional Access is the modern security engine in Microsoft Entra ID that enforces access control decisions based on real-time identity signals. It embodies the core Zero Trust principle: "never trust, always verify." Conditional Access functions as an automated "if-then" rule engine: IF specified conditions are met, THEN enforce security controls. Signals evaluated include: user or group membership, device compliance status (is it a managed corporate laptop?), client application type, IP address location, and real-time sign-in risk level. Based on these signals, Conditional Access can automatically: allow access, enforce Multi-Factor Authentication challenge, require password reset, or block access entirely (e.g. blocking login attempts originating from countries where the organization has no employees). Common confusion: Conditional Access is evaluated dynamically during sign-in attempts, providing continuous adaptive protection rather than static permissions.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-rbac',
        title: 'Azure Role-Based Access Control (RBAC)',
        summary: 'Granular access management enforcing the principle of least privilege across subscriptions and resources.',
        key_terms: ['Azure RBAC', 'Security Principal', 'Role Definition', 'Scope', 'Least Privilege'],
        analogy: 'SACCO executive roles: The Chairman can authorize loans and sign checks; the Treasurer can view balances and deposit cash; a regular Member can only view their own passbook balance.',
        sort: 5,
        chunks: [
          {
            title: 'Azure Role-Based Access Control (RBAC) Architecture',
            body: 'Azure Role-Based Access Control (RBAC) provides fine-grained authorization management for Azure resources. By adhering to the principle of least privilege, RBAC ensures that users, applications, and administrators are granted only the minimum permissions necessary to perform their specific job duties. An RBAC assignment consists of three components: 1) Security Principal: the who (a user, security group, service principal, or managed identity). 2) Role Definition: the what (a set of permissions such as Owner, Contributor, Reader, or User Access Administrator). 3) Scope: the where (Management Group, Subscription, Resource Group, or individual Resource). Permissions assigned at a higher scope are inherited automatically by all child scopes beneath it. Common confusion: Contributor can create, edit, and delete any Azure resource, but CANNOT grant or delegate access permissions to other users; only Owner or User Access Administrator can assign RBAC permissions.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Built-in RBAC Roles vs. Custom Roles and Deny Assignments',
            body: 'Azure provides hundreds of built-in RBAC roles covering common administrative and developer scenarios. The four foundational built-in roles are: 1) Owner: full access to all resources, including the power to grant access to other users. 2) Contributor: can create and manage all types of Azure resources, but cannot grant access to others. 3) Reader: can view existing resources but cannot make any modifications. 4) User Access Administrator: can manage user access to Azure resources, but cannot create or manage the resources themselves. If built-in roles do not match specific organizational requirements, administrators can create Custom Roles using JSON permission definitions. Furthermore, Deny Assignments explicitly block specific user actions even if another role assignment permits them. Common confusion: In Azure RBAC, an explicit deny assignment always takes precedence over an allow assignment; however, deny assignments are read-only and created exclusively by Azure (e.g. via Azure Blueprints or managed applications)—they cannot be created or edited directly by administrators.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-policy-and-resource-locks',
        title: 'Azure Policy & Resource Locks',
        summary: 'Enforcing organizational compliance standards with Azure Policy and preventing accidental deletion with Resource Locks.',
        key_terms: ['Azure Policy', 'Initiative (Policy Set)', 'Resource Locks', 'CanNotDelete', 'ReadOnly'],
        analogy: 'City council building regulations and land caveats: Azure Policy is municipal zoning rules declaring that all buildings in Kilimani must not exceed 10 stories; Resource Locks are legal caveats registered on a property title preventing the land from being sold or demolished.',
        sort: 6,
        chunks: [
          {
            title: 'Azure Policy and Initiatives for Cloud Governance',
            body: 'Azure Policy is a governance service that evaluates and enforces organizational standards and regulatory compliance across your cloud estate. Unlike RBAC, which focuses on user actions, Azure Policy focuses on resource properties and configurations during deployment and ongoing runtime. For example, an Azure Policy can require that all virtual machines be deployed only in the South Africa North region, prohibit expensive GPU VM sizes, or mandate that all storage accounts enforce HTTPS traffic. If a developer attempts to deploy a non-compliant resource, Azure Policy denies the deployment. Multiple related policies can be grouped together into an Initiative (also called a Policy Set) to govern complex frameworks like ISO 27001 or PCI-DSS. Common confusion: RBAC controls WHO can do WHAT; Azure Policy controls WHAT resources CAN look like and WHERE they can be created.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Resource Locks: CanNotDelete and ReadOnly',
            body: 'Resource Locks protect critical Azure resources from accidental deletion or unintended modification by authorized administrators. Locks can be applied at the Subscription, Resource Group, or individual Resource level, and child resources inherit locks from parents. Azure supports two lock levels: 1) CanNotDelete: authorized users can read and modify the resource, but cannot delete it. 2) ReadOnly: authorized users can only read the resource; they cannot modify settings, update configurations, or delete it. Resource Locks override all RBAC permissions: even a user with the Owner role cannot delete a resource until the CanNotDelete lock is explicitly deleted first. Common confusion: Resource Locks do not stop a resource from functioning or processing transactions; a CanNotDelete lock on a VM allows the VM to run, process traffic, and reboot, but prevents deleting the VM entity.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-monitor-and-service-health',
        title: 'Observability: Azure Monitor & Service Health',
        summary: 'Collecting system metrics and log analytics with Azure Monitor, and monitoring platform status with Service Health.',
        key_terms: ['Azure Monitor', 'Metrics', 'Logs', 'Log Analytics', 'Application Insights', 'Azure Service Health'],
        analogy: 'National health clinic systems: Azure Service Health is the Ministry of Health issuing public alerts about nationwide disease outbreaks; Resource Health is a doctor taking your personal heart rate and temperature; Azure Monitor is an ICU monitor continuously tracking vital signs over time.',
        sort: 7,
        chunks: [
          {
            title: 'Azure Monitor Metrics, Logs, and Application Insights',
            body: 'Azure Monitor is a comprehensive observability solution that collects, analyzes, and acts on telemetry data from your cloud infrastructure and applications. It collects two fundamental data types: 1) Metrics: numerical values that describe some aspect of a system at a specific point in time (e.g. CPU utilization percentage, available memory, disk IOPS). Metrics are stored in a lightweight time-series database ideal for real-time dashboards and instant alerting rules. 2) Logs: complex event records, trace logs, and activity records stored in a centralized Log Analytics workspace, queryable using Kusto Query Language (KQL). Application Insights is an APM (Application Performance Monitoring) feature of Azure Monitor that tracks live web application performance, uncaught exceptions, and user page load bottlenecks. Common confusion: Metrics are lightweight numerical snapshots for quick alerts; Logs are detailed structured text records for deep troubleshooting.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Azure Service Health and Resource Health',
            body: 'Azure Service Health provides personalized alerts and guidance when issues in Microsoft Azure services impact your specific workloads. It consists of three views: 1) Azure Status: global status page showing public service outages across all Azure regions worldwide. 2) Service Health: a personalized dashboard showing planned maintenance, service incidents, and health advisories that specifically affect the services and regions your active subscriptions use. 3) Resource Health: personalized diagnostics on the availability and health of individual deployed resources (e.g. indicating whether a specific VM is healthy, degraded, or stopped due to host platform maintenance). Common confusion: Azure Status is generic and public; Service Health is personalized to your active subscription assets.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-management-tools-and-arm',
        title: 'Management Tools: Portal, CLI, PowerShell & ARM/Bicep',
        summary: 'Managing cloud infrastructure via GUI, command line, scripting, and declarative Infrastructure as Code (IaC).',
        key_terms: ['Azure Portal', 'Azure CLI', 'Azure PowerShell', 'Cloud Shell', 'ARM Templates', 'Bicep', 'IaC'],
        analogy: 'Baking bread: The Azure Portal is manually mixing flour and baking in an oven by hand; ARM Templates and Bicep are programming an automated industrial bakery machine where you insert the recipe file and it bakes 1,000 identical loaves with zero human error.',
        sort: 8,
        chunks: [
          {
            title: 'Azure Management Tooling: Portal, CLI, PowerShell, and Cloud Shell',
            body: 'Azure provides diverse tools to create and manage cloud infrastructure: 1) Azure Portal: a web-based graphical user interface (GUI) console accessible in any browser, ideal for visual resource exploration and manual configurations. 2) Azure CLI: a cross-platform command-line tool written in Python that can be installed on Windows, macOS, and Linux to run bash-friendly commands (e.g. "az vm create"). 3) Azure PowerShell: a collection of cmdlets (the Az module) that runs cross-platform on PowerShell 7+ on Windows, macOS, and Linux for programmatic automation. 4) Azure Cloud Shell: a free, browser-accessible command-line terminal hosted inside the Azure Portal that runs in a temporary container with your choice of Bash or PowerShell pre-authenticated. Common confusion: Azure CLI and Azure PowerShell produce identical infrastructure results; you can choose based on personal command-line preference.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Infrastructure as Code (IaC): ARM Templates and Bicep',
            body: 'Infrastructure as Code (IaC) is the practice of managing and provisioning cloud resources through declarative definition files rather than manual portal clicks. Azure Resource Manager (ARM) templates are declarative JSON files that specify the resources, configurations, and dependencies for your deployment. ARM templates are idempotent: deploying the same template repeatedly ensures that if resources already exist in the defined state, no duplicate resources or unexpected changes occur. Bicep is a modern domain-specific language (DSL) created by Microsoft that provides clean, readable syntax, type safety, and automatic dependency management for authoring ARM templates without verbose JSON boilerplate. Bicep compiles directly into standard ARM template JSON before deployment. Common confusion: Bicep is not an alternative cloud engine; it is a cleaner syntax layer that compiles directly to ARM JSON templates.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'compliance-purview-and-trust',
        title: 'Compliance: Microsoft Purview, Trust Center & Privacy',
        summary: 'Unified data governance and compliance risk management through Microsoft Purview and the Service Trust Portal.',
        key_terms: ['Microsoft Purview', 'Data Governance', 'Service Trust Portal', 'Data Classification', 'Compliance'],
        analogy: 'National archives and audit commission: Microsoft Purview is the chief auditor and cataloger stamping confidential stamps on top-secret state dossiers, mapping where sensitive data lives, and making sure files comply with statutory laws.',
        sort: 9,
        chunks: [
          {
            title: 'Microsoft Purview Data Governance and Classification',
            body: 'Microsoft Purview is a family of unified data governance, risk management, and compliance solutions that help organizations gain visibility into their entire data estate across on-premises, multi-cloud, and SaaS locations. Purview automates data discovery by scanning Azure SQL databases, Cosmos DB, and Blob Storage, cataloging metadata, and applying sensitive information types (such as passport numbers, national ID numbers, and credit card credentials). This automated data classification ensures companies comply with global regulations such as GDPR and local African data protection laws (such as the Kenya Data Protection Act). Common confusion: Purview does not move or duplicate your actual data; it scans and indexes metadata and classification tags.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Microsoft Trust Center and Service Trust Portal',
            body: 'The Microsoft Trust Center is a public-facing informational portal that details Microsoft’s core commitments regarding security, privacy, compliance standards, and ethical data handling across all commercial cloud services. It articulates Microsoft’s principle that customer data belongs exclusively to the customer and is never used for advertising. The Service Trust Portal (STP) is a companion companion site that provides authenticated access to independent third-party audit reports (such as SOC 1, SOC 2, ISO 27001), regulatory compliance guides, and security whitepapers. Organizations provide these official audit documents to banking regulators, internal risk committees, and external compliance auditors. Common confusion: The Trust Center contains public marketing and policy overviews; the Service Trust Portal provides downloadable, audited compliance reports and certifications.',
            source_note: 'Draft, needs human review'
          }
        ]
      },
      {
        slug: 'azure-advisor-recommendations',
        title: 'Optimization: Azure Advisor',
        summary: 'Personalized cloud consultant analyzing resource telemetry across Reliability, Security, Performance, Cost, and Operational Excellence.',
        key_terms: ['Azure Advisor', 'Reliability', 'Security', 'Performance', 'Cost Optimization', 'Operational Excellence'],
        analogy: 'A trusted agricultural extension officer: Azure Advisor visits your farm, inspects your tractor and irrigation pumps, and tells you: "Your pump is running 24 hours a day even when it rains—turn it off at night to cut electricity bills in half, and buy a backup fan before the engine overheats."',
        sort: 10,
        chunks: [
          {
            title: 'Azure Advisor Five Pillars of Recommendations',
            body: 'Azure Advisor is a personalized cloud consultant built directly into Azure that analyzes your deployed resource configurations and operational telemetry to provide actionable, best-practice recommendations. Advisor evaluates infrastructure across five core pillars: 1) Cost: identifies idle or underutilized resources (such as virtual machines with less than 5% CPU utilization over 14 days) and suggests resizing or shutting them down to reduce monthly bills. 2) Security: integrates directly with Microsoft Defender for Cloud to highlight vulnerable configurations and missing security controls. 3) Reliability: detects single points of failure and recommends deploying resources across Availability Zones. 4) Performance: detects database bottlenecks and suggests index optimizations. 5) Operational Excellence: recommends deployment automation and process improvements. Common confusion: Azure Advisor provides automated recommendations and potential dollar-saving estimates, but it never automatically deletes or resizes resources without explicit administrator authorization.',
            source_note: 'Draft, needs human review'
          },
          {
            title: 'Advisor Score and Operational Excellence in Africa',
            body: 'The Azure Advisor Score is a quantitative metric ranging from 0% to 100% that reflects how closely your deployed cloud environment aligns with Microsoft Azure best practices. You can review your overall score or drill down into individual category scores for Cost, Security, Reliability, Performance, and Operational Excellence. By implementing high-impact recommendations (such as enabling backup on production SQL databases or purchasing reserved instances for always-on VMs), your Advisor Score improves. For organizations across Africa with constrained IT budgets, reviewing the Advisor Cost score weekly helps identify forgotten test VMs or oversized storage tiers, freeing up capital for strategic expansion. Common confusion: A 100% Advisor Score does not guarantee zero security breaches; it signifies adherence to baseline automated best practices.',
            source_note: 'Draft, needs human review'
          }
        ]
      }
    ]
  }
]

const outputPath = path.resolve(process.cwd(), 'src/data/az900-seed.json')
fs.writeFileSync(outputPath, JSON.stringify({ domains }, null, 2), 'utf-8')

let totalTopics = 0
let totalChunks = 0
for (const domain of domains) {
  totalTopics += domain.topics.length
  for (const topic of domain.topics) {
    totalChunks += topic.chunks.length
  }
}

console.log(`Generated seed data successfully!`)
console.log(`Domains: ${domains.length}`)
console.log(`Topics: ${totalTopics}`)
console.log(`Chunks: ${totalChunks}`)
