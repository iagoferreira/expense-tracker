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
    <div className="p-2 flex gap-2 max-w-2xl m-auto">
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
