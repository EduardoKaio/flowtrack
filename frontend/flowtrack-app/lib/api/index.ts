"use client"

/**
 * FlowTrack API Client
 *
 * This module provides a centralized API client for interacting with the Spring Boot backend.
 *
 * ## Setup
 *
 * 1. Ensure your Spring Boot backend is running at http://localhost:8080
 * 2. Import the API functions you need in your components
 * 3. Call the functions to fetch/update data
 *
 * ## Example Usage
 *
 * ```typescript
 * import { getAllTasks, createTask } from "@/lib/api"
 *
 * // In your component
 * useEffect(() => {
 *   async function loadTasks() {
 *     try {
 *       const tasks = await getAllTasks()
 *       setTasks(tasks)
 *     } catch (error) {
 *       console.error("Failed to load tasks:", error)
 *       // Fallback to mock data or show error
 *     }
 *   }
 *   loadTasks()
 * }, [])
 * ```
 *
 * ## Migration Strategy
 *
 * To migrate from mock data to real API:
 *
 * 1. Replace useState initialization with useEffect + API call
 * 2. Add error handling with try/catch
 * 3. Keep mock data as fallback during development
 * 4. Test each endpoint individually
 *
 * ## Environment Variables
 *
 * Set NEXT_PUBLIC_API_URL in your .env.local file:
 * ```
 * NEXT_PUBLIC_API_URL=http://localhost:8080/api
 * ```
 */

// Export all API functions
export * from "./tasks"
export * from "./categories"
export * from "./habits"
export * from "./focus"
export * from "./mood"
export * from "./reports"
export { API_BASE_URL } from "./config"
