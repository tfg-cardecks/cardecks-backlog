export const card = {
  title: "Card Title",
  theme: "Card Theme",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte delantera",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera",
      },
    ],
  },
};

export const card2 = {
  title: "Card Title 2",
  theme: "Card Theme 2",
  cardType: "txtTxt",
  frontSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte delantera",
      },
    ],
  },
  backSide: {
    text: [
      {
        content: "Texto de ejemplo en la parte trasera",
      },
    ],
  },
};

export const badCards = [
  // Type invalid
  {
    title: "Card Title",
    theme: "Card Theme",
  },
  // Front side invalid (type txtTxt)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtTxt",
  },

  // Front side invalid (left invalid)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
          left: -2,
        },
      ],
    },
  },
  // Front side invalid (top invalid)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
          top: -2,
        },
      ],
    },
  },
  // Back side invalid (type txtTxt)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
  },
  // Back side invalid (left invalid)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
          left: 300,
        },
      ],
    },
  },
  // Back side invalid (top invalid)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
          top: 400,
        },
      ],
    },
  },
  // Front side invalid (type txtImg)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtImg",
  },
  // Back side invalid (type txtImg)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtImg",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
  },
  // Front side invalid (left invalid)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtImg",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
          left: 300,
        },
      ],
    },
  },
  // Front side invalid (top invalid)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtImg",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
          top: 400,
        },
      ],
    },
  },
  // Back side invalid (left invalid)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtImg",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
          left: 300,
        },
      ],
    },
  },
  // Back side invalid (top invalid)
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtImg",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
          top: 400,
        },
      ],
    },
  },
  // title required
  {
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
        },
      ],
    },
  },
  // theme required
  {
    title: "Card Title",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
        },
      ],
    },
  },
  // cardType required
  {
    title: "Card Title",
    theme: "Card Theme",
  },
  // title too short
  {
    title: "Ca",
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
        },
      ],
    },
  },
  // title too long
  {
    title: "esto es un título demasiado largo para ser aceptado por el sistema",
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
        },
      ],
    },
  },
  // theme too short
  {
    title: "Card Title",
    theme: "Ca",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
        },
      ],
    },
  },
  // theme too long
  {
    title: "Card Title",
    theme: "esto es un tema demasiado largo para ser aceptado por el sistema",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
        },
      ],
    },
  },
  // unique title
  {
    title: "Card Title",
    theme: "Card Theme",
    cardType: "txtTxt",
    frontSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte delantera",
        },
      ],
    },
    backSide: {
      text: [
        {
          content: "Texto de ejemplo en la parte trasera",
        },
      ],
    },
  },
];
