# Prompts para gerar as imagens

Lista das 36 imagens que o jogo usa hoje, com um prompt em inglês para cada uma. Os prompts estão em inglês porque os geradores de imagem respondem melhor assim.

## Como usar

1. Cole o **bloco de estilo** abaixo no início de cada prompt (ou configure-o como estilo fixo, se a ferramenta permitir). Isso mantém todas as imagens com a mesma aparência.
2. Gere no formato indicado e salve como `.webp` com **exatamente o nome do arquivo** da lista.
3. Coloque os arquivos em `public/images/`. O jogo troca o marcador pela imagem sozinho, sem mexer em código.
4. Depois que as cenas e o mapa existirem, eu ajusto a posição dos círculos clicáveis e dos pinos para ficarem em cima dos objetos desenhados. Por isso a posição dos objetos nas cenas não precisa ser exata, mas cada objeto citado **precisa aparecer e ficar separado dos outros**.

Se a ferramenta não exportar `.webp`, gere em PNG ou JPG e converta (por exemplo em squoosh.app), mantendo o nome.

### Bloco de estilo (colar antes de cada prompt)

```
High-quality stylized 3D render, like a frame from a modern 3D animated family film or a premium 3D adventure video game: soft rounded shapes, slightly exaggerated friendly proportions, expressive faces with large eyes, detailed hand-crafted materials (painted wood, cloth, stone, water), cinematic global illumination, soft shadows, gentle depth of field, rich but natural tropical colours (emerald sea greens, terracotta, faded boat blue, warm yellow, forest green). Polished, not photorealistic, not flat 2D, not low-poly. Mood: a mystery with an eerie, uneasy edge, like the tense chapters of a family adventure film: overcast skies, heavy grey clouds, muted light, long soft shadows, a feeling that something is wrong. Setting: a modest, warm, dignified fishing town on the Brazilian coast. People are ordinary Brazilians of varied skin tones, shown with respect and warmth. No text, no letters, no numbers, no logos, no watermarks, no signatures anywhere in the image. Unsettling is welcome; never gory: no blood, no wounds, no dead bodies shown in a graphic way.
```

### Regras para todas as imagens

- **Sem texto dentro da imagem.** Placas, jornais e avisos devem aparecer em branco ou com rabiscos ilegíveis; o jogo escreve os textos por cima.
- **Nada que entregue a solução.** A fábrica e o canal devem parecer comuns e limpos: sem fumaça escura, lodo, cores estranhas, caveiras ou animais mortos por perto.
- **A cidade é modesta, não miserável:** colorida e bem cuidada, mesmo sob o céu fechado. As duas primeiras imagens da abertura são a exceção ensolarada: mostram a vila antes de tudo mudar.
- **O clima pode ser um pouco assustador:** céu nublado, luz fria, sensação de que algo está errado. Os gatos afetados devem parecer doentes de verdade (magros, pelo arrepiado, olhar vidrado, corpo torto). O limite é não mostrar sangue, ferimentos nem animais mortos de forma gráfica.

---

## Estado das imagens (atualizado em 18/11)

| Grupo | Prontas no jogo | Faltam |
|---|---|---|
| Telas e cenas | mapa, 4 páginas da abertura, as 9 cenas dos lugares | `title-background` (tela inicial) |
| Retratos | Maria, Carlos, Dra. Ana, Sra. Silva, João, Sr. Santos, Dona Rosa, Prof. Roberto | **Marcos Costa** e **parceiro de investigação** (prompts na seção 2) |
| Fotografias de evidência | as 9 | — |
| Textura e revelação | cortiça do mural, baía de Minamata | — |

Para os dois retratos que faltam: gere na mesma sessão dos outros, ou anexe um retrato já aprovado (por exemplo o do João) como referência de estilo, para o elenco continuar coerente.

**Um ajuste pendente numa imagem pronta:** a foto do santuário (`harbor-shrine`) mostra a estátua inteira, mas a pista HAR-09 diz que a estátua "está rachada ao meio". Há duas saídas: gerar de novo acrescentando ao prompt "the statue is clearly cracked in two pieces, with a visible diagonal crack from shoulder to hip", ou trocar a frase da pista por algo como "the candles are still lit after the storm".

## 1. Telas e cenas

Formato 16:9, 1920 × 1080 para as cenas dos lugares e a tela inicial; o mapa é 16:10. **As quatro imagens da abertura são em RETRATO (vertical), 4:5, 1080 × 1350**: no livro da abertura a imagem ocupa uma página alta e estreita, e uma imagem paisagem perderia quase metade nas laterais.

