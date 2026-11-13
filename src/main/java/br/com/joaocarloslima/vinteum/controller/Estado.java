package br.com.joaocarloslima.vinteum.controller;

import java.util.ArrayList;
import java.util.List;

import br.com.joaocarloslima.vinteum.model.Carta;
import br.com.joaocarloslima.vinteum.model.Jogo;

// o que a tela recebe depois de cada jogada
public record Estado(List<String> cartasJogador, int pontosJogador,
        List<String> cartasMesa, Integer pontosMesa,
        boolean acabou, String resultado, String estilo, int cartasNoMonte) {

    private static final String VERSO = "BlueBackVertical.png";

    public static Estado de(Jogo jogo) {
        boolean acabou = jogo.acabou();

        List<String> mesa = new ArrayList<>();
        List<Carta> cartasMesa = jogo.getMesa().getCartas();
        for (int i = 0; i < cartasMesa.size(); i++) {
            // enquanto a rodada não acaba, a segunda carta da mesa fica virada para baixo
            boolean escondida = !acabou && i == 1;
            mesa.add(escondida ? VERSO : cartasMesa.get(i).getImagem());
        }

        List<String> jogador = new ArrayList<>();
        for (Carta carta : jogo.getJogador().getCartas()) {
            jogador.add(carta.getImagem());
        }

        return new Estado(
                jogador,
                jogo.getJogador().getPontos(),
                mesa,
                acabou ? jogo.getMesa().getPontos() : null,
                acabou,
                jogo.resultado(),
                jogo.getMesa().getEstilo().getNome(),
                jogo.getMonte().getQuantidade());
    }
}
