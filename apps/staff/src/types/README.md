# Types Organization

This directory contains all TypeScript type definitions for the staff application.

## Structure

- `index.ts` - Main types export file
- `orders.ts` - Order-related types and interfaces
- `README.md` - This documentation file

## Usage

### Importing Types

```typescript
// Import specific types
import type { OrderWithDetails, StaffUser } from '@/types';

// Import all types from a specific module
import type { OrderStats, StaffOrdersClientProps } from '@/types/orders';
```

### Adding New Types

1. Create a new file for your domain (e.g., `menu.ts` for menu-related types)
2. Define your interfaces and types
3. Export them from the file
4. Add them to `index.ts` if they should be available globally

### Type Guidelines

- Use descriptive interface names (e.g., `OrderWithDetails` instead of `Order`)
- Include JSDoc comments for complex types
- Group related types in the same file
- Use consistent naming conventions (PascalCase for interfaces, camelCase for properties)

## Common Types

### OrderWithDetails
Complete order information including items, table, and staff assignment.

### OrderStats
Statistics for order counts by status.

### StaffUser
Staff member information with permissions and role.

## Utility Functions

Common formatting and utility functions are available in `@/utils/format`:

- `formatCurrency(amount: number)` - Format as Nigerian Naira
- `formatDate(date: Date)` - Format date to readable string 