### `title-background.webp` — tela inicial
```
Close view of a detective's corkboard: a corner of a coastal map, a blank Polaroid frame showing a small bay, a few blank paper notes, red string between brass pins, a paper clip, a fishing net draped at one edge. Soft warm light. The centre of the image is calm, mostly plain cork, leaving room for a title card. Wide 16:9.
```

### `opening-vila-do-sol.webp` — abertura, página 1 (RETRATO 4:5, 1080 × 1350)
```
Tall vertical view of a small coastal town seen from a hillside: the bay and boats low in the frame, the houses and cobbled street in the middle, forested mountains and sky above; emerald-green sea and a sheltered bay, mountains covered in thick tropical forest behind, cobblestone streets, modest colourful houses with tiled roofs, children playing in a street at late afternoon, neighbours chatting at a doorway. Peaceful, sunlit, a hidden paradise. Vertical portrait composition, 4:5, with the main interest (the children and the street) in the lower two thirds.
```

### `opening-harbor-boats.webp` — abertura, página 2 (RETRATO 4:5, 1080 × 1350)
```
Small wooden fishing boats painted blue, green, red and faded yellow returning to a little harbor in golden late-afternoon light, nets heavy with fish, fishermen and fisherwomen unloading baskets on the dock, gulls circling overhead. Far in the background, beyond green hills, the pale shape of a single modern white factory with blue windows, small and unthreatening. Lively and warm. Vertical portrait composition, 4:5: fishing boats and the dock with the people in the lower two thirds, hills with the small factory and the golden sky above.
```

### `opening-dancing-cat.webp` — abertura, página 3 (RETRATO 4:5, 1080 × 1350)
```
A cloudy afternoon at an open-air fish market on wet cobblestones. In the foreground, slightly off-centre, a thin, sick-looking tabby cat caught mid-stumble: ribs showing, fur dull and bristled, eyes wide and glassy, legs splayed awkwardly, body twisting as if it has lost control of it. A few children nearby have stopped to watch, one half-smiling, the others looking frightened. Heavy dark clouds over the mountains, cold dim light. Eerie and unsettling. Vertical portrait composition, 4:5: the cat large in the lower half of the frame, the children behind it, dark clouds above.
```

### `opening-bay-night.webp` — abertura, página 4 (RETRATO 4:5, 1080 × 1350)
```
The same bay at dusk, seen from the shore: still dark water, a few moored boats, warm lit windows along the waterfront, the silhouette of forested mountains, a low mist over the water, dark clouds covering most of the sky. On a wall in the foreground, the silhouettes of two thin cats, one hunched, one with its back arched. Eerie and mysterious, a strong feeling that something is wrong. Large calm areas of dark sky and water. Vertical portrait composition, 4:5.
```

### `map-vila-do-sol.webp` — mapa (formato 16:10, 1920 × 1200)
```
Bird's-eye view of a small Brazilian coastal town built as a detailed stylized 3D miniature diorama, like the world map of a 3D adventure game, seen from high above at a slight angle. The sea and a curved bay fill the bottom and the right side. Nine clearly separated landmarks, each with empty space around it: (1) a harbor with docks and boats at the bottom centre; (2) a covered fish market just inland from the harbor, in the centre; (3) a cluster of small colourful fishermen's houses on the left; (4) a town square with a big tree to the right of centre; (5) a small health clinic above the centre; (6) a lone house with a garden on a hill path at the upper left; (7) a science building near the coast at the lower right; (8) a rocky point of land at the top right where a narrow channel meets the sea; (9) white factory buildings with blue windows beyond green hills at the top, upper right of centre, with a road and a bus. Winding streets connect them. Tropical trees, tiny boats on the water. Even, bright daylight so every landmark is easy to see. Keep a clear strip along the very top edge. No labels, no text. 16:10.
```

