package br.com.joaocarloslima.vinteum.model;

public class Jogo {
    private Monte monte;
    private final Jogador jogador;
    private final Mesa mesa;
    private boolean acabou;

    public Jogo() {
        monte = new Monte();
        jogador = new Jogador();
        mesa = new Mesa();

        distribuirCartasIniciais();

        if (jogador.getPontos() == 21 ||
                mesa.getPontos() == 21) {
            finalizarRodada();
        }
    }

    private void distribuirCartasIniciais() {
        jogador.receberCarta(monte.comprarCarta());
        mesa.receberCarta(monte.comprarCarta());

        jogador.receberCarta(monte.comprarCarta());
        mesa.receberCarta(monte.comprarCarta());
    }

    public void pedirCarta() {
        if (acabou) {
            return;
        }

        jogador.receberCarta(monte.comprarCarta());

        if (jogador.estourou() ||
                jogador.getPontos() == 21) {
            finalizarRodada();
        }
    }

    public void parar() {
        if (acabou) {
            return;
        }

        while (mesa.devePedirCarta() && !mesa.estourou()) {
            mesa.receberCarta(monte.comprarCarta());
        }

        finalizarRodada();
    }

    private void finalizarRodada() {
        if (acabou) {
            return;
        }

        if (!jogador.estourou()) {
            while (mesa.devePedirCarta() && !mesa.estourou()) {
                mesa.receberCarta(monte.comprarCarta());
            }
        }

        acabou = true;
    }

    public boolean acabou() {
        return acabou;
    }

    public String resultado() {
        if (!acabou) {
            return "";
        }

        if (jogador.estourou()) {
            return "Você perdeu! Passou de 21.";
        }

        if (mesa.estourou()) {
            return "Você ganhou! A mesa passou de 21.";
        }

        if (jogador.getPontos() > mesa.getPontos()) {
            return "Você ganhou!";
        }

        if (jogador.getPontos() < mesa.getPontos()) {
            return "Você perdeu!";
        }

        return "Empate!";
    }

    public Jogador getJogador() {
        return jogador;
    }

    public Mesa getMesa() {
        return mesa;
    }

    public Monte getMonte() {
        return monte;
    }
}