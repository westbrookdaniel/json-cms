# json-cms

This is a JSON file based content layer and CMS that allows inline editing with changes stored
in local storage, with the ability to export all changed as a new complete JSON file.

To get started copy (and read) the code in `./content/` into your own project.

## Example

```tsx
import { Content } from "@/content";
import { ToggleEditButton } from "@/content/toggle";

export default function Home() {
  return (
    <div className="p-16 mx-auto max-w-4xl">
      <div className="mb-32">
        <h1>
          <Content path="home.title" />
        </h1>
      </div>
      <ToggleEditButton />
    </div>
  );
}
```

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
