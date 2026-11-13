package br.com.joaocarloslima.vinteum.model;

import java.util.Objects;

public class Carta {

    private final String valor;
    private final Naipe naipe;

    public Carta(String valor, Naipe naipe) {
        this.valor = Objects.requireNonNull(valor);
        this.naipe = Objects.requireNonNull(naipe);

        validarValor(valor);
    }

    public Carta(int valor, Naipe naipe) {
        this(String.valueOf(valor), naipe);
    }

    private void validarValor(String valor) {
        if (!valor.matches("(10|[2-9]|Ace|Jack|Queen|King)")) {
            throw new IllegalArgumentException(
                    "Valor de Carta invalido: " + valor
            );
        }
    }

    public String getValor() {
        return valor;
    }

    public Naipe getNaipe() {
        return naipe;
    }

    public int getPontos() {
        return switch (valor) {
            case "Ace" -> 11;
            case "Jack", "Queen", "King" -> 10;
            default -> Integer.parseInt(valor);
        };
    }

    public String getImagem() {
        return valor + naipe.getNomeImagem() + ".png";
    }

    public boolean isAs() {
        return "Ace".equals(valor);
    }

    @Override
    public String toString() {
        return valor + " de " + naipe.name().toLowerCase();
    }
}