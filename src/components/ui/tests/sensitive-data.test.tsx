import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SensitiveData } from "../sensitive-data";
import { TooltipProvider } from "../tooltip";

function renderWithProviders(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

describe("SensitiveData", () => {
  it("exibe valor mascarado por padrão", () => {
    renderWithProviders(<SensitiveData masked="***.***.***-00" />);
    expect(screen.getByText("***.***.***-00")).toBeInTheDocument();
  });

  it("exibe '---' quando masked é falsy", () => {
    renderWithProviders(<SensitiveData masked="" />);
    expect(screen.getByText("---")).toBeInTheDocument();
  });

  it("exibe botão de revelar quando canReveal é true", () => {
    renderWithProviders(<SensitiveData masked="***" canReveal />);
    expect(screen.getByRole("button", { name: "Revelar" })).toBeInTheDocument();
  });

  it("não exibe botão de revelar quando canReveal é false", () => {
    renderWithProviders(<SensitiveData masked="***" canReveal={false} />);
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("revela valor ao clicar em revelar", async () => {
    const onReveal = vi.fn().mockResolvedValue("123.456.789-00");
    renderWithProviders(<SensitiveData masked="***.***-00" onReveal={onReveal} />);
    await userEvent.click(screen.getByRole("button", { name: "Revelar" }));
    await waitFor(() => {
      expect(screen.getByText("123.456.789-00")).toBeInTheDocument();
    });
  });

  it("exibe botão de ocultar após revelação", async () => {
    const onReveal = vi.fn().mockResolvedValue("123.456.789-00");
    renderWithProviders(<SensitiveData masked="***.***-00" onReveal={onReveal} />);
    await userEvent.click(screen.getByRole("button", { name: "Revelar" }));
    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Ocultar" })).toBeInTheDocument();
    });
  });

  it("não chama onReveal se não fornecido", async () => {
    renderWithProviders(<SensitiveData masked="***" canReveal />);
    const btn = screen.getByRole("button");
    await userEvent.click(btn);
    // sem erro, já que onReveal é undefined — o handleReveal retorna cedo
  });
});
