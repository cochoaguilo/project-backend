export class CreateAhorroDto {
    id: number;
    name: string;
    tipo: 'gasto' | 'ingreso';
    description?: string;
    quantity: number;
}