High-quality stylized 3D render, like a frame from a modern 3D animated family film or a premium 3D adventure video game: soft rounded shapes, slightly exaggerated friendly proportions, expressive faces with large eyes, detailed hand-crafted materials (painted wood, cloth, stone, water), cinematic global illumination, soft shadows, gentle depth of field, rich but natural tropical colours (emerald sea greens, terracotta, faded boat blue, warm yellow, forest green). Polished, not photorealistic, not flat 2D, not low-poly. Mood: a mystery with an eerie, uneasy edge, like the tense chapters of a family adventure film: overcast skies, heavy grey clouds, muted light, long soft shadows, a feeling that something is wrong. Setting: a modest, warm, dignified fishing town on the Brazilian coast. People are ordinary Brazilians of varied skin tones, shown with respect and warmth. No text, no letters, no numbers, no logos, no watermarks, no signatures anywhere in the image. Unsettling is welcome; never gory: no blood, no wounds, no dead bodies shown in a graphic way.



### `harbor.webp` — porto
```
A small fishing harbor under a heavy, dark overcast sky, the water dull and still, an uneasy quiet. A wooden dock with moored colourful boats and fishing nets hung to dry, a few of them with small ragged holes chewed in them. Required objects, each clearly visible and apart from the others: calm green water beside the dock in the lower left with a few fish floating at the surface; a small harbor office with a large paper sea chart pinned to its outer wall, upper right of centre; an open logbook resting on a wooden crate in the centre; a strip of sandy beach on the far right with a gull sitting on the sand; a tiny dockside shrine with candles and flowers on the far left. No people in the scene. 16:9.
```

### `fish-market.webp` — mercado de peixe
```
A covered open-air fish market with wooden stalls, baskets of fresh fish and shellfish on ice, wet cobblestones, striped awnings. Almost no customers; it feels far quieter than it should, under a grey sky. Required objects: a thin, sick-looking tabby cat with dull bristled fur and glassy eyes, standing unsteadily with its head tilted, near a stall in the lower right; a blank chalkboard price board hanging in the upper left of centre. Leave an empty spot behind the main stall on the left. No people in the foreground. 16:9.
```

### `clinic.webp` — posto de saúde
```
The waiting room of a small, tidy public health clinic in a Brazilian coastal town: wooden benches, pale green walls, a ceiling fan, a potted plant, sunlight through a window. Required objects on the wall, clearly apart: a paper bar chart (blank bars, no numbers) on the left; a printed notice sheet in the centre; an open door on the right leading to a consulting room, with a small notice sheet taped to the door. Calm and caring. No people. 16:9.
```

### `fishing-community.webp` — comunidade de pescadores
```
A quiet street of small, brightly painted fishermen's houses: laundry lines, fishing nets drying on a fence, potted plants, a bicycle. The doorsteps are empty. Required objects, clearly apart: a narrow shaded alley between two houses on the lower left; a lamp post in the centre with a sheet of paper taped to it; an open kitchen window on the right through which a sack of rice on the floor can be glimpsed. Grey overcast light, an empty, too-quiet street. No people. 16:9.
```

### `town-square.webp` — praça
```
A small town square with a large shady tree, benches and cobblestones. A local bus has stopped at a simple bus shelter. Required objects, clearly apart: a wooden municipal notice board with two pinned sheets on the left; a football poster (no text, just a ball and a team in yellow and green shirts) on a wall at the top centre; a newspaper stand with three folded newspapers on display at the lower right. Overcast sky, a subdued mood: an everyday place where people have become worried. No people in the foreground. 16:9.
```

### `dona-rosa-house.webp` — casa da Dona Rosa
```
A simple old house on a hillside path, wrapped in a lush garden of medicinal herbs and flowers, with a shaded wooden veranda and a rocking chair. Hens scratch in the yard. Required objects: a small wooden shelf on the veranda wall at right of centre holding jars, dried herbs and a folded handwritten note; a sunny corner of garden on the left. Peaceful and respected, not mystical or spooky. No people. 16:9.
```

### `tucano-industrial.webp` — Tucano Industrial
```
The clean, bright reception lobby of a modern mid-sized factory: white walls, large blue-tinted windows, polished floor, a reception desk, potted palms. Through the windows, tidy white factory buildings. Required objects, clearly apart: a freestanding display stand with a framed blank document on the left; a wall shelf on the right holding a few small colourful plastic toy toucans and a football trophy. Professional, ordinary and welcoming, nothing sinister. No people. 16:9.
```

### `north-point-channel.webp` — canal da ponta norte
```
A rocky point on a tropical coast. A plain grey concrete channel, about two metres wide, comes down from green hills and lets clear, ordinary-looking water run over rocks into a calm green bay. Coastal plants grow beside it. The channel is in the centre of the image. Bright daylight. Completely ordinary and clean: no pipes dripping sludge, no coloured water, no foam, no warning signs, no dead animals. No people. 16:9.
```

