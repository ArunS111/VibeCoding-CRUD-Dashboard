# Dependencies — Project Apex

## Frontend (package.json)
| Package                     | Version   | Purpose |
|-----------------------------|-----------|---------|
| react                       | ^18.3.0   | UI framework |
| react-dom                   | ^18.3.0   | DOM renderer |
| typescript                  | ^5.4.0    | Type safety |
| vite                        | ^5.2.0    | Build tool / dev server |
| @vitejs/plugin-react        | ^4.2.0    | Vite React plugin |
| tailwindcss                 | ^3.4.0    | Utility CSS |
| postcss                     | ^8.4.0    | Tailwind dependency |
| autoprefixer                | ^10.4.0   | Tailwind dependency |
| zustand                     | ^4.5.0    | Global UI state |
| @tanstack/react-query       | ^5.32.0   | Server state / caching |
| axios                       | ^1.6.0    | HTTP client |
| recharts                    | ^2.12.0   | Charts (stretch) |
| lucide-react                | ^0.376.0  | Icons |

### Dev Dependencies
| Package                          | Version   | Purpose |
|----------------------------------|-----------|---------|
| @types/react                     | ^18.3.0   | React types |
| @types/react-dom                 | ^18.3.0   | ReactDOM types |
| eslint                           | ^8.57.0   | Linting |
| @typescript-eslint/eslint-plugin | ^7.0.0    | TS lint rules |
| @typescript-eslint/parser        | ^7.0.0    | TS lint parser |
| vitest                           | ^1.5.0    | Unit test runner |
| @vitest/ui                       | ^1.5.0    | Vitest UI |
| @testing-library/react           | ^15.0.0   | Component testing |
| @testing-library/user-event      | ^14.5.0   | User interaction simulation |
| @testing-library/jest-dom        | ^6.4.0    | DOM matchers |
| jsdom                            | ^24.0.0   | DOM environment for tests |
| @playwright/test                 | ^1.44.0   | E2E testing |

## Backend (pom.xml — Spring Boot 3.2.x, Java 17)
| Dependency                               | Scope    | Purpose |
|------------------------------------------|----------|---------|
| spring-boot-starter-web                  | compile  | REST controllers, embedded Tomcat |
| spring-boot-starter-data-jpa             | compile  | JPA / Hibernate ORM |
| spring-boot-starter-validation           | compile  | Jakarta Bean Validation |
| postgresql                               | runtime  | JDBC driver |
| lombok                                   | provided | Boilerplate reduction |
| spring-boot-starter-test                 | test     | JUnit 5, Mockito |
| spring-boot-testcontainers               | test     | Testcontainers integration |
| testcontainers:postgresql                | test     | Real DB for integration tests |
| com.h2database:h2                        | test     | In-memory DB for unit tests |

## Inter-Service Dependencies
- Frontend calls backend via `VITE_API_BASE_URL` env var (default: `http://localhost:8080`)
- Backend connects to PostgreSQL via `SPRING_DATASOURCE_URL` env var
- Docker Compose wires all three services via internal network `apex-net`
- In production, nginx proxies `/api/*` to `backend:8080` — no CORS headers needed
