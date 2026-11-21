# Guia de teste em sala

O jogo está completo, mas ainda não foi jogado por nenhum aluno. Este guia descreve como fazer os primeiros testes, o que observar e que números mexer depois.

## Antes da aula

1. Abra o jogo em cada aparelho e confira que a tela inicial aparece.
2. Se houver um jogo salvo de outra turma, toque em **For teachers** (canto inferior direito da tela inicial), exporte o resumo se quiser guardá-lo e use **Erase saved game**.
3. Teste em pelo menos um tablet e um computador da escola antes do dia. Confira especialmente: arrastar peças no mural com o dedo, ampliar com dois dedos e digitar num post-it com o teclado virtual. Nada disso foi testado em aparelho real.
4. Se a tela inicial avisar que o navegador não está deixando o jogo salvar, saia do modo anônimo ou troque de navegador.

## Formato sugerido

- **Duas sessões no mínimo:** uma com alunos jogando sozinhos e outra com grupos de três dividindo um aparelho.
- **Idades:** inclua alunos de 11 e de 14 anos; o ritmo de leitura muda muito nessa faixa.
- **Não ajude na investigação.** Anote onde pedem ajuda em vez de responder.
- **Duração:** deixe terminar mesmo que passe de 40 minutos; o tempo real é justamente o que se quer medir.

## O que observar

| Momento | O que anotar |
|---|---|
| Abertura | Leem até o fim? Quanto tempo leva? |
| Mapa | Entendem que devem escolher um lugar? Acham o pino novo do canal quando ele aparece? |
| Cenas | Acham os objetos clicáveis, ou só depois que os rótulos aparecem (20 segundos)? |
| Entrevistas | Leem as oito perguntas antes de escolher, ou tocam na primeira? Comentam quando uma pergunta "não deu nada"? Mudam o jeito de escolher ao longo do jogo? |
| Dicas do investigador | Leem? Mudam alguma coisa depois? |
| Mural | Usam por conta própria? Arrastam, marcam, escrevem, ligam? Ou só olham? |
| Hipóteses | Que explicações dizem em voz alta, e em que momento abandonam cada uma? |
| Reunião do time | Usam o botão? Escrevem ou só conversam? |
| Resultados do laboratório | Notam a mensagem? Entendem a tabela e o mapa de lama? |
| Relatório final | Consultam o mural? Em que pergunta demoram mais? |
| Perfil | Leem os comentários? Abrem as evidências que não tinham achado? |
| Revelação | Reação ao descobrir que o caso é real. |

## Metas (do plano)

| Medida | Meta | Onde ver |
|---|---|---|
| Tempo de investigação mais relatório | 38 a 45 minutos (mediana) | Painel do professor, "Player's clock" |
| Times que acharam a tabela das famílias (CLI-03), ou dois depoimentos sobre alimentação | pelo menos 70% | Resumo exportado, lista de evidências |
| Tempo parado sem saber o que fazer | no máximo 2 minutos | Observação |
| Acerto em cada pergunta do relatório | entre 40% e 85% | Resumo exportado, "report.answers" |

Uma pergunta do relatório com menos de 40% de acerto indica evidência difícil de achar ou de entender. Acima de 85%, indica que alguma pista entrega a resposta.

## Depois de cada sessão

1. Em cada aparelho, abra **For teachers** e toque em **Export session summary**. O arquivo vai para a pasta de downloads.
2. O resumo é anônimo: não contém o nome do time nem nada que os alunos digitaram. Contém tempos por fase, evidências coletadas, perguntas feitas com a classificação oculta, uso do mural e resultado do relatório.
3. Junte os arquivos e me envie, ou cole o conteúdo, para eu analisar e propor ajustes.
4. Limpe o aparelho para a próxima turma.

## O que ajustar, e onde

Todos os números de ritmo estão num único arquivo, `src/content/balance.ts`.

| Se acontecer isto | Mexa nisto |
|---|---|
| Passa muito de 45 minutos | Reduzir para 3 as perguntas de João, Dona Rosa e Sr. Santos (`questions`). Depois, retirar as três evidências sem função (quadro de preços, pôster de futebol, tucano de brinquedo). |
| Muitos times abrem o relatório cedo demais e se frustram | Hoje o botão "Solve the Mystery" fica liberado desde o início, por decisão da autora: decidir a hora faz parte do jogo. Se virar problema, exigir um mínimo em `readyToSolve` (por exemplo 12 evidências e 6 locais). |
| Os resultados do laboratório chegam cedo demais e entregam o caso | Os resultados chegam quando a equipe leva o gato dançante ao Regional Science Center. Para atrasar, deixar o gato mais rápido ou mais difícil de pegar em `src/features/map/MapScreen.tsx` (`CAT_FLEE_SPEED`, `CAT_SCARE`). |
| Quase ninguém acha os objetos das cenas | Reduzir `lookAroundMs` para 10 segundos. |
| As dicas incomodam ou passam despercebidas | Alterar `maxTips`. |
| Ninguém usa a reunião do time | Reduzir `meeting1Evidence`, ou o professor convida a turma a usá-la num momento combinado. |

As pistas enganosas das hipóteses erradas devem ser a última coisa a cortar: são elas que dão o que eliminar.

## Limites conhecidos

- **Um jogo salvo por aparelho.** Para outra turma no mesmo aparelho, exporte e apague antes.
- **Celulares não são suportados.** Abaixo de 600 px de largura o jogo mostra um aviso.
- **Imagens.** Enquanto os arquivos não estiverem em `public/images/`, as cenas mostram marcadores e os objetos clicáveis ficam sobre um fundo vazio. Teste com alunos só depois de ter ao menos o mapa, as nove cenas e os oito retratos.
- **Fatos históricos.** O texto da revelação precisa ser conferido em fontes confiáveis antes do uso em sala.
