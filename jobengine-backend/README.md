# JobEngine - Backend API Server

This is the central Spring Boot backend for the JobEngine recruitment platform. It handles all database operations, JWT authentication, core business logic, and communicates with the Python AI microservice and n8n webhook automations.

## Architecture & Structure 

The backend is built using the **Layered Architecture (N-Tier)** structure. Instead of organizing strictly by feature, the codebase is separated by technical responsibility, which is the standard highly scalable convention for Spring Boot APIs. 

The structure is divided as follows:

```text
com.jobengine
├── config/       # Global application configurations (Security, MongoDB configs, CORS)
├── controller/   # REST API Endpoints (The entry point for frontend HTTP requests)
├── dto/          # Data Transfer Objects (Request & Response schemas for the API)
├── exception/    # Custom Exception classes and Global Exception Handler mapped to HTTP codes
├── model/        # MongoDB Document Entities representing database collections
├── repository/   # Data Access Layer interfaces for MongoDB queries
├── security/     # JWT Token Generation, Authentication Filters & User Details Logic
└── service/      # Core Business Logic processing (The "brains" of the application)
```

## How This Was Built (Step-by-Step Overview)

The development of this backend was done in 7 strategic phases to ensure a robust foundation.

### Phase 1: Infrastructure & Docker Setup
- **Docker MongoDB**: Provided a `docker-compose.yml` to instantly spin up a local MongoDB 7.0 database and Mongo-Express UI without having to install it directly on your machine.
- **Spring Initializr**: Generated the base Spring Boot project using Java 17 and Maven wrapper `mvnw` to keep builds consistent across the team.
- **Dependencies Setup**: Added `jjwt` for JSON Web Tokens and `springdoc-openapi` for Swagger documentation. Configured properties in `application.yml` targeting local port `8088`.

### Phase 2: Foundation (Models & Enums)
- Designed the core NoSQL structures required by the Cahier des Charges.
- Created `enums` like `Role` (Admin, Candidate, Recruiter) to strictly type the data.
- Created MongoDB `@Document` classes: `User`, `CandidateProfile`, `RecruiterProfile`, `Job`, `Cv`, and `Application`.
- Built Spring Data `MongoRepository` interfaces with custom queries (e.g., `findByEmail`).

### Phase 3: DTOs & Exception Handling
- To prevent exposing sensitive database schemas directly to the frontend, we created Data Transfer Objects (`LoginRequest`, `RegisterRequest`, `JobResponse`).
- Implemented an `ApiResponse<T>` wrapper class to guarantee a standard standardized JSON output for both successes and error faults.
- Created a `@RestControllerAdvice` (`GlobalExceptionHandler`) to translate server errors into clean 400/404/401 API responses.

### Phase 4: Core Security (JWT)
- Configured Spring Security to use stateless sessions instead of session cookies.
- Built a `JwtTokenProvider` to securely create and validate tokens using an HMAC-SHA256 signature.
- Configured CORS (Cross-Origin Resource Sharing) to safely accept requests from your Vite frontend (`http://localhost:8080` & `http://localhost:5173`).

### Phase 5: Business Logic (Services)
- **AuthService**: Handles BCrypt password hashing and user creation logic.
- **JobService**: Encapsulates job creation by recruiters and query fetching.
- **CvService**: Validates incoming PDF/DOCX multi-part files, converts them to binary, and handles database storage.
- **ApplicationService**: Manages job applications natively, preventing duplicate applications.
- **MatchingService**: Acts as an HTTP client proxy, bridging Spring Boot with your Python AI Microservice via standard POST requests.
- **WebhookService**: Asynchronously triggers HTTP posts to your n8n workflow engine URLs.

### Phase 6: REST API (Controllers)
- Wired the services directly to route mappings (e.g. `@PostMapping`, `@GetMapping`).
- Restricted routes using `@PreAuthorize("hasRole('ADMIN')")` or `hasRole('RECRUITER')` to maintain strict access control over the endpoints. 

### Phase 7: Verification 
- Resolved compiling differences across JDK environments.
- Evaded port collisions by migrating the API to port `8088`.
- Generated interactive Swagger UI documentation natively.

---

## Getting Started

### 1. Prerequisites 
- **Docker Desktop** running in the background.

### 2. Start the Database
Open terminal at the root of the project (desktop/pfa) and run:
```bash
docker compose up -d
```
You can view the raw database at `http://localhost:8081` (Mongo-Express).

### 3. Start the Application
Open a terminal in the `jobengine-backend` folder and use the Maven Wrapper:
```bash
# Windows
.\mvnw.cmd spring-boot:run

# Mac/Linux
./mvnw spring-boot:run
```

### 4. Interactive API Documentation
Once running, to test endpoints or view data payloads, navigate to:
**[http://localhost:8088/swagger-ui.html](http://localhost:8088/swagger-ui.html)**
