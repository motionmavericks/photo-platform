# Technical Context

## Core Technologies

### Frontend
- Next.js 14 with App Router
- React 18 with Server Components
- TypeScript for type safety
- Tailwind CSS for styling
- Radix UI for accessible components
- React Query for data fetching

### Backend
- Supabase for data storage and auth
- Next.js API routes
- PostgreSQL database
- Edge runtime for API routes

### Image Processing
- Next.js Image component
- Sharp for image optimization
- Supabase Storage for image files

## Development Setup

### Environment Requirements
- Node.js 18+
- npm 9+
- Git
- VSCode (recommended)

### Key Dependencies
```json
{
  "@radix-ui/react-dialog": "latest",
  "@tanstack/react-query": "latest",
  "next": "14.x",
  "react": "18.x",
  "tailwindcss": "latest",
  "typescript": "5.x"
}
```

## Technical Decisions

### Modal Implementation
- Using Radix UI for accessibility
- Custom dialog wrapper for styling
- Centralized state management
- Keyboard navigation support

### Photo Handling
- Server-side image optimization
- Responsive image loading
- Progressive enhancement
- Caching strategies

### Tag System
- Structured data in Supabase
- Type-safe tag handling
- Efficient tag queries
- Real-time updates

### State Management
- React Query for server state
- Local state for UI
- Context for shared state
- Optimistic updates

## Technical Constraints

### Performance
- Image size optimization
- Lazy loading
- Code splitting
- Bundle optimization

### Security
- API route protection
- Input validation
- Secure image storage
- Type safety

### Accessibility
- ARIA compliance
- Keyboard navigation
- Screen reader support
- Focus management

## Development Workflow

### Code Organization
```
src/
  app/             # Next.js app router
  components/      # React components
  lib/            # Utilities and helpers
  types/          # TypeScript types
  hooks/          # Custom hooks
```

### Testing Strategy
- Cypress for E2E
- Vitest for unit tests
- Component testing
- Integration tests

### Build Process
- TypeScript compilation
- Tailwind CSS processing
- Image optimization
- Bundle analysis

### Deployment
- Vercel platform
- Edge functions
- CDN caching
- Environment variables
