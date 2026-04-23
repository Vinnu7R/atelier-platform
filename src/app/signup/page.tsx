import { signUp } from './actions'

export default function SignupPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string }
}) {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 min-h-screen mx-auto">
      <form
        className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
        action={signUp}
      >
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-ink text-paper rounded-md px-4 py-2 mb-2">
          Sign Up
        </button>
        {searchParams?.error && (
          <p className="mt-4 p-4 bg-accent/10 text-accent text-center">
            {searchParams.error}
          </p>
        )}
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-ink/10 text-ink text-center">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  )
}
