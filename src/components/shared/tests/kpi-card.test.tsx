import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Users } from "lucide-react";
import { KpiCard } from "../kpi-card";

describe("KpiCard", () => {
  it("renderiza label e valor", () => {
    render(<KpiCard label="Clientes" value={42} icon={Users} />);
    expect(screen.getByText("Clientes")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("exibe '—' quando value é null", () => {
    render(<KpiCard label="Total" value={null} icon={Users} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("exibe '—' quando value é undefined", () => {
    render(<KpiCard label="Total" value={undefined} icon={Users} />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("renderiza skeleton de loading", () => {
    const { container } = render(<KpiCard label="Total" value={0} icon={Users} loading />);
    expect(container.querySelector(".animate-pulse")).toBeTruthy();
  });

  it("renderiza trend positiva", () => {
    render(<KpiCard label="Total" value={10} icon={Users} trend={{ value: 15, positive: true }} />);
    expect(screen.getByText(/15%/)).toBeInTheDocument();
    expect(screen.getByText(/↑/)).toBeInTheDocument();
  });

  it("renderiza trend negativa", () => {
    render(<KpiCard label="Total" value={10} icon={Users} trend={{ value: 5, positive: false }} />);
    expect(screen.getByText(/↓/)).toBeInTheDocument();
  });

  it("renderiza subtitle quando fornecido", () => {
    render(<KpiCard label="Total" value={10} icon={Users} subtitle="vs mês anterior" />);
    expect(screen.getByText("vs mês anterior")).toBeInTheDocument();
  });
});
