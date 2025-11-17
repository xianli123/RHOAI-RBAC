# Personas

## AI Instructions

The content in this document was exported from a slide deck presentation covering the key personas of the Red Hat AI portfolio.

Slide deck: https://docs.google.com/presentation/d/1Odrx0JRrD22ANU9NLQJ8ozX9NBHcC1dzonWKPxCMmfE/edit?slide=id.g2d4046103b0_0_1491#slide=id.g2d4046103b0_0_1491

## Exported text

September 2025
Red Hat AI Personas
Deep dive on the jobs AI teams have to accomplish to deliver to production

September 2025

Primary Personas
2
Red Hat AI Personas
The Enterprise AI Team

Deena the Data Scientist 
Develops and evaluates the core AI/ML models 
The Enterprise AI Team 
Red Hat AI Persona JTBD 
3
Alex the AI Engineer 
Develops and deploys AI-infused applications, bridging Dev, Ops, and AI/ML
Maude the ML Ops Engineer
Automates the entire AI/ML model lifecycle: deployment, monitoring, and maintenance
Paula the Platform Engineer
Creates and maintains reliable, cost-efficient, and secure compute, storage, and networking environments.
THE INNOVATOR
THE BUILDER
THE AUTOMATOR
THE ENABLER

Deena the Data Scientist 
Develops and evaluates the core AI/ML models 
The Enterprise AI Team 
Red Hat AI Persona JTBD 
4
THE INNOVATOR
Develops and evaluates the core AI/ML models.3 ,4
Focused on rigorous experimentation and scientific inquiry, often in notebooks.5, 24, 25 
Key Skills: Data Processing, Feature Engineering, Model Building.⁴


Tooling, Workflow & Productivity: Disconnected from the operational realities of production environments. 4 
Data Access, Quality & Management: Views data prep as a cumbersome prerequisite to core work. Data is frequently "fragmented across numerous locations and systems".  4, 8, 22, 23, 27
Model Development, Customization & Tuning: Ensure that business stakeholders can use the model's predictions in an actionable way.4, 29
I don't think the ability to convert a notebook to a deployable model is so important. Data scientists can experiment in a notebook, but deployment is completely non-correlated.4 Openshift AI User Outcome Survey Research Report, Slide 27
The standard garbage in garbage out situation - we have a lot of garbage coming in and it never stops coming in. So we wanna have like consistent and transparent rules for how we take that garbage and make it into something usable.8 2025-04-16 Red Hat AI Discovery Insights Report, Slide 14
 Supporting Data
Pain Points & Challenges
Responsibilities & Skills

The Enterprise AI Team 
Red Hat AI Persona JTBD 
5
Develops and deploys AI-infused applications, bridging Dev, Ops, and AI/ML4, 8, 26, 27, 29
Driven by urgency and practicality; seeks the quickest, most maintainable path to integrate an LLM.8, 15, 25, 26, 27,
Key Skills: designing and developing GenAI applications, model selection and prompt engineering, testing and evaluations 4, 8, 12, 26, 27
Cumbersome Data and Tooling Access: Limited by proprietary data, hindering external resources/tools 27
Prompt Management and Versioning: Manual and time-consuming prompt engineering and testing 27
Deployment, Infrastructure & Scaling Challenges: Deployment process is "overly complex and time-consuming," 27 
Evaluation, Observability & Trustworthiness Deficiencies: Evaluation methods are "largely manual", time-consuming, and repetitive. 12, 26, 27, 28 

People always underestimate the time and effort to develop strong evaluation frameworks to ensure an application is enterprise production ready. Without that, you’re setting up for failure. 50% of our SW engineering effort is spent custom fitting the evaluation to our needs.28 Rapid Market Insights, Slide 13
A significant hurdle in evaluating retrieval accuracy is the lack of annotated or "golden" data sets, which makes traditional NLP metrics less effective for generative AI outputs. 		 12 RAG/Agentic eval user research insights 
Alex the AI Engineer 
Develops and deploys AI-infused applications, bridging Dev, Ops, and AI/ML
THE BUILDER
 Supporting Data