### `science-center.webp` — centro de ciências
```
A modest regional science laboratory office: a microscope on a bench, shelves of labelled sample jars (labels blank), a water tank with small fish, a window with a sea view. Required objects, clearly apart: a large wall poster showing a simple diagram of sea creatures of different sizes (no text) on the upper left; a wooden desk on the lower right with a few typed letters and envelopes. Curious and orderly. No people. 16:9.
```

---

## 2. Retratos dos personagens

Formato 3:4, 900 × 1200, da cintura para cima, olhando para o observador. Fundo liso, cor de papel claro, sem cenário. São personagens 3D estilizados, como protagonistas de um filme de animação: para manter o mesmo "elenco", gere todos na mesma sessão ou use o primeiro retrato aprovado como referência de estilo para os demais. Todos com expressão neutra ou amigável: **ninguém deve parecer culpado ou vilão**.

### `char-maria.webp`
```
Portrait, waist up, of Maria, a Brazilian fisherwoman of about fifty: brown skin weathered by sun and sea, strong arms, greying dark hair tied back under a faded headscarf, simple blouse with rolled sleeves, a net over one shoulder. Capable and kind, a little tired. Plain light paper-coloured background. 3:4.
```

### `char-carlos.webp`
```
Portrait, waist up, of Carlos, a Brazilian fish market vendor in his forties: stocky, friendly round face, moustache, light brown skin, striped apron over a T-shirt, a cloth over his shoulder. Talkative and warm, with a slightly worried look. Plain light paper-coloured background. 3:4.
```

### `char-dr-ana.webp`
```
Portrait, waist up, of Dr. Ana, a Black Brazilian doctor in her late thirties: short natural hair, simple white coat over a coloured blouse, stethoscope around her neck, a clipboard held against her chest. Attentive, calm, tired but caring. Plain light paper-coloured background. 3:4.
```

### `char-mrs-silva.webp`
```
Portrait, waist up, of Mrs. Silva, a Brazilian mother of about forty from a fishing family: brown skin, dark wavy hair loosely tied, simple floral dress, hands clasped in front of her. Worried but dignified and strong. Plain light paper-coloured background. 3:4.
```

### `char-joao.webp`
```
Portrait, waist up, of João, a Brazilian factory worker in his mid-thirties: medium brown skin, short dark hair, open friendly smile, clean blue work shirt with a small blank name patch, a lunch bag in one hand. Proud, cheerful and honest. Plain light paper-coloured background. 3:4.
```

### `char-mr-santos.webp`
```
Portrait, waist up, of Mr. Santos, a Brazilian company representative of about fifty: neat grey-streaked hair, glasses, light skin, pressed light-blue shirt and dark tie, no jacket, a folder under his arm. Calm, polite and approachable, a professional pleasant expression. Not a villain. Plain light paper-coloured background. 3:4.
```

### `char-dona-rosa.webp`
```
Portrait, waist up, of Dona Rosa, an elderly Afro-Brazilian traditional healer of about seventy-five: deep brown skin, white hair under a patterned headwrap, simple cotton dress, a few bead necklaces, a small bunch of fresh herbs in her hands. Warm, wise and self-possessed, with a gentle smile. Respectful, not exotic or mystical. Plain light paper-coloured background. 3:4.
```

### `char-prof-roberto.webp`
```
Portrait, waist up, of Professor Roberto, a Brazilian scientist of about forty-five: tan skin, short curly dark hair with some grey, trimmed beard, checked shirt with rolled sleeves, reading glasses pushed up on his head, a notebook in his hand. Thoughtful and patient. Plain light paper-coloured background. 3:4.
```

### `char-marcos.webp` — Marcos Costa
Funcionário da Tucano que pesca nos fins de semana. É o personagem que é, ao mesmo tempo, empregado da empresa e vítima: o rosto deve mostrar orgulho e preocupação juntos.
```
Portrait, waist up, of Marcos Costa, a Brazilian factory worker in his early forties who also fishes on weekends: dark brown skin, short hair, strong shoulders, a clean blue work shirt with a small blank name patch and safety glasses pushed up on his forehead, one hand holding a fishing line. A tired, conflicted look: proud and worried at once. Not a villain and not a victim posing. Plain light paper-coloured background. 3:4.
```

