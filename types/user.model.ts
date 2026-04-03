interface User {
    id: number;
    mail: string;
    pseudo: string;
    nom: string;
    prenom: string;
    avatar: string;
    statut_connexion: number;
}

export type { User };