Pain Points & Challenges
Responsibilities & Skills
Additional quotes: 
Microsoft AI Engineer explained that their evaluation includes assessing AI system performance... and ensuring safe AI development (checking for profanity or hallucinations).""responsible AI development is the top priority, ensuring no harmful responses or hallucinations"12 RAG/Agentic eval user research insights 
BCG: Automating evals is a core challenge: "the same output scores differently every time" when using LLM as a judge. This variability causes their CI/CD pipeline to fail, often necessitating manual verification: "every time it fails we don't stop the release. I or somebody else from my team go through the failed answers and see whether or not it's a true failure". He states, "there's definitely a lot of stochastic nature there", and that "there's no very defined narrow set of metrics we can trust 100%"12 RAG/Agentic eval user research insights 
Going through the legal things, it's very, very challenging just to access even a single column in your database. You have to get full approvals… the full use case, where you are exposing, who can see it, how can you fetch it, so it’s a long process to get approvals from the compliance legal things.8 2025-04-16 Red Hat AI Discovery Insights Report, Slide 16

 Supporting Data
Pain Points & Challenges
Responsibilities & Skills
The Enterprise AI Team 
Red Hat AI Persona JTBD 
6
Automates the entire AI/ML model lifecycle: deployment, monitoring, and maintenance.4, 7, 27 
Focused on reliability, security, scalability, and reproducibility.4, 7, 27 
Key Skills: MLOps system management, scalable deployments, monitoring.4, 7, 27 

Inefficient Handoffs and Skill Mismatches: Acts as the "glue" between teams. The transition of models and workflows from data scientists and AI engineers to MLOps for deployment is frequently not a smooth process.4, 7
Fragmented Observability and Monitoring: the "operational blind spot," where a substantial portion of AI/ML applications in production are not adequately monitored, leading to unknown risks.6, 7, 27
Production-ready Pipelines: Often "industrializing" notebook code into robust, production-ready pipelines.4, 7, 27 

Coming to the deployment, the biggest challenge I face is input drift or model drift. In the initial model it performs really well but after some days it's performance starts degrading. So, I want some tool which can track this and help me find out how the input data or labels are drifting from the training data.   4 Openshift AI User Outcome Survey Research Report, Slide 26
We have lot of Gen AI models in production today. But we are still struggling with making sure we have a unified production ready testing pipeline.4 Openshift AI User Outcome Survey Research Report, Slide 27

Maude the ML Ops Engineer
Automates the entire AI/ML model lifecycle: deployment, monitoring, and maintenance
THE AUTOMATOR
Additional Pain points and supporting quotes 
Managing Complex AI Lifecycles and Customization Demands: Tasked with provisioning infrastructure, managing data access, and overseeing model testing and serving across the entire AI/ML lifecycle. This is exacerbated by a high demand for customization, requiring flexible platforms to build bespoke solutions and adapt models to specific business needs. 4, 27
Security, Governance, and Compliance Complexities: faces significant challenges with integrating platform authentication and defining granular RBAC for agent-to-agent (A2A) and agent-to-tool (A2T) communication. 6, 27
Additional Supporting Quotes 
Another issue is choosing the right machine to deploy the ML model. Usually a data scientist uses a compute heavy machine while developing the model. But while deploying MLOps require to select a best machine which suits the model requirement to save cost.4 Openshift AI User Outcome Survey Research Report, Slide 29




 Supporting Data
Pain Points & Challenges
Responsibilities & Skills
The Enterprise AI Team 
Red Hat AI Persona JTBD 
7
Abstract complexity for Data Scientists while maintaining reliable, cost-efficient, and secure compute, storage, and networking environments.27, 28
Strategic automation and empowerment; aims to build herself "out of the loop – one API at a time". 4, 27, 30
Key Skills:  GPU management, container orchestration, operating systems management
Some teams use, a particular library, a particular approach, a particular deployment strategy, and then there is another one that does something completely different and… we don't want to do that. We want to build some sort of unified platform without being too prescriptive about it.8 2025-04-16 Red Hat AI Discovery Insights Report, Slide 18
Compliance and Legal Approvals: Paula grapples with many challenges related to legal approval, RBAC, compliance, and data privacy 8,27,
Data Privacy and Leakage Prevention: Ensuring sensitive internal user data is not exposed to public libraries or LLMs8,27, 
Establishing Robust Access Controls: a critical and pervasive pain point is the need for robust AuthN/AuthZ, RBAC, and Quota Management as first-class, API-level features. 27 
Paula the Platform Engineer
Creates and maintains reliable, cost-efficient, and secure compute, storage, and networking environments.
THE ENABLER

