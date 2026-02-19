# Backend for Giornali Project

### Technologies Used
- Express for routes and API
- Jest for tests
- Wrote entirely on Typescript
- Scalable and modulare structure

## Project Structure
```
\giornali-backend  
 ├── \docs                 # Project documentation  
 ├── \src  
 │   ├── \__tests__        # Test files  
 │   ├── \config           # Configuration files (e.g., database, environment variables)  
 │   ├── \controllers      # Business logic (handles requests/responses)  
 │   ├── \models           # Database models & schemas  
 │   ├── \routes           # API route definitions  
 │   ├── \middlewares      # Custom middleware (authentication, logging, error handling)  
 │   ├── \services         # Business logic or external API interactions  
 │   ├── \utils            # Helper functions and utilities  
 │   ├── \types            # Typescript interfaces declarations 
 │   ├── app.ts            # Express app setup  
 │   └── server.ts         # Server initialization  
 ├── .env                  # Environment variables  
 ├── .gitignore            # Files to ignore in version control  
 ├── package.json          # Dependencies and scripts  
 ├── README.md             # Project documentation 
```

# Getting Started

### Download Git if not done yet
[Download Link](https://git-scm.com/install/)

### Clone the repo
In your terminal run:
1. `git clone https://github.com/Giornali/backend.git`
2. `cd giornali-backend`

You can now install dependencies

### Install dependencies
`npm install`

### Run the server
`npm run dev`

## Run tests
`npm run test`