### `char-partner.webp` — parceiro de investigação
O ajudante do jogador nas conversas "Talk to your partner", no papel que o Dr. Watson tem para Sherlock Holmes. Ele diz "Elementary, my dear investigator!".
```
Portrait, waist up, of a Brazilian Dr. Watson-style detective's partner, in his early thirties: medium brown skin, a neat dark moustache, a brown bowler hat (chapéu coco), a tweed waistcoat over a white shirt with a loosened bow tie, a pocket watch chain across the waistcoat, a large magnifying glass held up in one hand and a small notebook in the other. Classic Victorian-detective look with a Brazilian touch (warm tropical colours, a light linen jacket instead of heavy wool). A warm, loyal, encouraging half-smile, raised eyebrows as if about to say "elementary". Kind, curious, a little rumpled; not a villain, not a know-it-all. Plain light paper-coloured background. 3:4.
```

---

## 3. Fotografias de evidência

High-quality stylized 3D render, like a frame from a modern 3D animated family film or a premium 3D adventure video game: soft rounded shapes, slightly exaggerated friendly proportions, expressive faces with large eyes, detailed hand-crafted materials (painted wood, cloth, stone, water), cinematic global illumination, soft shadows, gentle depth of field, rich but natural tropical colours (emerald sea greens, terracotta, faded boat blue, warm yellow, forest green). Polished, not photorealistic, not flat 2D, not low-poly. Mood: a mystery with an eerie, uneasy edge, like the tense chapters of a family adventure film: overcast skies, heavy grey clouds, muted light, long soft shadows, a feeling that something is wrong. Setting: a modest, warm, dignified fishing town on the Brazilian coast. People are ordinary Brazilians of varied skin tones, shown with respect and warmth. No text, no letters, no numbers, no logos, no watermarks, no signatures anywhere in the image. Unsettling is welcome; never gory: no blood, no wounds, no dead bodies shown in a graphic way.


Formato quadrado 1:1, 1000 × 1000. No jogo elas aparecem dentro de uma moldura de Polaroid, então devem parecer **uma foto tirada na hora dentro do mesmo mundo 3D**: enquadramento simples, um único assunto no centro.

### `floating-fish.webp`
```
Snapshot-style view looking down from a dock at calm green harbor water beside the hull of a small painted boat. Four or five ordinary silver fish float at the surface on their sides under a grey sky. Eerie and quiet, not gruesome. Square 1:1.
```

### `fallen-bird.webp`
```
Snapshot-style view of a seagull sitting low on a sandy beach, wings half open and drooping, head tilted and eyes half closed, clearly alive but unable to stand or fly. Sad and unsettling, not graphic. Cold overcast light. Square 1:1.
```

### `harbor-shrine.webp`
```
Snapshot-style view of a small dockside shrine: a little painted wooden niche with lit candles and fresh flowers. Inside, a small clay statue of a fisherman saint is cracked cleanly in two pieces. Quiet and respectful. Square 1:1.
```

### `dancing-cat.webp`
```
Snapshot-style view of a thin, sick-looking tabby cat on wet cobblestones beside a fish stall, caught mid-stumble: ribs showing, fur dull and bristled, eyes wide and glassy, legs splayed and body twisted sideways as if it cannot control its movements. Slight motion blur, grey light. Disturbing but not graphic. Square 1:1.
```

### `rat-sighting.webp`
```
Snapshot-style view of a large brown rat sitting boldly on the stone doorstep of a colourful house in grey daylight, looking straight at the camera. Unsettling, not monstrous. Square 1:1.
```

### `gnawed-rice-sack.webp`
```
Snapshot-style view through a kitchen window of a cloth sack of rice on a tiled floor. One corner of the sack has been chewed open and white grains have spilled out. Ordinary modest kitchen. Square 1:1.
```

### `pretinha.webp`
```
Snapshot-style view of an old, plump, healthy black cat asleep in the sun among garden herbs and flowers, looking content. Square 1:1.
```

### `industrial-outflow.webp`
```
Snapshot-style close view of the end of a plain grey concrete channel where clear, ordinary-looking water runs over dark rocks into a calm green bay. Nothing unusual: no colour in the water, no foam, no rubbish. Bright daylight. Square 1:1.
```

### `toy-toucan.webp`
```
Snapshot-style close view of a small colourful plastic toy toucan standing on a white shelf. Cheerful, simple, slightly glossy plastic. Square 1:1.
```

---

## 4. Textura e revelação