Deena the Data Scientist 
Develops and evaluates the core AI/ML models 
The Enterprise AI Team 
Red Hat AI Persona JTBD 
8
Alex the AI Engineer 
Develops and deploys AI-infused applications, bridging Dev, Ops, and AI/ML
Maude the ML Ops Engineer
Automates the entire AI/ML model lifecycle: deployment, monitoring, and maintenance
Paula the Platform Engineer
Creates and maintains reliable, cost-efficient, and secure compute, storage, and networking environments.
THE INNOVATOR
THE BUILDER
THE AUTOMATOR
THE ENABLER
Personas are highly situational and evolve over time. Real users wear multiple “hats” to get things done depending on experience, team structure, and other factors. See additional assumptive personas that have overlapping JTBD compared to our four primary personas.
AI Expert
AI Researcher
Data Engineer
App Developer
Admin
ML Engineer
Admin
Platform Security
IT Ops
Potential related roles:
Potential related roles:
Potential related roles:
Potential related roles:

The Enterprise AI Team 
Red Hat AI Persona JTBD 
9
Deena the Data Scientist 
Alex the AI Engineer
Maude the ML Ops Engineer
4. OpenShift AI User Outcome Survey, Yingzhao Zhou, Dash Copeland, July 2024
Users must wear multiple hats
UI implication

These users are generalists and will need more guidance to be successful at lots of tasks. Especially for deployment and infra-related tasks. 
Openshift AI User Outcome Survey Research Report

The Enterprise AI Team 
Red Hat AI Persona JTBD 
10
% of Developers, Data Scientists and MLOps that rate skills as “extremely important”
Deena the Data Scientist 
Alex the AI Engineer
Maude the ML Ops Engineer
They must wear multiple “hats” In order to get things done depending on experience, team structure, and other factors.
Personas have highly overlapping necessary skills
4. OpenShift AI User Outcome Survey, Yingzhao Zhou, Dash Copeland, July 2024
* notice these personas rate “platform management” and “infrastructure building” as unimportant. 

Supporting Roles
11
Red Hat AI Personas
Supporting Roles

 Supporting Data
Pain Points & Challenges
Responsibilities & Skills
The Enterprise AI Team 
Red Hat AI Persona JTBD 
12
Pushes the boundaries of the latest AI tech & research 
Trying out the very latest SDKs and methods published in research papers to improve model performance
Key Skills: innovation and experimentation, ability to improve the accuracy of model outputs for production use cases 
Customers in Japan, 
Trip Report -Japan Customer & Partner Visits -April 6-11 2025

Performance and Flexibility: Needs "sophisticated knobs" for fine-tuning and the ability to work in a flexible, environment. Vendor lock-in is a concern for them.
Experiment and Data Lineage: Manual tracking of experiments, including which data sources and model versions were used. Clear need for better lineage tracking.
Remote Development and Execution: Often develops on their local machines (e.g., in VS Code) and needs to seamlessly offload intensive jobs (like training) to more powerful infrastructure. 
Erica the AI Expert 
Fine-tunes and customizes models to improve accuracy and cost using state-of-the-art SDKs, tools, techniques, models, and infrastructure that give maximum flexibility and choice.
THE INNOVATOR
Categorized as an alternative Innovator persona, research underway to determine overlap between DS and AI Expert in the GenAI space
Is not a “data scientist” or “AI Eng”
More autonomous
Not solely data-focused
Not solely AI app-focused
Not afraid of infra mgmt (but ideally doesn’t need to)


 Supporting Data
Pain Points & Challenges
Responsibilities & Skills
The Enterprise AI Team 
Red Hat AI Persona JTBD 
13
Identify and access data sources
Addresses data quality and consistency
Managing data compliance and privacy
Creating test and training datasets
Key Skills:  data architecture, engineering, refining data models, and managing data domains
My goal is to ensure the availability of high quality data and streamlined automation processModel Registry Report 2024
I strive to deliver reliable And Timely insights that support accurate billing and auditing process at my companyModel Registry Report 2024
Feature Store User Journey
Managing data across borders/domains
Making unstructured data usable (e.g., PDFs, images, complex tables) is difficult
Data access challenges including legal, compliance, RBAC, and data privacy issues
Data pipeline integration for models in production environments

