package br.com.joaocarloslima.vinteum.model;

import java.util.List;

public abstract class Participante {
    private final Mao mao = new Mao();

    public Mao getMao() {
        return mao;
    }

    public List<Carta> getCartas(){
        return mao.getCartas();
    }

    public int getPontos(){
        return mao.getPontos();
    }

    public void receberCarta(Carta carta){
        mao.adicionarCarta(carta);
    }

    public boolean estourou(){
        return mao.estourou();
    }
}
