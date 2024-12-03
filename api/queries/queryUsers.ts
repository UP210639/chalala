import { gql } from "@apollo/client";

export interface User {
    id: string;
    nombre: string;
    email: string;
    tipoUsuario: string;
    fechaRegistro: string | null;
  }
  
export const GET_USUARIOS = gql`
  query GetUsuarios($where: UsuarioWhereUniqueInput!) {
    usuarios(where: $where) {
      id
      nombre
      email
      tipoUsuario
      fechaRegistro
    }
  }
`;
