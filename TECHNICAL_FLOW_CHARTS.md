# Campus Connect - Technical Architecture Flow Charts

## 🏗️ System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js Application]
        B[React Components]
        C[TailwindCSS + Neumorphic UI]
        D[TypeScript]
    end
    
    subgraph "Backend Services"
        E[Supabase Authentication]
        F[PostgreSQL Database]
        G[API Routes]
        H[Row Level Security]
    end
    
    subgraph "Blockchain Layer"
        I[Ethereum Network]
        J[CampusCoin Contract]
        K[NFT Badge Contract]
        L[IPFS Storage]
    end
    
    subgraph "External Services"
        M[Email Service]
        N[Push Notifications]
        O[File Storage]
    end
    
    A --> E
    A --> G
    B --> C
    C --> D
    E --> F
    G --> F
    F --> H
    A --> I
    I --> J
    I --> K
    K --> L
    G --> M
    A --> N
    L --> O
```

## 🔄 User Journey Flow Chart

```mermaid
graph TD
    A[User Lands on Site] --> B{Authenticated?}
    B -->|No| C[Landing Page]
    B -->|Yes| D{User Role}
    
    C --> E[Sign Up / Log In]
    E --> F[Registration Process]
    F --> G[Profile Creation]
    G --> D
    
    D -->|Student| H[Student Dashboard]
    D -->|Admin| I[Admin Dashboard]
    D -->|Vendor| J[Vendor Dashboard]
    
    H --> K[View Events]
    H --> L[Check Balance]
    H --> M[Browse Marketplace]
    H --> N[View Badges]
    
    K --> O[Register for Event]
    O --> P[Attend Event]
    P --> Q[Earn Tokens]
    Q --> R[Update XP]
    R --> S{Badge Eligible?}
    S -->|Yes| T[Mint NFT Badge]
    S -->|No| U[Continue Activities]
    
    L --> V[Token History]
    M --> W[Purchase Items]
    W --> X[Smart Contract Transaction]
    X --> Y[Update Balances]
    
    I --> Z[User Management]
    I --> AA[Event Approval]
    I --> BB[Analytics Dashboard]
    
    J --> CC[Product Management]
    J --> DD[Order Processing]
    J --> EE[Sales Analytics]
```

## 🎯 Token Economy Flow

```mermaid
graph LR
    subgraph "Token Earning"
        A[Student Activity] --> B[Activity Verification]
        B --> C[Token Calculation]
        C --> D[Smart Contract Mint]
        D --> E[Balance Update]
    end
    
    subgraph "Token Spending"
        F[Marketplace Browse] --> G[Item Selection]
        G --> H[Balance Check]
        H --> I[Transaction Processing]
        I --> J[Smart Contract Transfer]
        J --> K[Order Fulfillment]
    end
    
    subgraph "Token Management"
        L[Admin Panel] --> M[Token Policy]
        M --> N[Reward Rules]
        N --> O[Distribution Logic]
        O --> P[Economic Balance]
    end
    
    E --> F
    K --> Q[Vendor Payment]
    P --> B
```

## 🏆 NFT Badge System Flow

```mermaid
graph TB
    A[Achievement Trigger] --> B{Badge Type}
    
    B -->|Attendance| C[Event Completion]
    B -->|Academic| D[Grade Achievement]
    B -->|Social| E[Community Participation]
    B -->|Leadership| F[Organization Role]
    
    C --> G[Verify Attendance]
    D --> H[Academic Record Check]
    E --> I[Activity Log Verification]
    F --> J[Leadership Confirmation]
    
    G --> K{Criteria Met?}
    H --> K
    I --> K
    J --> K
    
    K -->|Yes| L[Generate Badge Design]
    K -->|No| M[Update Progress]
    
    L --> N[Create Metadata]
    N --> O[Upload to IPFS]
    O --> P[Get IPFS Hash]
    P --> Q[Smart Contract Call]
    Q --> R[Mint NFT]
    R --> S[Transfer to User]
    S --> T[Update Profile]
    T --> U[Send Notification]
    
    M --> V[Progress Tracking]
    V --> W[Display Progress Bar]
