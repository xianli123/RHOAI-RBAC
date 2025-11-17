# Open Questions

This file contains open questions that still need answers in order to inform the design.

## Questions

Question: In 3.2 we intend to make the Models tab only include endpoints that are "gated" by an API Key. But this requires and assumes an API Gateway is involved, particularly RHCL. Is it okay to approach it this way?
- Yes, a RHOAI subscription will now include a license to use RHCL solely for MaaS purposes using this integration.

Question: (ENG/PM) Will we support Perses dashboards in 3.2?
- Yes

Question: (USER) Should our platform allow AIEs to add and bring their own API key to the Playground and elsewhere?
- Unknown

Question: API Keys can technically be 1:many for model endpoints and other things, but should the GUI allow them to do so?
- Unknown, but Andy leans probably