David the Data Engineer 
Primarily involved in data architecture, engineering, and refining data models

14
Capabilities
RHAI Personas
RHOAI Capabilities

RHAI Capabilities
Red Hat AI Persona JTBD 
15
Problem Statements
Competitors
"How can our data scientists get started quickly without waiting for IT?"
"I just need a Jupyter environment with all my favorite libraries like TensorFlow and PyTorch pre-installed."
"We need to give each data scientist their own secure, isolated environment to experiment in."
"My laptop isn't powerful enough to train this model. I need a cloud-based environment with more compute power."
"How do we standardize the development tools our data science team uses?"
AWS Sagemaker
Microsoft Azure AI
Google Vertex
Cloudera
Workbench
An isolated development environment (often based on Jupyter notebooks) where data scientists write, explore, test, and train models.
Alt Terms
AI Toolkit
Collaborative Workspace
Data Science Hub
Experimentation Platform
IDE (Integrated Development Environment)
JupyterLab
RStudio
Sandbox Environment

Personas
Deena the Data Scientist 
Paula the Platform Engineer
David the Data Engineer 

RHAI Capabilities
Red Hat AI Persona JTBD 
16
Problem Statements
Competitors
"We have a trained model file. Now, how do we actually deploy it as a live API?"
"We need our model endpoint to be highly available and scale automatically with traffic."
"How can we serve multiple models from a single deployment to save on resource costs?"
"Our application needs to get real-time predictions with very low latency."
"How do we A/B test a new version of a model against the old one in production?"
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
Databricks
Nvidia Enterprise AI
Alt Terms
A/B Testing
API-Driven AI
Canary Deployments
Inference Endpoint
Low-Latency Serving
Model Deployment
Real-Time Prediction
Scalable Inference

Personas
Deena the Data Scientist 
Paula the Platform Engineer
Maude the ML Ops Engineer
Alex the AI Developer
Model Server
A runtime that takes a deployed model and handles inference requests (e.g. REST API calls, gRPC) in production.

RHAI Capabilities
Red Hat AI Persona JTBD 
17
Problem Statements
Competitors
"Where do we store our approved, production-ready models?"
"We need to track every version of the model that we've trained."
"How do we know which model version is running in which environment?"
"We need a central place to manage the entire lifecycle of a model, from staging to production and retirement."
"I need to find the original training data and code that was used to create the model that's currently live."
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
Databricks
Cloudera
Alt Terms
AI Asset Management
Central Repository
Model Lifecycle Management
Model Lineage
Single Source of Truth
Staging & Production
Version Control for AI

Personas
Deena the Data Scientist 
Paula the Platform Engineer
Maude the ML Ops Engineer
Alex the AI Developer
Model Registry
A model registry is a system to store, version, track, and manage models and their versions (metadata, lineage, deployment status).

RHAI Capabilities
Red Hat AI Persona JTBD 
18
Problem Statements
Competitors
"I'm tired of manually running all the steps to retrain and deploy my model."
"We need to create a repeatable, automated workflow for our entire machine learning process."
"How can we build a full CI/CD system, but for machine learning models?"
"We need to automatically trigger retraining whenever new data becomes available."
"How can we orchestrate a complex sequence of steps: data prep, training, evaluation, and deployment?"
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
Databricks
Cloudera
Alt Terms
AI Factory
CI/CD for ML
Directed Acyclic Graph (DAG)
End-to-End Automation
MLOps
Orchestration
Repeatable Science
Workflow Automation

Personas
Deena the Data Scientist 
Paula the Platform Engineer
Maude the ML Ops Engineer
David the Data Engineer 
AI Pipelines
Workflows that string together multiple steps (data preprocessing, feature engineering, training, evaluation, deployment) in a sequence or directed graph.

RHAI Capabilities
Red Hat AI Persona JTBD 
19
Problem Statements"
Competitors
“My training job is taking too long on a single node, so I can’t do rapid iterations on models”
“I need to train with very large datasets or complex models that don’t fit (memory / compute) on a single node.”
“I’m wasting compute resources because my GPUs / nodes are underutilized when jobs are queued or throttled.”
"“I don’t know when or how to schedule my jobs across cluster resources — I need a system that can queue, allocate, and schedule automatically.”

