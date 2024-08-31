# Next.js Project with Prisma

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (preferably 20.10.0)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [PostgreSQL](https://www.postgresql.org/) or any other database supported by Prisma

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Kaustubhhub/interface_labs.git
cd interface_labs
```

### 2. Clone the Repository
```bash
npm install
# or
yarn install
```
### 3. Configure the Database

You have two options to set up your database:

1. **Free Tier Database on Neon**: Rent a free-tier PostgreSQL database from [Neon](https://neon.tech/). After setting up your database on Neon, copy the connection string they provide.

2. **Local Setup**:
   - **Using Docker**: Set up a PostgreSQL instance locally using Docker.
     ```bash
     docker run --name postgres -e POSTGRES_USER=your_user -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=your_db -p 5432:5432 -d postgres
     ```
   - **On Your Machine**: Alternatively, you can install PostgreSQL directly on your machine.

After setting up your database, create a `.env` file in the root of your project. Copy the environment variables from the `.env.example` file and update the `DATABASE_URL` with your PostgreSQL connection string.


3. **Run the following Prisma commands to set up your database**:
    ```bash
      npx prisma migrate dev --name init
      npx prisma generate
     ```
     
### 4. Run the Development server

  ```bash
      npm run dev
      # or
      yarn dev
```
#### Database schema:
model Payment {
  id          String   @unique @default(uuid())
  date        String?  
  type        String?  
  orderId     String?  
  description String?  
  total       String? 

  // Index for faster lookups (optional, if you need to query by orderId)
  @@index([orderId])
}

model Mtr {
  id              String   @unique @default(uuid())
  invoiceDate     String?  
  transactionType String?  
  shipmentDate    String?  
  orderDate       String? 
  shipmentItemId  String?  
  description     String? 
  invoiceAmount   String?  
}
