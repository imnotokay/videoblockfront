import { IClientes } from "./iclientes";

export interface IUsuarios {
    Codigo: number;
    Usuario: string;
    Password: string;
    Nombres: string;
    Apellidos: string;
    Correo: string;
    Rol: number;
    Cliente: IClientes;
}