AWS Sagemaker
Azure Machine Learning
Run:AI
Alt Terms
Distributed Workloads
Data Parallelism
Model Parallelism
Sharding
Elastic/Dynamic Scaling
Personas
Deena the Data Scientist 
Paula the Platform Engineer
Maude the ML Ops Engineer
David the Data Engineer 
Distributed Training
Enables running data science / AI / ML workloads across multiple nodes allowing faster iteration, ability to scale to larger datasets, and use of more complex models.

RHAI Capabilities
Red Hat AI Persona JTBD 
20
Problem Statements
Competitors
“How can my data scientists securely connect their notebooks to our S3 buckets or our Snowflake database?"
"We need a centralized way to manage database credentials and data sources for the AI platform."
"How do we make it easy for our team to access the data they need for training without moving it all over the place?"
"We need to ensure our data access is governed and follows our security policies."
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
IBM Watson
Databricks
Cloudera
Alt Terms
Connector Catalog
Data Federation
Data Virtualization
In-Place Data Access
Secure Access Layer
Unified Data Access
Zero-ETL

Personas
Deena the Data Scientist 
Paula the Platform Engineer
David the Data Engineer 
Data Connections
Abstractions for connecting your workbench or pipelines to external data stores (e.g. S3-compatible storage, object stores, databases).

RHAI Capabilities
Red Hat AI Persona JTBD 
21
Problem Statements
Competitors
"Our developers just want a simple API to call the fraud detection model. They don't want to know how it works."
"How can we expose our internal AI models so other teams can easily consume them in their applications?"
"I don't want to manage infrastructure; I just want to pay for predictions."
"We want to provide our data science models as a catalog of services to the rest of the business."

AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
Databricks
Cloudera
Nvidia Enterprise AI
Alt Terms
AI Marketplace
AI-as-a-Service
API Economy
Consumption Model
Managed Endpoints
Predictive Services
Serverless AI

Personas
Deena the Data Scientist 
Paula the Platform Engineer
Maude the ML Ops Engineer
Alex the AI Developer
Models as a Service (MaaS)
A means to offer models as API endpoints or services: users do not need to manage the model or infrastructure themselves, they just call the model via API.


RHAI Capabilities
Red Hat AI Persona JTBD 
22
Problem Statements
Competitors
"Our LLM inference is too slow and costs too much."
"How can we increase the throughput and serve more users simultaneously with our deployed language model?"
"We need to process requests in batches to make our LLM serving more efficient."
"How do we lower the memory usage of our large language models during inference?"
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
IBM Watson
Databricks
Cloudera
Nvidia Enterprise AI
Alt Terms
Batch Processing
Concurrent Serving
High-Throughput Inference
Inference Engine
Low-Latency LLMs
Optimized LLM Serving
PagedAttention

Personas
Deena the Data Scientist 
Paula the Platform Engineer
Maude the ML Ops Engineer
vLLM
An inference engine / runtime optimized for serving large language models (LLMs).


RHAI Capabilities
Red Hat AI Persona JTBD 
23
Problem Statements
Competitors
"We want to build an AI that can do more than just answer questions. It needs to perform tasks."
"How can we create a system where a language model can use external tools, like calling an API or searching a database?"
"We're trying to build a customer service bot that can actually process a refund, not just talk about it."
"Our goal is to automate a complex business process using a chain of AI-driven actions."

AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
Flowise
Nvidia Enterprise AI
Alt Terms
AI Orchestration
Autonomous Agents
Goal-Oriented Systems
Multi-Agent Systems
ReAct (Reason + Act)
Task Automation
Tool-Using AI

Personas
Deena the Data Scientist 
Maude the ML Ops Engineer
Alex the AI Developer
Agentic AI
AI systems (agents) that can reason, plan, act over multiple steps, take autonomous actions, possibly interact with environments or orchestrate other tools or models.


RHAI Capabilities
Red Hat AI Persona JTBD 
24
Problem Statements
Competitors
"Our GPUs are sitting idle most of the time. We're wasting a lot of money."
"How can we share a single powerful GPU among multiple data scientists or smaller model deployments?"
"We need to allocate just a fraction of a GPU to a specific user or workload."
"How do we democratize access to our expensive GPU resources so more teams can use them?"
"Can we get on-demand access to GPU capacity without having to manage the hardware?"
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
Nvidia Enterprise AI
Alt Terms
Accelerated Computing
Fractional GPU
GPU Democratization
GPU Virtualization (vGPU)
Multi-Instance GPU (MIG)
On-Demand GPUs
Resource Optimization

