## Ovdimnet Customer Implementation Automation - Phase 1

## Statement of Work (SOW)

- Phase 1
**Prepared For** Ovdimnet
**Prepared By** Eden Lumbroso (Independent Contractor)
**Date** June 29, 2025

**1. Introduction & Overview**

Ovdimnet's current process for implementing new clients on its time management
platform is a manual, training-intensive effort requiring significant employee
involvement. This project aims to automate this implementation process to improve
efficiency, reduce setup time, and minimize the need for extensive employee training.
The project will be executed in several phases, with each phase focused on
automating a larger part of the process than the last. This document outlines the
scope for the initial phase of the project.

**2. Project Objectives**

The primary objective of Phase 1 is to develop a core AI system capable of automating
the most complex part of the implementation: translating a new customer's
requirements (Excel format) into the correct system table configurations (JSON
format). The goal is not to achieve 100% accuracy initially, but to create a functional
system that significantly reduces the manual effort and time required for client
implementation, thereby providing a strong foundation for future automation phases.

**3. Scope of Work**

To achieve the objective for Phase 1, the following tasks will be performed:

**3.1. Dataset Creation:**
- **Responsibility: Ovdimnet.**
- Create a dataset of pairs of customer requirements and system table
configurations.
- Reverse-engineer existing system tables and document the likely
customer requirements and answers (e.g., in Excel format) that led to
these configurations, creating a dataset of (Requirements, Configuration)
pairs.
- Number of pairs in the dataset: TBD

**3.2. AI Model Development and Training:**

- Responsibility: Eden Lumbroso
- Utilize the created dataset and pre-defined logical rules to create an AI
workflow.
- The workflow will be designed to take customer requirements as input and
generate the corresponding system table configurations (JSON) as output.

**3.3. System Evaluation:**

- Responsibility: Eden Lumbroso
- Partition the created dataset into training and testing sets.
- Rigorously evaluate the AI’s performance and accuracy using the testing set
that was not used during training.

**3.4. Iterative Optimization:**

- Responsibility: Eden Lumbroso
- Based on evaluation results, iteratively refine and optimize the AI system.
- Optimization techniques may include, but are not limited to:
   - Modifying the AI's logical rules.
   - Adjusting the input/output data formats.
   - Incorporating specialized "role agents" within the AI architecture to handle
specific tasks.
- The cycle of training, evaluation, and optimization (steps 3.2-3.4) will be repeated to achieve the desired performance level.

**4. Key Deliverables**

The primary deliverables for Phase 1 will be:
- **The Core AI System:** A functional AI system that accepts customer
   implementation requirements as input and produces the corresponding system
   table configurations (JSON) as output.
- **The Training Dataset:** The complete dataset of (Requirements, Configuration)
   pairs created in step 3.1, which can be used for future model enhancements.

**5. Project Timeline (Placeholder)**

**Milestone Estimated Completion Date

Phase 1 Kick-off** TBD

**Dataset Creation (3.1) Complete** TBD

**Initial AI Model (3.2) Complete** TBD

**First Evaluation Cycle (3.3) Complete** TBD

**Phase 1 Final Delivery** TBD

**6. Assumptions & Dependencies (Placeholder)**

This project's success and timeline are dependent on the following assumptions:
- **Subject Matter Expert Availability:** An Ovdimnet employee with deep
   knowledge of the implementation process and system tables will be available to
   answer questions and evaluate the AI’s performance.
- **Feedback Timeliness:** Ovdimnet will provide feedback on deliverables and prototypes.

**7. Exclusions (Out of Scope)**

The following items are explicitly out of scope for Phase 1:
- Development of a customer-facing user interface (e.g., a web form for data entry).
- Direct integration of the AI system into Ovdimnet's live production environment.
- Automation of the initial client communication and question-gathering process.

**8. Acceptance Criteria**

The core AI system will be considered accepted upon demonstrating its ability to:
- Process a sample set of requirements (from the test data) and generate configurations.
- Achieve a pre-defined accuracy, or, reduce the time for implementing a new customer in a measurable way.

**9. Future Phases**

The next phases of the project will aim to automate a larger portion of the
implementation task in order to improve the company’s efficiency further. This will include:
- Expanding the AI system’s capabilities to handle more complex customer’s
requirements, including special requirements that are not predefined (Phase 2).
- Collecting the customer requirements automatically, perhaps with a specialized
chatbot (Phase 3).


