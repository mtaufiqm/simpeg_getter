# Project Setup Guide

## Installation

### 1. Clone or Update the Project

Download this project or update your local repository:

bash
git clone <repository-url>


or

bash
git pull


### 2. Install Dependencies

Navigate to the project directory and run:

bash
npm install


### 3. Configure Environment Variables

Create a .env file in the project root with the following content:

env
USERNAME="UserSSO"
PASSWORD="PasswordSSO"
TARGET_NIP="TargetOldNIP"


*Note:*

* TARGET_NIP can contain multiple NIPs separated by commas (,).

*Example:*

env
TARGET_NIP="123456789,987654321,112233445"


### 4. Connect to VPN

Make sure the FortiClient VPN is active and connected before running the application.

### 5. Run the Application

Use one of the following commands:

bash
node ./dist/main.js


or

bash
npm start


### 6. Monitor the Process

Wait for the process to complete. You can monitor the execution progress through the console logs.

### 7. Retrieve the Results

The generated output file will be saved in the following directory:

text
./result


File naming format:

text
{DateTime}_data.xlsx


### 8. Done

Happy Coding 🚀

---

# About This Project

* 99% Direct API Calls
* 1% Scraping (used only for authentication purposes)

## Important Notes

* This project is *not a hacking tool*. It operates by interacting with available API endpoints.
* The project will continue to work unless the underlying APIs are changed or updated.
* This project was made public to raise awareness of long-standing security concerns regarding exposed employee data. Hopefully, the relevant parties will address and resolve these issues as soon as possible.

---

*MTM*
Super Junior Developer