Personas
Deena the Data Scientist 
Paula the Platform Engineer
GPU as a Service (GPUaaS) / GPU Slicing
Partitioning GPUs (GPU slicing) to let multiple workloads share a GPU, idle culling (shutting down idle GPU use), dynamic allocation, etc.


RHAI Capabilities
Red Hat AI Persona JTBD 
25
Problem Statements
Competitors
"We want to deploy a foundation model from NVIDIA, but building the serving container is complex."
"How can we get a pre-built, optimized, production-ready container for running a Llama or Mixtral model?"
"We need a standardized and supported way to serve these popular open-source LLMs."
"Is there a simple way to take a model from the NVIDIA AI Enterprise catalog and deploy it on OpenShift?"
Nvidia Enterprise AI
Alt Terms
Cloud-Native AI
Enterprise-Ready AI
Foundation Models
Optimized Microservices
Portable AI
Pre-packaged AI
Turnkey Models

Personas
Deena the Data Scientist 
Paula the Platform Engineer
Maude the ML Ops Engineer
NIMS / Nvidia NIM
NVIDIA Inference Microservices (often used with “NIM”)—a framework / set of microservices for deploying generative AI models in a modular and scalable way.


RHAI Capabilities
Red Hat AI Persona JTBD 
26
Problem Statements
Competitors
"How do we prevent our chatbot from giving harmful, toxic, or off-topic answers?"
"We need to make sure the model's responses stay on-brand and don't discuss sensitive subjects."
"How can we guide the model's output to make sure it follows a specific format or script?"
"We need to put a safety layer on top of our LLM before we expose it to customers."
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
IBM Watson
Flowise
Alt Terms
Content Fencing
Conversational Safety
Ethical AI
Hallucination Prevention
Output Moderation
Policy Enforcement
Responsible AI

Personas
Deena the Data Scientist 
Maude the ML Ops Engineer
Alex the AI Developer
Guardrails
Guardrails are safety, policy, and correctness controls applied to AI systems (especially generative / LLMs) to prevent harmful, unwanted, or unsafe outputs.


RHAI Capabilities
Red Hat AI Persona JTBD 
27
Problem Statements
Competitors
"The compliance team is asking for an audit trail of how our models are built and deployed."
"How do we enforce policies on who can access data and deploy models into production?"
"We need to track model lineage from the data it was trained on to the predictions it's making."
"How can we manage risk and ensure our AI usage is responsible and ethical?"
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
IBM Watson
Alt Terms
AI Act
AI Governance
Auditability
Compliance
Factsheets
Model Lineage
Regulatory Compliance
Risk Management (AIGRM)

Personas
Deena the Data Scientist 
Maude the ML Ops Engineer
Alex the AI Developer
Governance
Governance refers to the policies, oversight, auditability, processes, and controls around the use, deployment, and monitoring of AI systems (models, agents, data).


RHAI Capabilities
Red Hat AI Persona JTBD 
28
Problem Statements
Competitors
"Why did the model decline this loan application?"
"We need to be able to explain the model's decision-making process to our customers and to regulators."
"How can we understand which features are most influential in our model's predictions?"
"How do we build trust in our models? We need to show people how they work."
AWS Sagemaker
Microsoft Azure AI
Goggle Vertex
IBM Watson
Alt Terms
"Black Box" Demystification
Decision Transparency
Explainable AI (XAI)
Feature Importance
LIME (Local Interpretable Model-agnostic Explanations)
Model Interpretability

Personas
Deena the Data Scientist 
Maude the ML Ops Engineer
Alex the AI Developer
Explainability
Explainability refers to techniques that help users understand how a model arrived at a particular output or decision (e.g. feature importance, attention maps, counterfactuals).


Core Problems
29
Red Hat AI Personas
Team Core Problems

The Core Problem 
Red Hat AI Persona JTBD 
Enterprise AI success is a human challenge, not just a technological one.
30
Success depends on the collaboration and empowerment of a diverse team of specialists.
Fragmented tools and disjointed workflows create silos, friction, and inefficiency.
THE INNOVATOR
THE BUILDER
THE AUTOMATOR
THE ENABLER

