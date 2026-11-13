package br.com.joaocarloslima.vinteum.model;

public abstract class EstiloDeJogo {
    public abstract String getNome();

    public abstract boolean devePedirCarta(int pontosMesa);
}
