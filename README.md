# Purchase Order Form

A React-based **Purchase Order (PO) form** application that allows users to create and manage purchase orders, select clients, assign jobs, and allocate talents with detailed billing information.  

Built with **React**, **Bootstrap**, and **React DatePicker**, the app demonstrates form validation, dynamic sections, and a read-only review mode.  

---

## Table of Contents

- [Features](#features)  
- [Technologies Used](#technologies-used)  
- [Installation](#installation)  
- [Usage](#usage)  
- [Project Structure](#project-structure)  
- [Components](#components)  
- [Form Validation](#form-validation)  
- [How to Explain in an Interview](#how-to-explain-in-an-interview)  

---

## Features

- Select **Client** from a predefined list.  
- Choose **PO Type**: `Individual PO` or `Group PO`.  
- Enter **PO Number**, **Received On Date**, **Received From** (Name & Email).  
- Set **PO Start Date** and **End Date** (with validation).  
- Enter **Budget** and select **Currency**.  
- **Dynamic Talent Sections**:  
  - Select job/REQ for each section.  
  - Assign talents with fields: `Bill Rate`, `Standard Time BR`, `Over Time BR`, `Contract Duration`, `Currency`.  
  - Single or multiple talent selection based on PO type.  
- **Add / Remove** talent/job sections dynamically (only for Group PO).  
- **Validation**: ensures all required fields are filled, budget is numeric, dates are valid, and talent selection rules are enforced.  
- **Read-only view** after submission to review PO details and selected talents.  
- Reset form to initial state.  

---

## Technologies Used

- **React 19** – UI library for building interactive components.  
- **Bootstrap 5** – Responsive styling and layout.  
- **React DatePicker** – Date selection for PO received and period.  
- **React Icons** – Calendar icons in date fields.  
- **Vite** – Fast development and build tool.  
- **ESLint** – Code quality and linting.  

---

## Installation

1. Clone the repository:  
   ```bash
   git clone <repo-url>
   cd purchase-order-form

2. Install dependencies : npm install

3. Run the development server :  npm run dev

4. Build for production : npm run build


## Usage

- Select a Client from the dropdown.
- Choose PO Type: Individual PO (single talent) or Group PO (multiple talents).
- Enter PO details: Number, Received From, Dates, Budget, Currency.
- Select Job / REQ and assign talents with their respective billing and contract info.
- Click Save to validate and submit.
- Review the read-only PO summary.
- Use Reset to clear form or Back to Edit to modify data.

## Project Structure

purchase-order-form/
│
├─ src/
│  ├─ components/
│  │  ├─ PurchaseOrderForm.jsx   # Main form component
│  │  └─ TalentDetails.jsx       # Dynamic talent/job sections
│  ├─ App.jsx
│  └─ main.jsx
├─ package.json
├─ vite.config.js
└─ README.md

## Components

1. PurchaseOrderForm.jsx

- Main component managing purchase order state.
- Handles:
  - Form fields (clientId, poType, poNumber, dates, budget, currency).
  - Job and talent section management.
  - Validation and submission logic.
  - Read-only view after submission.
  - Uses React DatePicker for date fields with FaCalendarAlt icon.


2. TalentDetails.jsx

- Sub-component for dynamic talent sections.
- Features:
    - Job selection dropdown.
    - Talent list with checkbox selection.
    - Input fields for Contract Duration, Bill Rate, Standard/Overtime BR, Currency.
    - Add / Remove sections (for Group PO).
    - Validation display for each talent field.

3. Form Validation
- Purchase-level: all mandatory fields filled, email format valid, budget numeric & ≤5 digits, PO end date ≥ start date.
- Talent-level:
    - Individual PO: exactly 1 talent selected.
    - Group PO: minimum 2 talents selected.
    - Billing fields required for selected talents.
- Error messages displayed inline.
- Form scrolls to top on validation failure.