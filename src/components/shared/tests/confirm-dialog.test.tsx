import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ConfirmDialog } from "../confirm-dialog";

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  title: "Confirmar exclusão",
  description: "Esta ação não pode ser desfeita.",
  onConfirm: vi.fn(),
};

describe("ConfirmDialog", () => {
  it("renderiza título e descrição quando aberto", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByText("Confirmar exclusão")).toBeInTheDocument();
    expect(screen.getByText("Esta ação não pode ser desfeita.")).toBeInTheDocument();
  });

  it("usa label padrão 'Confirmar'", () => {
    render(<ConfirmDialog {...defaultProps} />);
    expect(screen.getByRole("button", { name: "Confirmar" })).toBeInTheDocument();
  });

  it("usa label personalizado para confirmar", () => {
    render(<ConfirmDialog {...defaultProps} confirmLabel="Excluir" />);
    expect(screen.getByRole("button", { name: "Excluir" })).toBeInTheDocument();
  });

  it("chama onConfirm ao clicar em confirmar", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...defaultProps} onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Confirmar" }));
    expect(onConfirm).toHaveBeenCalledOnce();
  });

  it("não renderiza conteúdo quando fechado", () => {
    render(<ConfirmDialog {...defaultProps} open={false} />);
    expect(screen.queryByText("Confirmar exclusão")).toBeNull();
  });

  it("exibe 'Aguarde...' durante loading", () => {
    render(<ConfirmDialog {...defaultProps} isLoading />);
    expect(screen.getByText("Aguarde...")).toBeInTheDocument();
  });

  it("desabilita botões durante loading", () => {
    render(<ConfirmDialog {...defaultProps} isLoading />);
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
  });
});
