# Tech Stack — Project Apex

## Frontend
| Layer        | Choice          | Version  | Justification |
|--------------|-----------------|----------|---------------|
| Framework    | React           | 18.3.x   | Component model fits CRUD dashboard; massive ecosystem |
| Build Tool   | Vite            | 5.x      | Fast HMR, minimal config, ideal for SPA |
| Language     | TypeScript      | 5.x      | Type safety across API contracts and component props |
| Styling      | Tailwind CSS    | 3.x      | Utility-first, consistent tokens, easy table/modal styling |
| Global State | Zustand         | 4.x      | Lightweight store; no Redux boilerplate |
| Server State | TanStack Query  | 5.x      | API caching, refetch, optimistic mutation |
| HTTP Client  | Axios           | 1.x      | Interceptors, typed responses, error normalisation |
| Charts       | Recharts        | 2.x      | Declarative React charts for category chart (stretch) |
| Icons        | Lucide React    | latest   | Tree-shakeable, consistent icon set |

## Backend
| Layer        | Choice                      | Version  | Justification |
|--------------|-----------------------------|----------|---------------|
| Language     | Java                        | 17 LTS   | LTS stability, modern records/sealed classes |
| Framework    | Spring Boot                 | 3.2.x    | Auto-config, embedded Tomcat, production-ready |
| Build        | Maven                       | 3.9.x    | Standard Spring ecosystem dependency management |
| ORM          | Spring Data JPA + Hibernate | via Boot | Repository abstraction, JPQL, auto schema |
| Validation   | Jakarta Bean Validation     | via Boot | @Valid, @NotBlank, @Min on request DTOs |
| Utilities    | Lombok                      | 1.18.x   | Eliminates getter/setter/constructor boilerplate |
| File Upload  | Spring Web MultipartFile    | via Boot | Built-in multipart for image uploads (stretch) |

## Database
| Choice      | Version | Justification |
|-------------|---------|---------------|
| PostgreSQL  | 15      | ACID, production-grade, Docker-native |

## API Style
REST over HTTP/JSON. Base path: `/api`. CORS configured for frontend origin.

## Containerisation
| Tool           | Purpose |
|----------------|---------|
| Docker         | Multi-stage builds — nginx for frontend, JRE 17 slim for backend |
| Docker Compose | Local orchestration of frontend + backend + PostgreSQL |

## CI/CD
| Tool            | Purpose |
|-----------------|---------|
| GitHub Actions  | Lint → Test → Build → Docker push on PR and push to main |