User Pain, Qualified
Red Hat AI Persona JTBD 
31
The Challenge: The economics of AI—specialized hardware and skilled personnel—drive technical choices. 15, 22, 26,  27
Hardware Constraints: Access to GPUs is a significant bottleneck and a major business cost. 12, 15, 22, 26
Economic Reality: Traditional fine-tuning is often seen as prohibitively expensive. 4, 27
Market Response: This drives widespread adoption of Retrieval-Augmented Generation (RAG) as the preferred, more cost-effective starting point, even though fine-tuning may be still ultimately be required in certain cases. 8, 27
Resource Scarcity
THE INNOVATOR
THE ENABLER
THE BUILDER
Fragmented tools and disjointed workflows create silos, friction, and inefficiency
“ I  just want a clear path from an idea to a production-ready model, without fighting for GPUs or spending half my day trying to explain to someone why this fine-tuned version is better. It's about building, not just battling. ”  
26 First Class Experiment Tracking for Generative AI F2F Read Out, Slide 9

User Pain, Qualified
Red Hat AI Persona JTBD 
32
The Challenge: Data is the fuel, but it's a constant source of friction, delay, and risk. 8, 27, 31
Unstructured Data: Dealing with PDFs (scans, tables) is a universal pain point. 8, 27, 31
Data Quality: "The standard garbage in garbage out situation - we have a lot of garbage coming in and it never stops coming in." - Data Engineer, Angi 8, 27
Bureaucracy: Gaining data access is a bureaucratic nightmare of legal and compliance hurdles. 8, 27
The Data Dilemma
THE AUTOMATOR
Fragmented tools and disjointed workflows create silos, friction, and inefficiency
THE INNOVATOR
THE BUILDER
“ Going through the legal things, it's very, very challenging just to access even a single column in your database. You have to get full approvals… the full use case, where you are exposing, who can see it, how can you fetch it, so it’s a long process to get approvals from the compliance legal things. ” 8 2025-04-16 Red Hat AI Discovery Insights Report, Slide 16

User Pain, Qualified
Red Hat AI Persona JTBD 
33
The Challenge: A crisis of confidence in how to evaluate Generative AI systems. 12, 27
Manual & Subjective: The process relies on SMEs "eyeballing" results, which is unscalable and unreliable. 12, 27
Untrustworthy Automation: Using an "LLM-as-a-judge" is deeply distrusted. "The same output scores differently every time." - AI Engineer, BCG 12, 27
The Operational Burden of Verification: GenAI deployments are bottlenecked by their reliance on slow, costly, and unscalable manual verification. Automated alternatives are often too inconsistent and untrustworthy, causing failures that erode confidence. This combination of issues introduces significant risk and stalls many projects in the pilot phase. 4, 8, 12, 22, 27, 28,  29
The Evaluation Bottleneck
THE BUILDER
Fragmented tools and disjointed workflows create silos, friction, and inefficiency
“ We have lot of Gen AI models in production today. But we are still struggling with making sure that we have a unified production ready testing pipeline. It is hard to test response of GPT models as well. There will be subtle hallucinations, ungroundedness of responses. We are still working to identify the right pipeline to testing. Right now, we use another GPT model to test the response - which is not ideal. ”  4 Openshift AI User Outcome Survey Research Report, Slide 27
THE AUTOMATOR

User Pain, Qualified
Red Hat AI Persona JTBD 
34
The Challenge: Organizational structure mirrors the fragmented toolchain, creating broken handoffs. 7, 26, 27
Primary Failure Point: The transition from Data Science (Deena) to MLOps (Maude). 4, 7, 26  There is a fundamental split between the builders (Deena/Alex) and the platform (Paula/Maude) where neither fully understands the other’s world.
The Root Cause: "What works in notebooks doesn't necessarily work in production." 4, 26, 27
The Result: Lack of a unified platform forces teams into disconnected silos, wasting time and resources.4, 27
The Collaboration Chasm
THE AUTOMATOR
THE INNOVATOR
Fragmented tools and disjointed workflows create silos, friction, and inefficiency
“The coding level of data scientists is low (except a selected few) and the MLOps team do not typically have enough Data Science knowledge to infer what the Data Scientist was trying to do.” 4 Openshift AI User Outcome Survey Research Report, Slide 29

