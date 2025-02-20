# System Patterns

## Component Architecture

### Modal System
- Using Radix UI for accessible modal dialogs
- Custom dialog wrapper for consistent styling
- Centralized modal state management
- Keyboard navigation support
- Focus management patterns

### Photo Viewing
```mermaid
graph TD
    A[PhotoGrid] --> B[PhotoCard]
    B --> C[PhotoModal]
    C --> D[ImageViewer]
    C --> E[InfoPanel]
    E --> F[MetadataDisplay]
    E --> G[TagDisplay]
```

### Tag System
```mermaid
graph TD
    A[Photo] --> B[PhotoTags]
    B --> C[TagBadge]
    D[TagContext] --> B
    E[TagManagement] --> D
```

## Data Flow

### Photo Data
```mermaid
graph LR
    A[Supabase] --> B[API Routes]
    B --> C[React Query]
    C --> D[Components]
    D --> E[UI State]
```

### Tag Management
```mermaid
graph TD
    A[Supabase Tags] --> B[Photo Tags]
    B --> C[UI Components]
    C --> D[User Actions]
    D --> E[API Updates]
    E --> A
```

## State Management
- React Query for server state
- Local state for UI interactions
- Context for shared state
- Optimistic updates for better UX

## Error Handling
- Boundary pattern for component errors
- API error handling with proper feedback
- Type-safe error handling
- Graceful degradation

## Performance Patterns
- Image optimization
- Lazy loading
- Virtualization for large lists
- Proper caching strategies

## Accessibility Patterns
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

## Testing Strategy
- Component testing with Cypress
- Unit tests with Vitest
- Integration tests for critical paths
- E2E testing for user flows

## Code Organization
```
src/
  components/
    features/
      photo/
        PhotoModal.tsx
        PhotoGrid.tsx
    ui/
      Dialog.tsx
      Badge.tsx
  types/
    index.ts
    database.ts
  lib/
    api/
    utils.ts
```

## Best Practices
- Type safety throughout
- Component composition
- Single responsibility
- DRY principles
- Progressive enhancement
