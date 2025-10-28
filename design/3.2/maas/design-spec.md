# Models-as-a-Service (MaaS)

Target version: 3.1
UXD Orientation doc: https://docs.google.com/document/d/10IIWRpETdRIDzQiPIvHSzCBj3bwq02fE0mGOEtVwjBw/edit?tab=t.0
NotebookLM: https://notebooklm.google.com/notebook/7c5d493a-85b8-438d-b1d9-aeab507c63a7
Journey map: https://miro.com/app/board/uXjVIgQDVWw=/

## PRD

### Features

- API Gateway
-- Support external AI providers (e.g. OpenAI, Anthropic)
-- Support internal model inference server endpoint providers
- Token Validation
- API Keys list
-- One key can span multiple models, assets
-- One key might be scoped to a single model too (unsure)
-- Key management (list with columns for name, secret key value, date created, date last used, created by user, permissions)
- Usage Tracking
-- Requests per time period (1 hour, 24 hours, 7 days, 30 days, 1 year, custom range)
-- Tokens per user
-- Tokens per group
-- Tokens per key
-- Top consumers (per key)
- Observability
-- Link to view more detailed dashboards in Perses
-- Runtime: latency, GPU utilization, tokens per second
- Rate Limiting
-- Max tokens per minute
-- Max responses per minute
-- Max tokens per time period
- Security Enforcement
- Perses-based dashboards
- Administration User Interface
- Chargeback
- SLO-based workload management (dynamic routing using llm-d's intelligent scheduler)
-- Tenant Management
-- Usage Analytics / Observability
- Governance
-- Policies
--- Quality tiers
--- Over-limit behavior (soft throttle, hard throttle)
--- Date-based quota renewals
-- RBAC-based access to users/groups
-- Audit trails
-- Tenancy model that security team trusts
- GitOps configuration

### API Assets Features

- New "Add Asset" button to add a model

## Design

### Design Philosophy

The AI Assets area contains all “as‑a‑service” offerings that are available through the platform. It targets engineers and developers who need a quick, safe, ready‑to‑consume endpoint without having to understand the underlying infrastructure. The UI is intentionally simple for non‑experts but encourages best practices: every MaaS endpoint is routed through an API gateway that enforces API‑key authentication, provides observability, monitoring, and chargeback, and allows key revocation if a compromise occurs. This cautious default can be extended to future services such as MCP servers and Agents-as-a-Service, ensuring consistent security and operational controls across the AI Assets catalog.

### API Keys page

The API keys page is located within the Settings area of the left nav above User management.

The page title is "API keys" wiht a description of "Browse endpoints for available models and MCP servers."

The page includes a primary action button of "Create API key" and then a table showing all API keys. The table has columns for Name, API Key (e.g. sk-1234...), Assets (e.g. model names), and Owner (e.g. User, Service Account, Group).

Clicking "Create API key" reveals a modal with a form inside it to create a new API key. The form has fields for:
* Name (required)
* Description (freeform text box to "Describe the key's purpose)
* Owner (dropdown for User/Group/Service Account, and a dropdown to the right of it to select an actual username/group name/service account name)

It also includes a collapsible section (collapsed by default) for "Limits and Policies. When expanded this section has options to set:
* Token rate limit (tokens per minute)
* Request rate limit (requests per minute)
* Budget limit
* Expiration date

The last section of the modal for "AI Asset Access" provides a few multi-select dropdowns to let users select from lists of:
* Model Endpoints
* MCP Servers & tools
* Vector Databaes
* Agents

### API Key Details page

The API key details page has the name of the key at the top and a partially-hidden key that's copyable below it.

The page has five tabs:
* Details
* Assets
* Metrics
* Policies
* Settings

#### Details tab

The Details tab has a Description List that includes the key's:
* Name
* Description
* API key (partially-hidden and copyable)
* Date created
* Date last used

#### Assets tab

The Assets tab includes collapsible sections for the AI Assets that the API key enables access to. Each section has a table showing the assets of that type that are available:
* Models (with columns for Name, ID, and Endpoint)
* MCP Servers & tools (with columns for Name, Tools, and Endpoint)
* Vector Databases (with columns for Name and Size)
* Agents (with columns for Name and Endpoint)

For the models list, include examples like gpt-oss-20b and granite-3.1b.

For the MCP servers list, include examples like OpenShift, RHEL, Ansible.

#### Metrics tab

The Metrics tab includes various metrics and charts that help the API key owner better understand how the key is being used.

The top of the tab includes a controls area with a dropdown for "Time range" (e.g. 24 hours, 7 days, 30 days) and a link to "View Perses Dashboard"

Below those controls are cards (in a flexbox row) for:
* Total Requests
* Success rate (e.g. 98.2%)
* Total Tokens
* Total Cost

Below these cards is a fulldwidth card with a graph showing the "Total Requests."

#### Policies tab

This tab includes all policies, limits, controls, and constraints that are imposed on the API key.

It includes a table with the Names, IDs, and Descriptions of policies that have been applied by the Platform team. Policy IDs should be all lowercase with dashes for spaces like "devs-rate-limit-standard" and "devs-budget-standard."

#### Settings tab

This tab includes a "Danger Zone" card with a red action button to permanently delete the API key. If a user clicks the delete button a modal should appear to confirm that they want to delete the key, with a text field to type in the key's name manually and then "Confirm" to delete the key.

### Policies page

The Policies list/table page should be located in "Settings" in the left nav, below "User management." It should be a table page similar to the others, with columns for Name, Description, Status (Active or Inactive), Targets (e.g. Group names) and Rules (e.g. Token limit, Rate limit, Time limit).

### Create policy

A primary button to "Create policy" should be available on the Policies list page. Clicking it should display a PatternFly 6 modal similar to the others.

The modal should include fields for Name (required) and Description (optional).

Then a section heading for "Available assets" should have dropdowns similar to the ones from the "Create API key" modal for "Models" and "MCP Servers & tools". By default both dropdowns should be set to "All" (meaning they aren't restricting anything).

Then a section heading for "Limits" should display fields for

- Token limit (i.e. # tokens per # [time range like minute, hour, day]
- Rate limit (i.e. # requests per # [time range like minute, hour, day])
- Time limit (i.e. None or Start & End time controls)

Then a section heading for "Targets" that has multi-select dropdowns for "Groups" and "Users" and "Service Accounts" with some options in each.

The descriptive text for the Groups dropdown should say "This policy will apply to all users in these groups."

#### Policy Details page

The Policy Details page should have a tab for Details, which displays all of the details that were captured in the "Create policy" modal.





## Implementation Details

### Routing
- API Keys list page: `/settings/api-keys`
- API Key details page: `/settings/api-keys/:keyId`
- API Key details with tab: `/settings/api-keys/:keyId/:tab` (optional, defaults to Details tab)

### Data Management
- Use mock/dummy data for prototype
- Use appropriate local state management (React hooks/context as needed)
- No external API integration required

### User Experience
- After creating an API key, navigate user to the newly created key details page
- Delete confirmation modal should show the exact key name in plain text above the input field for easy copy/paste
- Use PatternFly Victory charts for the Metrics tab visualizations

### Mock Data Requirements
- Create realistic sample data for models (include examples like gpt-oss-20b, granite-3.1b)
- Create realistic sample data for MCP servers (include examples like OpenShift, RHEL, Ansible)
- Create realistic mock policy data for API gateway/MaaS policies in the Policies tab
- Include appropriate sample metrics data for charts and statistics