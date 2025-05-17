import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="flex flex-col gap-2">
      <div>About page</div>
      <div className="text-stone-500">Fake page that needs no authorization</div>
    </div>
  )
}
