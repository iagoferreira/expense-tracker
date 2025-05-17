import * as React from 'react'
import {
  createRootRouteWithContext,
  Link,
  Outlet
} from '@tanstack/react-router'
import { type QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function Navbar() {
  return (
    <div className="p-2 flex justify-between max-w-2xl m-auto items-baseline">
      <h1 className="text-xl">Expense Tracker</h1>
      <div className="flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>
        <Link to="/expenses" className="[&.active]:font-bold">
          Expenses
        </Link>
        <Link to="/create-expense" className="[&.active]:font-bold">
          Create
        </Link>
        <Link to="/profile" className="[&.active]:font-bold">
          Profile
        </Link>
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
    </div>
  )
}

function RootComponent() {
  return (
    <React.Fragment>
      <Navbar />
      <div className="p-2 gap-2 max-w-2xl m-auto">
        <Outlet />
      </div>
    </React.Fragment>
  )
}
