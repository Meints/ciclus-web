import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Users } from "lucide-react";
import { EmptyState } from "../empty-state";

describe("EmptyState", () => {
  it("renderiza título", () => {
    render(<EmptyState title="Nenhum cliente encontrado" />);
    expect(screen.getByText("Nenhum cliente encontrado")).toBeInTheDocument();
  });

  it("renderiza descrição quando fornecida", () => {
    render(<EmptyState title="Vazio" description="Crie seu primeiro registro" />);
    expect(screen.getByText("Crie seu primeiro registro")).toBeInTheDocument();
  });

  it("não renderiza descrição quando ausente", () => {
    render(<EmptyState title="Vazio" />);
    expect(screen.queryByText("Crie seu primeiro registro")).toBeNull();
  });

  it("renderiza ícone padrão (InboxIcon)", () => {
    const { container } = render(<EmptyState title="Vazio" />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renderiza ícone personalizado", () => {
    const { container } = render(<EmptyState title="Vazio" icon={Users} />);
    expect(container.querySelector("svg")).toBeTruthy();
  });

  it("renderiza action quando fornecida", () => {
    render(<EmptyState title="Vazio" action={<button>Criar</button>} />);
    expect(screen.getByRole("button", { name: "Criar" })).toBeInTheDocument();
  });
});
