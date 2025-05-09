import * as React from 'react'
import {
  createRootRoute,
  Link,
  Outlet
} from '@tanstack/react-router'

export const Route = createRootRoute({
  component: RootComponent,
})

function Navbar() {
  return (
    <div className="p-2 flex gap-2">
      <Link to="/" className="[&.active]:font-bold">
        Home
      </Link>
      <Link to="/expenses" className="[&.active]:font-bold">
        Expenses
      </Link>
      <Link to="/create-expense" className="[&.active]:font-bold">
        Create
      </Link>
    </div>
  )
}

function RootComponent() {
  return (
    <React.Fragment>
      <Navbar />
      <Outlet />
    </React.Fragment>
  )
}
