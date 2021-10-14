export const minutes = [
    {
        id: 0,
        value: '00'
    },
    {
        id: 15,
        value: '15'
    },
    {
        id: 30,
        value: '30'
    },
    {
        id: 45,
        value: '45'
    },
]


export const daysOfWeek = [
    {
      id: 1,
      name: "Lunes"
    },
    {
      id: 2,
      name: "Martes"
    },
    {
      id: 3,
      name: "Miércoles"
    },
    {
      id: 4,
      name: "Jueves"
    },
    {
      id: 5,
      name: "Viernes"
    },
    {
      id: 6,
      name: "Sábado"
    },
    {
      id: 0,
      name: "Domingo"
    },
  ]

export const range = (end: number, start = 0) => {
    const rangeList = []
    for(let i = start; i <= end; i++) {
        rangeList.push(i)
    }

    return rangeList
}