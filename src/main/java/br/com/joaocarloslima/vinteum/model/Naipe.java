package br.com.joaocarloslima.vinteum.model;

public enum Naipe {
    COPAS("Hearts"),
    OUROS("Diamonds"),
    ESPADAS("Spades"),
    PAUS("Clubs");

    private final String nomeImagem;

    Naipe(String nomeImagem){
        this.nomeImagem = nomeImagem;
    }

    public String getNomeImagem(){
        return nomeImagem;
    }
}
