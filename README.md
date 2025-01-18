# icliniq_dev_todo

```markdown
# Shopping Cart Application

## Overview
This project consists of a front-end and back-end for a shopping cart application.

### Frontend (UI)
- Product CRUD operations.

### Backend (API)
- Product CRUD operations.
- Cart CRUD operations.

## Tech Stack
- React
- Astro.js
- Docker
- Node.js
- Express.js
- MongoDB

## Installation

### With Docker

1. Clone the repository:

   ```bash
   git clone https://github.com/yogeshsamiraj/icliniq_dev_todo.git
   ```

2. Navigate to the `icliniq_dev_todo` directory:

   ```bash
   cd icliniq_dev_todo
   ```

3. Build the Docker containers:

   ```bash
   docker-compose build
   ```

4. After building, run the application:

   ```bash
   docker-compose up
   ```

   This will run both the front-end and back-end of the application.

5. You can access the front end application at:

   ```
   http://localhost:3001
   ```

6. You can access the backend application at:

   ```
   http://localhost:5000
   ```

### Without Docker

#### Front-end
1. Navigate to the `shoppingcartFront` directory:

   ```bash
   cd shoppingcartFront
   ```

2. Run the application in development environment:

   ```bash
   npm run dev
   ```

#### Back-end
1. Navigate to the `shoppingcartBack` directory:

   ```bash
   cd shoppingcartBack
   ```

2. Run the back-end server:

   ```bash
   npm run serve
   ```

## Running Tests

### Front-end Tests:
1. Navigate to the `shoppingcartFront` directory:

   ```bash
   cd shoppingcartFront
   ```

2. Run the front-end tests:

   ```bash
   npm run test
   ```

### Back-end Tests:
1. Navigate to the `shoppingcartBack` directory:

   ```bash
   cd shoppingcartBack
   ```

2. Run the back-end tests:

   ```bash
   npm run test
   ```
```