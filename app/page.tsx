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