### `texture-corkboard.webp` — fundo do mural (1024 × 1024, repetível)
```
Seamless tileable texture of natural cork board, warm brown, fine even grain, flat even lighting, no shadows, no pins, no objects. Square, edges must tile perfectly.
```
Para esta imagem, **não** use o bloco de estilo.

### `reveal-minamata-bay.webp` — revelação histórica (16:9, 1920 × 1080)
```
A quiet fishing bay in southern Japan in the 1950s: small wooden fishing boats, a village of tiled-roof houses along the shore, green hills, calm sea, soft morning light. Far in the background, the chimneys and buildings of a mid-century chemical factory. Respectful, calm and a little melancholy. No people in the foreground. 16:9.
```

### Imagens da revelação (cinco novas, 16:9, 1920 × 1080)
As páginas da revelação têm uma imagem cada. A primeira é `reveal-minamata-bay.webp`. Para as outras cinco, use o texto de estilo abaixo antes de cada prompt, e anexe `reveal-minamata-bay` como referência de estilo, para o conjunto ficar coerente.

```
Stylized 3D render, like a frame from a modern 3D animated family film: soft rounded shapes, expressive faces with large eyes, detailed hand-crafted materials (wood, paper, cloth, water), cinematic global illumination, soft shadows, gentle depth of field, warm and respectful mood with a touch of melancholy. Same visual style as the reference image of the Minamata bay. Japanese people shown with respect and warmth. No text, no letters, no numbers, no logos, no watermarks, no signatures anywhere. Not gory: no blood, no graphic suffering. 16:9.
```

### `reveal-cats-minamata.webp` — os gatos e os ratos
```
A 1950s Japanese fishing village dock at golden hour: wooden boats, drying fishing nets, tiled-roof houses. In the foreground a thin cat stumbles unsteadily on the stone dock, legs splayed, with a bewildered look. Two Japanese fishermen in work clothes watch with concern; one holds a folded local newspaper whose print is only blurred, illegible marks. A few small fish float at the water's edge. Gentle, worried mood.
```

### `reveal-hospital-minamata.webp` — a primeira explicação estava errada
```
Interior of a small Japanese hospital ward in the 1950s: wooden floors, white-painted iron beds, paper-screen windows letting in soft light. A kind Japanese doctor in a white coat and a nurse in a 1950s nurse's uniform and cap speak gently to an adult patient sitting up in bed, who holds a cup with a slightly trembling hand. Calm, compassionate and quiet; no frightening medical equipment.
```

### `reveal-fish-family.webp` — da fábrica à mesa
```
Inside a traditional 1950s Japanese fishing home: a Japanese family (grandmother, parents and two children) sharing a meal of grilled fish and rice at a low wooden table in warm lamplight. Through the open sliding door the bay is visible in the dusk and, far away, a small white factory with chimneys. The family looks happy and the factory looks small and distant, with a quiet unease.
```

### `reveal-newspaper.webp` — por que demorou tanto
```
Close-up of a stack of 1950s and 60s Japanese newspapers on a wooden desk beside a ceramic teacup and a pair of round glasses. The top front page shows a large blurred black-and-white photograph of a bay with a factory, and rows of unreadable abstract marks in place of text (no legible characters, no real writing). Soft window light, serious and thoughtful mood.
```

### `reveal-amazon-today.webp` — e no Brasil, hoje?
```
An Indigenous Munduruku family on the bank of a wide Amazon tributary at sunset: a father and a child hold a basket of freshly caught fish beside a wooden canoe, a mother and grandmother prepare food nearby, with simple houses and dense rainforest behind. Warm light, dignified and respectful, everyday life. A pale muddy sandbank on the far shore hints at mining, subtle and not dramatic.
```

---

## Ordem sugerida

Se quiser ver o jogo ganhar forma rápido, gere nesta ordem:

1. `map-vila-do-sol` e as 9 cenas (são o que mais aparece).
2. Os 10 retratos (os oito do elenco, mais Marcos Costa e o parceiro).
3. As 4 imagens da abertura e `title-background`.
4. As 9 fotografias de evidência.
5. `texture-corkboard` e `reveal-minamata-bay`.

## Imagens da lista antiga que não são mais necessárias

`opening-tucano-fair`, `factory-bus`, `lab-sample`, `meeting-table`, `report-folder`, `texture-paper-aged`, `texture-wood`, `reveal-map-japan`, `reveal-food-chain`. O jogo desenha por código o que elas mostrariam, ou a tela deixou de existir.