```

## 🔐 Authentication & Security Flow

```mermaid
graph TD
    A[User Registration] --> B[Email Validation]
    B --> C[Password Hashing]
    C --> D[Supabase Auth.signUp]
    D --> E{Success?}
    
    E -->|Yes| F[Generate JWT Token]
    E -->|No| G[Error Handling]
    
    F --> H[Create User Profile]
    H --> I[Set RLS Policies]
    I --> J[Database Trigger]
    J --> K[Profile Completion]
    
    L[User Login] --> M[Credential Verification]
    M --> N[Supabase Auth.signIn]
    N --> O{Valid?}
    
    O -->|Yes| P[Generate Session]
    O -->|No| Q[Login Error]
    
    P --> R[Load User Data]
    R --> S[Apply Permissions]
    S --> T[Access Dashboard]
    
    G --> U[Debug Console]
    Q --> U
    U --> V[Error Display]
```

## 📱 Component Architecture Flow

```mermaid
graph TB
    subgraph "Page Level"
        A[App Router Pages]
        B[Layout Components]
        C[Page Components]
    end
    
    subgraph "Feature Level"
        D[Dashboard Components]
        E[Auth Components]
        F[Event Components]
        G[Marketplace Components]
    end
    
    subgraph "UI Level"
        H[Button Component]
        I[Card Component]
        J[Input Component]
        K[Badge Component]
        L[Navigation Component]
    end
    
    subgraph "Utility Level"
        M[Hooks (useAuth)]
        N[Utils Functions]
        O[Type Definitions]
        P[API Helpers]
    end
    
    A --> B
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    
    D --> H
    D --> I
    E --> J
    F --> K
    G --> L
    
    H --> M
    I --> N
    J --> O
    K --> P
```

## 🗄️ Database Schema Flow

```mermaid
graph LR
    subgraph "Authentication"
        A[auth.users] --> B[User ID]
    end
    
    subgraph "User Data"
        C[public.users] --> D[Profile Info]
        D --> E[XP & Level]
        E --> F[Badge Count]
    end
    
    subgraph "Activities"
        G[events] --> H[Event Details]
        I[event_registrations] --> J[Attendance]
        K[transactions] --> L[Token History]
    end
    
    subgraph "Achievements"
        M[badges] --> N[Badge Definitions]
        O[user_badges] --> P[Earned Badges]
    end
    
    B --> C
    C --> I
    C --> K
    C --> O
    G --> I
    I --> K
    M --> O
```

## 🚀 Deployment & CI/CD Flow

```mermaid
graph LR
    A[Code Commit] --> B[GitHub Action]
    B --> C[Run Tests]
    C --> D{Tests Pass?}
    
    D -->|Yes| E[Build Application]
    D -->|No| F[Notify Developer]
    
    E --> G[Deploy to Vercel]
    G --> H[Health Check]
    H --> I{Deploy Success?}
    
    I -->|Yes| J[Update Production]
    I -->|No| K[Rollback]
    
    J --> L[Send Notification]
    K --> F
    F --> M[Debug & Fix]
    M --> A
```

## 🔧 Development Workflow

```mermaid
graph TD
    A[Feature Request] --> B[Design Review]
    B --> C[Technical Planning]
    C --> D[Component Development]
    
    D --> E[Unit Testing]
    E --> F[Integration Testing]
    F --> G[Code Review]
    G --> H{Review Approved?}
    
    H -->|Yes| I[Merge to Main]
    H -->|No| J[Address Feedback]
    
    I --> K[Automated Testing]
    K --> L[Staging Deployment]
    L --> M[QA Testing]
    M --> N{QA Approved?}
    
    N -->|Yes| O[Production Deploy]
    N -->|No| P[Bug Fixes]
    
    J --> D
    P --> D
```

This comprehensive flow chart documentation provides a complete understanding of the Campus Connect implementation methodology, covering all technical aspects from user authentication to blockchain integration.