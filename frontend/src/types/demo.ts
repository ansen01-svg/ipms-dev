/**
 * Type definitions for demo pages
 * 
 * This file contains all TypeScript interfaces and types used in our SSR and SSG examples.
 * Centralizing types here promotes code reusability and type safety across components.
 */

/**
 * User interface representing a user from an external API
 * Used in SSR demo to show real-time data fetching
 */
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
  };
}

/**
 * Product interface for SSG demo
 * Represents products that would be pre-rendered at build time
 */
export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

/**
 * Statistics interface for dashboard-style components
 * Used to display metrics and KPIs
 */
export interface Stats {
  label: string;
  value: string | number;
  change: number; // Percentage change
  trend: 'up' | 'down' | 'neutral';
  icon: string; // Icon identifier
}

/**
 * Filter state interface for SSG demo
 * Demonstrates useState with proper typing
 */
export interface FilterState {
  category: string;
  priceRange: {
    min: number;
    max: number;
  };
  sortBy: 'price' | 'rating' | 'name';
  searchTerm: string;
}

/**
 * API Response wrapper for consistent data handling
 * Generic type that can wrap any data type
 */
export interface ApiResponse<T> {
  data: T;
  status: 'success' | 'error' | 'loading';
  message?: string;
  timestamp: string;
}

/**
 * Page metadata interface for SEO and page information
 * Used in both SSR and SSG pages
 */
export interface PageMetadata {
  title: string;
  description: string;
  lastUpdated: string;
  renderType: 'SSR' | 'SSG';
  benefits: string[];
}