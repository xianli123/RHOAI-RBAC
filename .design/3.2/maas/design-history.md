# Design History

This file contains information that will be summarized in Apollo's History tab and available to the AI Assistant to answer questions about the history of this design.

In the future an AI workflow should automatically suggest updates to this file based on recent commits, relevant discussions in stakeholder meeting transcripts, and more.

## History

2024-11-25
- UI MaaS Kickoff meeting
- Recording: https://drive.google.com/file/d/1ieSuDXqJctsVa635dbOvNAG6Nyo9UeeM/view
- Chat: https://drive.google.com/file/d/1F9XEe_KbVf8lsTIX1mrzeoUz_v-cKy8D/view
- Gemini notes: https://docs.google.com/document/d/1CDNcuzp5mC3JHiBcYK_4KBWM-_BtdMyOxV2cC7BJkvk/edit?tab=t.prd8h459zps5
- During this meeting Andrew Ballantyne walked through the scope of the "MaaS Admin UI" (primarily Tiers and API Keys) for 3.2/3.3 with the Zaffre team, using the UXD prototype to help guide the discussion and visualize what we needed to build in the upcoming sprints. This was the culmination of many meetings and discussions and design updates captured in this history file. Some details and role/permission-related open questions remain around Tiers and how they're configured, but the broad strokes of the experience and the backend APIs required to power them are more settled now for 3.2/3.3.
- UX-wise the biggest gap right now is what the AI asset endpoints experience will be like in 3.2/3.3 after the recent decisions to make "MaaS models" the only ones shown on that page, and how the new Tier system and API key capabilities may impact the experience we shipped in 3.0. UXD will meet and iterate on that area tomorrow to help future conversations across the Zaffre & Crimson UI teams, and various PMs.
- A few prototype updates to make based on the discussion:
- [ ] The microcopy of the "Create tier" page and maybe a ? icon in the Limits column of the Tiers list should clarify that these limits are applied to inividual users as they connect to endpoints, rather than across the entire group of users.
- [ ] In the "Create tier" form, the Groups field should reuse an existing component that exists elsewhere already within the Console (somewhere in Settings I believe, it supports typeahead search and also specifying group names manually, it was shown off somewhere in the recording but it's also in one of the demo clusters)
- [ ] In the Tiers list page, add the ability to sort the columns

2025-11-24
- Met with Andrew Ballantyne and Celestine Tan to discuss some additional design updates for 3.2/3.3 based on latest understanding of what's doable in the backend. It was unfortunately not recorded but the list of updates to the prototype that we agreed upon are below.
- [x] In the Deploy Model Wizard -> "Make available as an AI asset" checkbox, we should display a dropdown below it when checked that lists the different Tiers that are available from the Tiers list, with a description below it saying that the model will be made available to users who can access this Tier. The last option of the dropdown should be "Custom..." and selecting that option should then display a new plain text field box for "Custom tier" below the dropdown field with a description below it saying to enter the exact names of the tiers (comma separated) that they would like the model to be available to.
- [x] In the Tiers list, the kebab menu item to "Edit tier" should instead go to a page that's identical to the "Create tier" page/form but the title of the form should be "Edit tier" and the values of the tier that was selected should populate into the form's fields. You should probably reuse the existing "Create tier" page/form and add some logic to show either Create or Edit at the top based on where the user clicks from.
- [x] In the Tiers list, add a kebab menu action at the bottom to "Delete tier" which should open up a new "Delete tier" modal (make it as a new tsx file) that should be very similar to the other delete modals asking the user to write the name before enabling the delete button and warning them that this could affect any apps that are using API keys associated with this Tier.
- [x] In the Tier Details page, include a secondary "Actions" button in the top-right aligned with the Tier name. It should have actions to "Edit tier" (clicking that button should go to the "Edit tier" form) and "Delete tier" (which should surface the "Delete tier" modal)
- [x] In the Tier Details page, remove the YAML tab entirely
- [x] In the "Create Tier" form, remove the section for "Default expiration"
- [x] In the "Create Tier" form, for the token and request rate limit sections, both of those should support specifying the quantity of time units, so like "[textbox] tokens per [textbox] [time unit dropdown]" and "[textbox] requests per [textbox] [time unit dropdown]"
- [x] In the "Create Tier" form, for both the token and request rate limit sections, we should support the ability to add additional rows basically using the PatternFly Field Builder examples from here: https://www.patternfly.org/component-groups/helpers/field-builder/

2025-11-24
- Made a variety of updates to the 3.2/3.3 prototype based on recent discussions about what's viable in that timeframe. API Key management is now simplified.

2025-11-24
- Title: MaaS in RHOAI Tech Preview Refinement
- Doc: https://docs.google.com/document/d/1HOKOSg1Ueh3MiM0NtWu87LdFKWKs2h05EjZX9Z-aq7g/edit
- We reviewed the intended scope and technical viability of MaaS-related features of the OpenShift AI Dashboard for 3.2/3.3
- One gap identified was the ability to see which Tiers a particular model / AI asset was available through. This would likely be included in a Model Details page which is being worked on separately, likely something for 3.4

2025-11-18
- Title: MaaS Team Sync
- [Gemini notes](https://docs.google.com/document/d/10wMJYU24BNtVZFPksrfaVpTndEGXGPbxNpaF_kPlpoU/edit)
- The ability to display a list of keys in the UI is dependent on named tokens as a potential fix using Kube secrets for now https://github.com/opendatahub-io/maas-billing/pull/222
- Seems like Tiers might be doable for now though

2025-11-17
- Iteration 3 of design, incorporating some of the recently-discussed changes around focusing management on Tiers rather than Policies (which are lower-level) and Keys (which we may not be able to list our in 3.2/3.3)
- The models that are available to any given key are inherited from the associated Tier
- The default expiration date for keys is currently 4 hours and not configurable
- All keys can be cleared from the AI Assets page, but we may not be able to list them
- Added "At risk" badges to the API Keys and Policies nav items since we might not show them in 3.2/3.3

2025-11-12
- Title: MaaS "10k Foot High" Sync
- [Gemini notes](https://docs.google.com/document/d/1U8-ceJc9l6ni8D9yT1iiSJ3hDIwY0EsKPPdCRS5yRGM/edit)
- [MaaS Coordination doc](https://docs.google.com/document/d/1aKyE3KC29v1ndWFqLfAp533eb04JPCYkBL8iHShV08E/edit)
- AI Summary:
  - Targeting 3.3 for deliverables
  - Policy management (editing YAML for token rate limit policies and rate limit policies) could serve as initial admin UI with GitOps-friendly approach
  - The CRD-based API for Tiers isn't available yet so we may not want to build a UI for them yet, right now they're ConfigMap-based
  - Current API keys are ephemeral and disappear after creation (cannot list or retrieve later); can invalidate all keys at once but not individual keys
  - Key metadata being considered for 3.3 to be able to create the API Keys list (not committed for 3.2); user can specify time-to-live when generating keys (subject to cluster admin maximum)
  - Quota data for endpoints screen depends on RHCL team providing information first; usage reporting currently handled via custom Grafana dashboard
  - VLM-backed LLM inference services technically possible but currently limited/unsupported feature through gateway API
  - Chargeback is on the roadmap but not a current priority

2025-11-11
- Title: RHOAI RHCL Demo and Sync
- [Recording](https://drive.google.com/file/d/14mYJ9sBBEBnsg2iZbK7U80Yd32fBcD5V/view)
- [Chat](https://drive.google.com/file/d/1onAGJZwgh-JGb4Rg4Np1RqGKEpLieLoU/view)
- [Gemini notes](https://docs.google.com/document/d/1EKJHL7SGzQAo-44V2RutqMBkF6uxHeMYBf-IE6NpfnY/edit)
- [Discussion document](https://docs.google.com/document/d/1CkUswEamgV7uJNlP5wS6_u1evtz_-WvkE7I_JMI1rqk/edit)
- [RHCL journey map and conceptual model](https://miro.com/app/board/uXjVJ72-WlQ=/)
  - Note the mention of a "Plan Policy" connecting policies to groups of users, very similar to what the MaaS Team has been discussing so far
  - This was a critical finding and something we raised with the MaaS ENG group to make sure that everyone was aware of this WIP API from RHCL with very similar goals

2025-11-10
- MaaS Admin UI - Feature Refinement
- [Recording](https://drive.google.com/file/d/1G3ID8z7sdsqkKIo9bvn_ZjpFWoacqoDc/view)
- [Chat](https://drive.google.com/file/d/1jHn0SNFiH0hDNN0EFBpnn0z2LdcKP_Y2/view)
- [Gemini Notes](https://docs.google.com/document/d/1fkBjRRibGlrJTIUmxPIvYicnWpSfAGCnMdadqbfWZmE/edit)
- [Feature Refinement-RHOAISTRAT-638-MaaS Admin UI](https://docs.google.com/document/d/1ApBP2VcMUELEY0lIx6M5761oHmjEdpKwvMpivIUZD7A/edit)
- AI Summary: 
  - Refinement covered two main UI pages: tier management (renamed from "policies") and API key creation/listing for AI developers
  - MVP tier creation scope includes: defining associated models, token/rate limits, assigned groups, tier name/description, and viewing existing tiers from dashboard
  - API key limitations: keys are ephemeral (not persisted), can only revoke all keys (not individual ones), no metadata storage for listing/deleting individual keys, and expiry defaults to 4 hours (set at creation time, cannot be modified later)
  - Rate limiting is per user (not per API key); if a user belongs to multiple tiers, their highest-level tier applies
  - Models listing will show one consolidated list across all models the user can access; simplified approach proposed to limit to premium/free tier setup with all models accessible in all tiers
  - UI implementation may need to manage updates to multiple resources (config maps, policies) if operator/CRD approach isn't ready; follow-up meeting scheduled to confirm revised scope 

2025-11-06
- Show MaaS usage in AAE UX sync
- [Gemini notes](https://docs.google.com/document/d/1FEaBd7WDnatgAJTCei0Fp4OsrCQKvffgnJz5sRhA2QE/edit)
- Discussed admins creating 'tiers' that define models and rate limits (token limit and rate limit), which are then associated with groups of users (Kubernetes groups) (00:12:14). A single tier's rate limit applies across all users and models within that tier (00:13:24). Even though Tiers are associated with groups, each user within that group is assigned an individual quota (e.g., 10,000 tokens) (00:15:43).
- Stakeholders confirmed that the tier defines the business logic and policy, while the Kubernetes group serves as the mechanism connecting the policy (tier) to the user (00:17:27). A user can belong to multiple tiers and thus have multiple quotas for the same model if it is included in those tiers (00:21:19).

2025-11-04
- MaaS Stakeholders Sync
- [Gemini notes](https://docs.google.com/document/d/1hq1mVnemiBNQ1QXJhnC2c-ABE9hG3k2zRPqBMh1OcTo/edit)
- Admin UI and Entity Relationship Finalization: The MaaS Admin UI team is bootstrapping and requires clarity on the MVP features and timeline for 3.2/3.3, but the backend for frontend for APIs will be needed (00:27:10). Stakeholders suggested that finalizing entity relationships should be a good deadline for TP. The team agreed that tier management and the domain model need improvement, especially to address flexibility requirements from early engagements (00:29:09).
- Policy Changes and API Stabilization: The group agreed that policy changes and tier management might be out of scope for the short 3.2 timeline, which is focused on stabilization (00:38:06). The team emphasized the need to stabilize the API first before building features like GitOps or dashboard integration (00:33:30).
- Engineering Objectives and Iterative Approach: concluded that the engineering objectives for 3.2 are focused on user experience hardening, integration with the MaaS Admin UI/dashboard team, and enabling GitOps, while 3.3 will be stabilization and fixing issues from 3.2 (00:51:04).
- VLM Usage in Dashboard: confirmed a Jira issue to enable MAZ for general VLM usage in the dashboard, noting it is a quick win for 3.2 as it primarily involves adding a UI option, as the backend is not a limiting factor in this specific case (00:55:26).

2025-11-03
- Model Serving PM/ENG/UX Sync meeting
- [Recording](https://drive.google.com/file/d/1Se9koq8yJuGMb5AYEY6WNSHuPAFMdquP/view)
- [Gemini notes](https://docs.google.com/document/d/1CVXHlwBlvqlySCE5nHqgdL0LIYaKlMfmcCuD2NyL_q0/edit)
- [Chat](https://drive.google.com/file/d/1EPDl_RmdbBgMkGkvmy0jLVkXj5QZbHWc/view)
- Summary: Discussed 3.3 release readiness and MaaS feature prioritization. Key MaaS topics included: technical architecture needs (BFF, Golang skills), scope of AI Assets Endpoints page (will list only MaaS models), API Keys page feasibility, policy management challenges, RBAC implementation complexity, and defining personas for curating MaaS models. Open questions remain around subscriptions and reliance on OpenShift console for admin tasks.

2025-10-30
- Iteration 2
- Moved the expiration date in the "Create API Key" modal to the main form, making it more visible since it's likely to be used
- Removed the "Limits and Policies" expansion from the Create API Key modal; there's a possible use case for an AIE to restrict themselves further than what the default policy imposes, but per stakeholder discussion it probably isn't essential for now. We'll revisit this in the future once we get budget controls available, which is the most likely time that a user would want to self-impose a restriction like this.

2025-10-27
- Confirmed with MaaS PM that user management and cost-related functionality is out of scope for 3.2/3.3 for now, despite their mention in the 3.0 Jira.

2025-10-23
- Reviewed MaaS iteration 1 work with Field team
- [Recording](https://drive.google.com/file/d/1qqv2Ja4bT4H23DvKf3w6iSs0o1-34pYT/view)
- [Chat](https://drive.google.com/file/d/1GAYii0Bji67Mrd5qNhZrrM2TU41sZqbv/view)
- [Gemini notes](https://docs.google.com/document/d/12txTp0Jryo0yzCMhbQ9OLPbZ1PJTlyKmCn0Q0t7jhAQ/edit)
- TODO: synthesize this feedback into prototype updates

2025-10-16
- Reviewed MaaS iteration 1 work at RHOAI UX Forum
- [Recording 1 focused on Observability](https://drive.google.com/file/d/1Nu-eZtYCARpqEi_VBQjfmlnZKiPKow3P/view)
- [Recording 2 focused on MaaS Admin](https://drive.google.com/file/d/16zOf70_oN5sgkPW3bs1bi9ooNMNBuyqd/view)
- We collected feedback from Field-facing teams, need to synthesize this feedback into updates
- TODO: synthesize this feedback into prototype updates
- The "Add asset" modal should include the ability to only make it available to certain groups or users. Not wide open to everyone. Some users may want to only share with certain others.

2025-10-15
- Reviewed MaaS iteration 1 work at Gen AI Studio UX Stakeholder Sync
- [Recording](https://drive.google.com/file/d/1u6d9W7zFMJMUvXbjiBTPGGuNREt1B42Z/view)
- [Chat](https://drive.google.com/file/d/1WlZqQM18p28ehRHP3umBwoIkX-qX-py0/view)
- [Gemini Notes](https://docs.google.com/document/d/1jEoMUuy99ei6iVClLttCQYOMDh0IeMM_KjP88TzH5PE/edit)
- TODO: synthesize this feedback into prototype updates

2025-10-13
- Fix the Delete API Key modal to follow PatternFly 6 modal documentation patterns
- On the API Keys page, display a PatternFly 6 dropdown very similar to the ones in the Registry page with options to "View details" or "Delete API key" (which should activate the same Delete API Key modal)
- Add a column for "last used" to the API Keys page (as the last column) to show the last time the key was used
- Add a column for "status" to the API Keys page (in the second position, right after name) with status options for Active, Expired, or Disabled
- In the Policies tab of API Key Details pages, add a column to the table for "Type" and include examples for the various policy types of Kuadrant.io (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy)

2025-10-07
- Added navigation icons to left nav, some may need adjustments

2025-10-05
- Created initial design for Policy management, based on prior work

2025-10-02
- RH AI UX Field Feedback Call
- [Recording](https://drive.google.com/file/d/16zKWm_Av_zUmsJIdTIJ043o0jS5To-DZ/view)
- [Gemini notes](https://docs.google.com/document/d/1CafyfZI28WSV75R-IMszxjaOSFV4QzmkYMKtlwIBqmU/edit)
- API Gateway vs. Direct VLM Access - Andy discussed the future of API gateways and their integration with OpenShift AI, anticipating that keys and tracking will be integrated. A stakeholder pointed out that some customers prefer not to use API gateways due to extra configuration, utilizing a vLLM middleware solution for logging instead. Andy inquired whether most customers would lean towards API gateways or the direct VLM method.
- Distinction Between Models and Models as a Service - Andy initiated a discussion about simplifying the user experience by potentially removing the distinction between "models" and "models as a service" in future versions, aiming for a single "models" tab where all models are available as a service, ideally behind an API gateway. A stakeholder supported this simplification, stating that from a user's perspective, it's just a model, and the "mass" (models as a service) is an implementation detail.
- Namespace Scope and User Permissions - A stakeholder questioned the real-world use cases for namespace-scoped models, suggesting that perhaps all models in AI assets should exclusively use "models as a service". Another stakeholder countered that namespaces still serve to organize workloads, even with API gateways, and emphasized the need for granular access controls to ensure users can only interact with models they are authorized to use.

2025-10-01
- GenAI UXD Stakeholder meeting
- [Recording](https://drive.google.com/file/d/12xsK-eEHY17jKlL1dhIt_GFZXjg3-4H4/view)
- [Gemini notes](https://docs.google.com/document/d/1Z4Zk-PNg24z1immh4eK6fJyYKuALc0CbB3-leUKc82s/edit)
- After some discussion there seems to be general agreement that in 3.2 we'll try to move in the direction of everything in AI Assets being available as a service and operate behind an API Gateway, rather than 3.0's experience where non-gateway'd models are also technically "available" but perhaps not with the same level of control or observability that provides the best experience to AI Engineers who simply want to consume model endpoints to their heart's content. Guiding GUI users to adopt an API Key-based approach has security, management, and observability implications that are worth encouraging. There may be a subset of use cases where a user might want to share a model endpoint within the same namespace without publishing it for others to discover and consume, but an opinionated AI Assets area doesn't prevent users with the know-how from navigating to the Model Deployment Details pages of the ones they have access to and getting the raw endpoints from there.
- We also discussed allowing admins to bring in their own external AI inference providers (e.g. OpenAI) into the platform for others to consume. This would likely be done using either the existing Connections mechanism or from the AI Assets page in a new "Add Asset" form/wizard. API Keys from the API gateway could then sit in front of that endpoint, providing more granular per-user and per-group controls and visibility.

2025-10-01
- AI Engineer Research Readout Prioritization discussion
- [Recording](https://drive.google.com/file/d/1lDn2g3zpsfXSYHaxFmTYE31EpSBMWVZO/view)
- [Miro](https://miro.com/app/board/uXjVJHTHUYI=/)
- 14:00 we have an open issue around cost management / chargeback for that need. This would require one key per user per model though to be able to do that kind of cost tracking. NVIDIA operator supports some cost estimation with GPUs. Stakeholders believe it's a dangerous game for us, maybe showing total cost of ownership over a longer time period is better, SaaS providers are currently eating costs, dollar values can be difficult. Cost per token and things is possible though.
- 23:00 AI Engineers desire to bring their own key to the AI Playground from external model providers. We still have an open question around whether AI Platform Engineers would allow this given the risk of data exfiltration. This would probably be done somewhere within the AI Assets area.

2025-10-01
- Red Hat AI What's New / What's Next
- [Slack thread](https://redhat-internal.slack.com/archives/C069RL35Q6R/p1759333775691449?thread_ts=1759332632.294329&cid=C069RL35Q6R)
- Confirmation that RHCL will be included with RHOAI for the MaaS use cases specifically to provide the integrated user experience being designed here. Using RHCL for other things will require its own subscription. We'll support using external third party gateways with documentation based on customer demand in Q1 2026.

2025-09-24
- [Recording](https://drive.google.com/file/d/1_fN9-v_M_7xrsn_zGOFa-VCyMbt8zarG/view)
- AI Engineering All Hands demo of Citi Bank's AI-related needs, including items around MaaS

2025-09-24
- Iteration 1 created
- Created the first iteration of this design using the blank PatternFly starter codebase.
- During the MaaS Stakeholder meeting we discussed whether API Keys should really be found within the Settings nav item, and folks wondered whether the "Gen AI Studio" as a whole should really even be in RHOAI to begin with. Andy moved API Keys into the Gen AI Studio section for now to see what people think of it there. Even though keys can be used for Admin-ey actions, they can also be used by AIEs who want to easily find and manage their keys for their various apps and services. The ability to see which Assets are available to a key, and easily accessing the endpoints for every Asset from within the Key Details page, also seems to be valuable and what alternatives like LiteLLM focus on. This area feels worth moving outside of Settings for those reasons.