User Pain, Qualified
Red Hat AI Persona JTBD 
35
Accelerated Time-to-Value: Move from concept to production in days, not months.¹⁹
Improved Quality & Trust: Robust evaluation, security, and observability build trust and drive adoption.²⁰
Enhanced Collaboration & Innovation: A common platform breaks down silos and creates a synergistic, high-performance team.
Strategic Agility: Transform AI from a series of risky experiments into a scalable, repeatable, and predictable business capability.
Summarizing what our target personas are looking for:
THE INNOVATOR
THE BUILDER
THE AUTOMATOR
THE ENABLER
Deena the Data Scientist 
Alex the AI Developer
Paula the Platform Engineer
Maude the ML Ops Engineer

Sources 
Red Hat AI Persona JTBD 
36
Why Most Enterprise AI Projects Fail — and the Patterns That Actually Work - WorkOS, accessed September 5, 2025, link 
Red Hat AI CY2026 Product Strategy
Gen AI Persona Jobs To Be Done, Dash Copeland, September 2025
OpenShift AI User Outcome Survey, Yingzhao Zhou, Dash Copeland, July 2024
WIP Red Hat AI Personas, Andy Braren, Jingfu Tan, Nicholas Jayanty, Kyle Walker, Ongoing
3.0 Workshop (Agentic AI)
Red Hat OpenShift AI - ML Ops Interviews, Marc Jackson, Kyle Walker, Nov 2023
2025-04-16 Red Hat AI Discovery Insights Report, Jingfu Tan, Andy Braren, April 2025
Data Science Statistics and Facts (2025) - Market.us Scoop, accessed September 5, 2025, link
The Hidden Cost of Dirty Data in AI Development - DZone, accessed September 5, 2025, link
Data Suggests Growth in Enterprise Adoption of AI is Due to Widespread Deployment by Early Adopters - IBM Newsroom, accessed September 5, 2025, link
RAG/Agentic eval user research insights, Yingzhao Zhou, July 2025
MIT study shatters AI hype: 95% of generative AI projects are failing, sparking tech bubble jitters, accessed September 5, 2025, link
MLOps in 2025: What You Need to Know to Stay Competitive - HatchWorks, accessed September 5, 2025, link
Developer + AI Discovery Interview, Jingfu Tan, Sept 2024
AI pricing: how much does AI cost in 2025? - Future Processing, accessed September 5, 2025, link
RAG vs Fine Tuning: Choosing the Right AI Strategy - Appinventiv, accessed September 5, 2025, link
RAG vs. fine-tuning - Red Hat, accessed September 5, 2025, link
Cut AI Model Deployment Time by Nearly 400% with Cake, accessed September 5, 2025, link
MLOps Market Size, Share & Global Trend Report, 2025-2034, accessed September 5, 2025, link
How MLOps will Transform Predictive Analytics in 2025 - Cogent Infotech, accessed September 5, 2025, link
Red Hat OpenShift AI: Model Tuning, Marc Jackson, Jon Nemargut, June 2024
Feature Store Interviews Report, Marc Jackson, Jon Nemargut, December 2024
RHOAI UX benchmarking 2024, Yingzhao Zhou, Kyle Walker, Jon Nemargut, Vince Conzola, December 2024
 Red Hat OpenShift AI: AI/ML Developer Survey, Marc Jackson, Ying Zhou, Emma Spero, March 2025
First Class Experiment Tracking for Generative AI F2F Read Out, Jon Nemargut, July 2025
AI Customers & Prospects Discovery, Adel Zaalouk, ongoing
Rapid Market Insights - Agentic AI Users, Eric Hemesath, Burr Sutter, Jon Nemargut, Adel Zaalouk, July 2025
2025_Q3 UXDR-4550 AI Engineer Workflow Interviews, Yahav Manor, Sept 2025
Red Hat OpenShift AI: Model Catalog Study, Haley Wang, Jenn Giardino, Emma Spero, May 2025
Red Hat AI Document Preparation & Ingestion Survey, Jingfu Tan, July 2025
Note about sources: Red Hat user research resources are in bold and were the source for quotes in this deck based on real customer conversations. 
Additional links to articles were used as part of deep market research to support foundational information.

Thank you
37
Partnering across Red Hat to design and deliver useful, usable, and desirable experiences through data-driven insights, faster.
