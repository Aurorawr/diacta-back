import { ActivatedRoute, Params, Router } from "@angular/router";
import { Compromise } from "src/app/models/compromises.model";

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

export const orderCompromises = (compromises: Compromise[]) : Compromise[] => {
  const orderedCompromises = compromises.sort((a: Compromise, b: Compromise) : number => {
    if (a.references.minuteEnum > b.references.minuteEnum) {
      return 1;
    } if (a.references.minuteEnum < b.references.minuteEnum) {
      return -1;
    }
    return a.enum - b.enum
  })

  return orderedCompromises
}

export const redirectToTask = (compromiseId: string) => {
  const taskUrl = `${window.location.origin}/tablero?compromiseId=${compromiseId}`
  window.open(taskUrl, "_blank")
}