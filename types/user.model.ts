interface User {
    id: number;
    mail: string;
    motpasse: string;
    pseudo: string;
    nom: string;
    prenom: string;
    avatar: string;
    statut_connexion: number;
}

interface UserWithoutPassword {
    id: number;
    mail: string;
    pseudo: string;
    nom: string;
    prenom: string;
    avatar: string;
    statut_connexion: number;
}

export type { User, UserWithoutPassword };