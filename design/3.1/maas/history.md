## Design History

This file contains information that will be used to populate the History tab of Apollo and provided as context to the AI Assistant to answer questions.

2025-10-16
- Reviewed MaaS iteration 1 work at RHOAI UX Forum
- Recording 1 focused on Observability: https://drive.google.com/file/d/1Nu-eZtYCARpqEi_VBQjfmlnZKiPKow3P/view
- Recording 2 focused on MaaS Admin: https://drive.google.com/file/d/16zOf70_oN5sgkPW3bs1bi9ooNMNBuyqd/view
- We collected feedback from Field-facing teams, need to synthesize this feedback into updates

2025-10-15
- Reviewed MaaS iteration 1 work at Gen AI Studio UX Stakeholder Sync
- Recording: https://drive.google.com/file/d/1u6d9W7zFMJMUvXbjiBTPGGuNREt1B42Z/view
- Chat: https://drive.google.com/file/d/1WlZqQM18p28ehRHP3umBwoIkX-qX-py0/view
- Gemini Notes: https://docs.google.com/document/d/1jEoMUuy99ei6iVClLttCQYOMDh0IeMM_KjP88TzH5PE/edit?tab=t.qfvlx7uu9b8c
- We need to synthesize this feedback into prototype updates

2025-10-13
- Fix the Delete API Key modal to follow PatternFly 6 modal documentation patterns
- On the API Keys page, display a PatternFly 6 dropdown very similar to the ones in the Registry page with options to "View details" or "Delete API key" (which should activate the same Delete API Key modal)
- Add a column for "last used" to the API Keys page (as the last column) to show the last time the key was used
- Add a column for "status" to the API Keys page (in the second position, right after name) with status options for Active, Expired, or Disabled
- In the Policies tab of API Key Details pages, add a column to the table for "Type" and include examples for the various policy types of Kuadrant.io (AuthPolicy, RateLimitPolicy, TLSPolicy, DNSPolicy)

2025-10-07
- Added navigation icons to left nav, some may need adjustments

2025-10-05
- Created initial design for Policy management, based on Noy's work so far

2025-10-02
- RH AI UX Field Feedback Call
- Recording: https://drive.google.com/file/d/16zKWm_Av_zUmsJIdTIJ043o0jS5To-DZ/view
- Gemini notes: https://docs.google.com/document/d/1CafyfZI28WSV75R-IMszxjaOSFV4QzmkYMKtlwIBqmU/edit?tab=t.9in1b8lmc9l4
- API Gateway vs. Direct VLM Access - Andy Braren discussed the future of API gateways and their integration with OpenShift AI, anticipating that keys and tracking will be integrated. Brian Ball pointed out that some customers prefer not to use API gateways due to extra configuration, utilizing a vLLM middleware solution for logging instead. Andy Braren inquired whether most customers would lean towards API gateways or the direct VLM method.
- Distinction Between Models and Models as a Service - Andy Braren initiated a discussion about simplifying the user experience by potentially removing the distinction between "models" and "models as a service" in future versions, aiming for a single "models" tab where all models are available as a service, ideally behind an API gateway. Li Ming Tsai supported this simplification, stating that from a user's perspective, it's just a model, and the "mass" (models as a service) is an implementation detail.
- Namespace Scope and User Permissions - Danielle Jett questioned the real-world use cases for namespace-scoped models, suggesting that perhaps all models in AI assets should exclusively use "models as a service". Brian Ball countered that namespaces still serve to organize workloads, even with API gateways, and emphasized the need for granular access controls to ensure users can only interact with models they are authorized to use.

2025-10-01
- GenAI UXD Stakeholder meeting
- Recording: https://drive.google.com/file/d/12xsK-eEHY17jKlL1dhIt_GFZXjg3-4H4/view
- Gemini notes: https://docs.google.com/document/d/1Z4Zk-PNg24z1immh4eK6fJyYKuALc0CbB3-leUKc82s/edit?tab=t.9ca9a4kc68ub
- After some discussion there seems to be general agreement that in 3.2 we'll try to move in the direction of everything in AI Assets being available as a service and operate behind an API Gateway, rather than 3.0's experience where non-gateway'd models are also technically "available" but perhaps not with the same level of control or observability that provides the best experience to AI Engineers who simply want to consume model endpoints to their heart's content. Guiding GUI users to adopt an API Key-based approach has security, management, and observability implications that are worth encouraging. There may be a subset of use cases where a user might want to share a model endpoint within the same namespace without publishing it for others to discover and consume, but an opinionated AI Assets area doesn't prevent users with the know-how from navigating to the Model Deployment Details pages of the ones they have access to and getting the raw endpoints from there.
- We also discussed allowing admins to bring in their own external AI inference providers (e.g. OpenAI) into the platform for others to consume. This would likely be done using either the existing Connections mechanism or from the AI Assets page in a new "Add Asset" form/wizard. API Keys from the API gateway could then sit in front of that endpoint, providing more granular per-user and per-group controls and visibility.

2025-10-01
- AI Engineer Research Readout Prioritization discussion
- Recording: https://drive.google.com/file/d/1lDn2g3zpsfXSYHaxFmTYE31EpSBMWVZO/view
- Miro: https://miro.com/app/board/uXjVJHTHUYI=/
- 14:00 we have an open issue around cost management / chargeback for that need. This would require one key per user per model though to be able to do that kind of cost tracking. NVIDIA operator supports some cost estimation with GPUs. Rob believes it's a dangerous game for us, maybe showing total cost of ownership over a longer time period is better, SaaS providers are currently eating costs, dollar values can be difficult. Cost per token and things is possible though.
- 23:00 AI Engineers desire to bring their own key to the AI Playground from external model providers. We still have an open question around whether AI Platform Engineers would allow this given the risk of data exfiltration. This would probably be done somewhere within the AI Assets area.


2025-10-01
- Red Hat AI What's New / What's Next
- https://redhat-internal.slack.com/archives/C069RL35Q6R/p1759333775691449?thread_ts=1759332632.294329&cid=C069RL35Q6R
- Confirmation that RHCL will be included with RHOAI for the MaaS use cases specifically to provide the integrated user experience being designed here. Using RHCL for other things will require its own subscription. We'll support using external third party gateways with documentation based on customer demand in Q1 2026.

2025-09-24
- https://drive.google.com/file/d/1_fN9-v_M_7xrsn_zGOFa-VCyMbt8zarG/view
- AI Engineering All Hands demo of Citi Bank's AI-related needs, including items around MaaS, Carl Mes walked through many topics

2025-09-24
- Created the first iteration of this design using the blank PatternFly starter codebase.
- During the MaaS Stakeholder meeting we discussed whether API Keys should really be found within the Settings nav item, and folks wondered whether the "Gen AI Studio" as a whole should really even be in RHOAI to begin with. Andy moved API Keys into the Gen AI Studio section for now to see what people think of it there. Even though keys can be used for Admin-ey actions, they can also be used by AIEs who want to easily find and manage their keys for their various apps and services. The ability to see which Assets are available to a key, and easily accessing the endpoints for every Asset from within the Key Details page, also seems to be valuable and what alternatives like LiteLLM focus on. This area feels worth moving outside of Settings for those reasons.
