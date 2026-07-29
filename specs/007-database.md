# Database Specification

## Purpose

The database stores all financial and user-related information required by the AI-Powered Accounting & Finance Assistant. PostgreSQL is used as the primary relational database to ensure data integrity, reliability, and scalability.

## Database Technology

* PostgreSQL
* SQLAlchemy ORM
* Alembic for database migrations

## Database Tables

### Users

Stores user account information.

Fields:

* id
* name
* email
* password
* created_at

### Expenses

Stores all expense transactions.

Fields:

* id
* user_id
* amount
* category
* description
* date
* created_at

### Income

Stores all income transactions.

Fields:

* id
* user_id
* amount
* source
* description
* date
* created_at

### Ledger

Stores accounting journal entries.

Fields:

* id
* transaction_id
* account_name
* debit
* credit
* created_at

### Audit Logs

Stores audit activities.

Fields:

* id
* audit_type
* description
* created_at

### AI Chat History

Stores AI conversations.

Fields:

* id
* user_id
* prompt
* response
* created_at

## Relationships

* One User can have many Expenses.
* One User can have many Income records.
* One User can have many AI Chat History records.
* Ledger records are generated from Income and Expense transactions.
* Audit Logs record accounting activities performed by the system.

## Validation Rules

* Every Expense must belong to a valid User.
* Every Income record must belong to a valid User.
* Email addresses must be unique.
* Foreign key relationships must remain valid.
* Transaction records should not be deleted automatically.

## Business Rules

* The database should maintain transactional consistency.
* Financial records should remain accurate and secure.
* AI services should access data only through backend APIs.
* All financial reports should use real-time database records.

## Acceptance Criteria

* Database tables are created successfully.
* Relationships are maintained correctly.
* CRUD operations work without errors.
* Financial data is stored securely.
* Database supports AI-powered accounting operations.

