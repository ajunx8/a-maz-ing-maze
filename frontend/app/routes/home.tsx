import type { Route } from "./+types/home";
import { Welcome } from "../components/welcome/welcome";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "A-MAZE-ING-MAZE" },
    { name: "description", content: "Welcome to the A-MAZE-ING-MAZE!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
