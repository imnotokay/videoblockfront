import { IActores } from "./iactores";

export interface IPeliculas {
    Codigo: number;
    Titulo: string;
    Director: string;
    CostoAlquiler: number;
    CantidaInventario: number;
    Actores: Array<IActores>
}
