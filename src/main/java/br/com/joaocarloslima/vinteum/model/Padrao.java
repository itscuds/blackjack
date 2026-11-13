package br.com.joaocarloslima.vinteum.model;

public class Padrao extends EstiloDeJogo {

    @Override
    public String getNome() {
        return "Padrão";
    }

    @Override
    public boolean devePedirCarta(int pontosMesa) {
        return pontosMesa < 17;
    }
}