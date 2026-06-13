# Simpeg Getter Setup Guide

## Installation

### 1. Clone or Get the Project

Download this project or pull it in your local:

```bash
git clone https://github.com/mtaufiqm/simpeg_getter.git
```

or

```bash
git remote add origin https://github.com/mtaufiqm/simpeg_getter.git
git pull origin master
```

or download ZIP

```text
https://github.com/mtaufiqm/simpeg_getter/archive/refs/heads/master.zip
```

### 2. Install Dependencies

Navigate to the project directory and run:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root with the following content:

```env
USERNAME="UserSSO"
PASSWORD="PasswordSSO"
NIP_TARGET="TargetOldNIP"
```

**Note:**

- `NIP_TARGET` is Old NIP (9 Digit) or called B*S NIP and can contain multiple NIPs separated by commas (`,`).

**Example:**

```env
NIP_TARGET="123456789,987654321,112233445"
```

### 4. Connect to VPN

Make sure the FortiClient VPN B*S is active and connected before running the application.

### 5. Run the Application

Use one of the following commands:

```bash
node ./dist/main.js
```

or

```bash
npm start
```

### 6. Monitor the Process

Wait for the process to complete. You can monitor the execution progress through the console logs.

### 7. Retrieve the Results

The generated output file will be saved in the following directory:

```text
root directory / . (for Employees Infomation Data with Format {DateTime}_data.xlsx
```

```text
./result (for File Documents separated by each old NIP (9 Digit) folder)
```



### 8. Done

Happy Coding, its so Funny

---

# About This Project
- 99% Direct API Calls
- 1% Scraping (used only for SSO purposes)


## Important Notes

- This project is **not a hacking tool**. It operates by interacting with available API endpoints.
- The project will continue to work unless the underlying APIs are changed or updated.
- This project was made public to raise awareness of long-standing security concerns regarding exposed employee data. Hopefully, the relevant parties will address and resolve these issues as soon as possible.

---

## Author

**MTM**  
*Super Junior Developer 😂*