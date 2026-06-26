import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { StatusBadge } from "../status-badge";

describe("StatusBadge", () => {
  it("renderiza o label passado", () => {
    render(<StatusBadge label="Ativo" variant="success" />);
    expect(screen.getByText("Ativo")).toBeInTheDocument();
  });

  it("renderiza variante de erro", () => {
    const { container } = render(<StatusBadge label="Cancelado" variant="destructive" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renderiza variante de aviso", () => {
    render(<StatusBadge label="Pausado" variant="warning" />);
    expect(screen.getByText("Pausado")).toBeInTheDocument();
  });
});
