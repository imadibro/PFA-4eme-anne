import { Circuit } from '../entities/circuit.entity';

export class CircuitDto {
  constructor(circuit: Circuit) {
    this.id = circuit.id;
    this.title = circuit.title;
    this.prix = circuit.prix;
    this.dureeJours = circuit.dureeJours;
  }

  id: number;
  title: string;
  prix: number;
  dureeJours: number;
}
