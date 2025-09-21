# My Dashboard App

A responsive React dashboard with data visualization, order management, and dark mode support.
Link to Dashboard - https://abhay-baghel.github.io/Dashboard-APP

## 🚀 Features

- Interactive charts and analytics dashboard
- Order management with filtering and search
- Responsive design with dark/light theme
- Real-time data visualization

## � Setup & Installation

### Prerequisites

- Node.js (v16.0+)
- npm (v8.0+)

Check versions:

```bash
node --version
npm --version
```

### Local Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd my-dashboard-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm run start
```

App opens at `http://localhost:3000`

### Available Scripts

```bash
npm run start          # Start development server
npm run run build      # Build for production
npm run test           # Run all tests
npm run test -- --coverage  # Run tests with coverage
```

## 📁 Project Structure

```
src/
├── components/     # React components (Dashboard, Header, Charts, etc.)
├── data/          # JSON mock data files
├── App.js         # Main application
├── index.css      # Global styles
└── setupTests.js  # Test configuration
```
## Application Flow & User Actions

- **Any route** (`/`, `/Dashboard-APP/`, or any other path) → **Redirects to `/api/homepage`**
- **`/api/homepage`** → Main dashboard view
- **`/api/orders`** → Orders management view

**Landing Page (Dashboard)**
**Route**: `/api/homepage`

**Available Actions**:

- 🌙 **Toggle Theme**: Switch between light and dark mode using the theme toggle on the header
- 🔔 **Open Notifications**: Click notification bell to view recent alerts and updates
- **Navigate to Orders**: Click "Orders" button on SideBar or Tile on homepage to access orders
- Click on Dashboard on sidebar to return back to homepage

  **Orders Management Page**
  **Route**: `/api/orders`

**Available Actions**:

- **Search Orders**: Use search bar to find specific orders by ID, customer, or product
- **Filter by Status**: Filter orders by status (Pending, Shipped, Delivered, Cancelled)
- **Sort Orders**: Sort by date, amount, or status
- **View Order Details**: Click on any order row to view detailed information
- **Return to Dashboard**: Use back button to return to main dashboard

### Running Specific Tests

```bash
# Run tests for a specific component
npm run test -- --testPathPattern=Products.test.jsx

# Run tests in watch mode
npm run test -- --watch

# Run tests with verbose output
npm run test -- --verbose
```

## 🎨 Design Decisions & Architecture

### 1. **Component Architecture**

- **Modular Design**: Each component handles a specific functionality (charts, tables, navigation)
- **Props-based Communication**: Clean data flow between parent and child components
- **Responsive Design**: Mobile-first approach using Tailwind CSS breakpoints

### 2. **State Management**

- **Local State**: Using React hooks (useState, useEffect) for component-specific state
- **Event Handling**: Centralized event handlers for cross-component communication

### 3. **Styling Strategy**

- **Component Styles**: SCSS modules for component-specific styling
- **CSS Variables**: Custom properties for theming and dark mode support
- **Responsive Design**: Breakpoint-based responsive behavior

### 4. **Data Management**

- **Static JSON**: Mock data stored in JSON files for development
- **Async Loading**: Simulated API calls with loading states
- **Error Handling**: Comprehensive error boundaries and fallback states

## 🚧 Challenges Faced

- Dark mode implementation required consistent theming across all components and maintaining readability
- Assuming user flow patterns without real user data led to iterative design adjustments
- Making the dashboard adaptable to window resizing while preserving chart proportions and table layouts
- Managing state synchronization between multiple dashboard components without a central store
- Handling dynamic data rendering with loading states while maintaining smooth user interactions
- Making the necessary changes to avoid horizontal scrolling on the OrdersList page

## ✨ Improvements Made

### 1. **Performance Optimizations**

- **Lazy Loading**: Simulated async data loading with loading states
- **Error Boundaries**: error handling throughout the application in case data is not fetched
- **Optimized Re-renders**: Proper state management to minimize unnecessary rendering

### 2. **User Experience Enhancements**

- **Loading States**: Visual feedback during data loading for orders list
- **Hover Effects**: Interactive elements with smooth transitions
- **Mobile Navigation**: Collapsible sidebar and responsive header in small screens
- **Search & Filtering**: Advanced filtering capabilities in order management
- **ARIA Labels**: Screen reader support for interactive elements
- **Keyboard Navigation**: keyboard accessibility to various elements

**Built using React and modern web technologies**
