# AI Agent Specification

## Purpose

The AI Agent enables users to interact with the accounting system using natural language. It understands user requests, performs accounting operations through backend tools, and generates accurate financial responses.

## Functional Requirements

* Understand natural language requests.
* Create expense records.
* Create income records.
* Generate Profit and Loss Statement.
* Generate Balance Sheet.
* Perform monthly audits.
* Answer accounting-related questions.
* Generate financial insights.
* Categorize expenses automatically.

## Example User Requests

* Add office rent of PKR 50,000.
* Show my expenses for March.
* Generate Profit and Loss Statement.
* Prepare the Balance Sheet.
* Run a monthly audit.
* How much did we spend on utilities?
* Which category has the highest expenses?
* What is my total income this month?

## AI Tool Functions

* create_expense()
* create_income()
* get_profit_loss()
* get_balance_sheet()
* run_monthly_audit()
* get_financial_insights()
* answer_accounting_question()

## AI Workflow

1. User submits a natural language request.
2. FastAPI receives the request.
3. The AI Agent analyzes the request.
4. The AI Agent selects the appropriate backend tool.
5. The backend performs database operations.
6. PostgreSQL returns the required data.
7. The AI Agent generates a user-friendly response.
8. The response is displayed in the frontend.

## Validation Rules

* AI responses should be based on authenticated user data.
* Invalid or unclear requests should return a helpful error message.
* AI should use backend tools instead of directly accessing the database.
* Financial calculations should remain accurate and consistent.

## API Endpoint

### AI Chat

```http
POST /ai/chat
```

## Database Tables

The AI Agent interacts with the following tables through backend services:

* users
* expenses
* income
* ledger
* audit_logs
* ai_chat_history

## Business Rules

* The AI Agent must not access the database directly.
* All database operations should be performed through backend APIs.
* Every AI interaction should be recorded in AI Chat History.
* Financial reports should be generated using real-time accounting data.

## Acceptance Criteria

* AI understands user requests correctly.
* AI performs accounting operations successfully.
* AI generates accurate financial reports.
* AI provides meaningful financial insights.
* AI chat history is stored successfully.

