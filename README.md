# DevBrasil · Sites para o agro

Site da agência DevBrasil. O dono abre no celular, vê os cases em tela cheia e pede uma prévia no WhatsApp.

Endereço publicado: https://marcos4213.github.io/portfolio-agro/

## Como trocar o nome e o WhatsApp

Edite só o arquivo `config.js` na raiz do repositório:

```js
window.PORTFOLIO = {
  name: "DevBrasil",
  brand: "DevBrasil",
  whatsapp: "5511930729435"
};
```

- `name`: o nome que entra na mensagem pronta do WhatsApp.
- `brand`: o nome da agência no rodapé.
- `whatsapp`: DDI + DDD + número, só dígitos. O número atual é `5511930729435` (Brasil +55, DDD 11, 93072-9435).
- Não use espaço, parêntese, traço ou `+`.
- O site da DevBrasil e as seis demonstrações leem esse valor. Cada botão de WhatsApp abre `https://wa.me/5511930729435`.

Depois do commit na branch `main`, o GitHub Actions publica de novo em alguns minutos.

## O que tem no site

- Capa em `index.html`: site da agência DevBrasil, com cases em tela cheia. Sem a alternância computador/celular.
- Seis demonstrações em `demos/`, cada uma com marca, pessoas e depoimentos fictícios. No rodapé de cada uma: “Site demonstrativo – marca e depoimentos fictícios”.
- Não há preço do serviço neste portfólio.

| Demonstração | Caminho | Recurso interativo |
| --- | --- | --- |
| Várzea Insumos · Sorriso | `demos/varzea-insumos/` | Calculadora de dose por hectare |
| Eixo Peças · Rio Verde | `demos/eixo-pecas/` | Busca de peça por máquina e sistema |
| Planalto Máquinas · LEM | `demos/planalto-maquinas/` | Simulador ilustrativo de financiamento e consórcio |
| Cocho Cheio · Dourados | `demos/cocho-cheio/` | Cálculo de suplemento do lote |
| Linha Fértil · Rio Verde | `demos/linha-fertil/` | Calendário de plantio por cultura |
| Silos do Vereda · Sorriso | `demos/silos-vereda/` | Cotação fictícia do dia e mapa de recebimento |

Os botões de WhatsApp das demonstrações também usam o número do `config.js`, com uma mensagem pedindo prévia para a empresa de quem está olhando.

Os links de Instagram seguem o padrão `https://instagram.com/usuario`. Os perfis são fictícios.

## Fotos

Imagens de estoque da [Pexels](https://www.pexels.com/license/), comprimidas e guardadas em `assets/img/`. Não há foto de Instagram de empresa real nem logo de marca registrada. Pessoas, depoimentos e nomes de produto são fictícios.

A capa da DevBrasil usa Syne e Manrope (licença SIL Open Font License), arquivos em `assets/fonts/`. As demonstrações carregam as famílias pelo Google Fonts.

Fotos (id Pexels): 265216, 1482101, 326082, 2886937, 2132250, 2255459, 440731, 2252584, 1112080, 1595104, 2382904, 422218, 325944, 1632790, 175389, 96715, 974314, 2933243, 1084540, 1459331, 248880, 1683975, 235725, 247599, 2165688, 164504, 265278, 1114690, 584928, 2933242, 422220, 1459505.

## Publicação

O workflow `.github/workflows/pages.yml` publica o site no GitHub Pages a cada push na `main`. O Pages do repositório precisa continuar com origem **GitHub Actions** (`build_type=workflow`).
