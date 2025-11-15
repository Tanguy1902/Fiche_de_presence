import { refreshToken } from '@/controllers/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';


export async function postPresence(id_session : number, id_ninja : number, present : boolean = false){
    await refreshToken();
    let id_presence = await get_id(id_session, id_ninja);

    if (id_presence !== -1) {
        await updatePresence(id_session, id_ninja, id_presence, present);
        return;
    }
    const apiToken = await AsyncStorage.getItem('api_token');
    if (!apiToken) throw new Error('API token not found');
    const response = await fetch('http://192.168.43.1:8000/api/presences/', {
        method: "POST",
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ ninja : id_ninja, session : id_session, present : present })
    });

    if (!response.ok) {
        throw new Error(`Failed to send presence: ${response.statusText}`);
    }
}

export async function getPresence(): Promise<any[]> {
    await refreshToken();
    const apiToken = await AsyncStorage.getItem('api_token');
    const response = await fetch('http://192.168.43.1:8000/api/presences/', {
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch presence: ${response.statusText}`);
    }
    let data = await response.json();
    return data;
}

async function updatePresence(id_session : number, id_ninja : number, id_presence : number, present : boolean = false){
    await refreshToken();
    const apiToken = await AsyncStorage.getItem('api_token');
    if (!apiToken) throw new Error('API token not found');
    const response = await fetch(`http://192.168.43.1:8000/api/presences/${id_presence}/`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({ ninja : id_ninja, session : id_session, present : present })
    });

    if (!response.ok) {
        throw new Error(`Failed to send presence: ${response.statusText}`);
    }
}

async function get_id(id_session: number, id_ninja: number) : Promise<number> {
    let data = await getPresence();

    for (let presence of data) {
        if (presence.ninja == id_ninja && presence.session == id_session) {
            return parseInt(presence.id);
        }
    }
    return -1;
}

export async function generatePDF(id_session: number) {
    const data = await getPresence();
    console.log("Présence enregistrée:", data);

    const anyPresence = data.some((p: any) =>
        p.session === id_session && p.present === true
    );

    if (!anyPresence) {
        Alert.alert('Vide', "Aucune présence pour cette session");
        return;
    }

    let template = `<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Liste de Présence – CoderDojo</title>

    <style>
        body {
            font-family: "Poppins", sans-serif;
            margin: 0;
            padding: 20px;
            background: #faf7ff;
            color: #333;
        }

        .header {
            margin-bottom: 25px;
            padding: 20px;
            background: #ffffff;
            border-radius: 16px;
            border: 2px solid #f3e8ff;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.12);
        }

        .header h1 {
            margin: 0;
            font-size: 26px;
            font-weight: 700;
            color: #8b5cf6;
        }

        .header p {
            margin: 5px 0 0;
            font-size: 15px;
            color: #ec4899;
            font-weight: 500;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 14px rgba(236, 72, 153, 0.12);
        }

        thead {
            background: linear-gradient(90deg, #8b5cf6, #ec4899);
            color: #fff;
        }

        th,
        td {
            padding: 14px 16px;
            text-align: left;
            font-size: 15px;
        }

        tbody tr {
            border-bottom: 1px solid #f3e8ff;
            transition: background 0.25s ease;
        }

        tbody tr:hover {
            background: #fdf2f8;
        }

        .presence-yes {
            color: #10b981;
            font-weight: 600;
        }

        .presence-no {
            color: #ef4444;
            font-weight: 600;
        }

        .signature {
        margin-top: 25px;
        padding: 16px;
        background: #ffffff;
        border-radius: 14px;
        border: 2px solid #f5d0fe;
        box-shadow: 0 4px 10px rgba(236, 72, 153, 0.15);
        font-size: 14px;
        color: #8b5cf6;
        font-weight: 500;
    }

    .signature span {
        color: #ec4899;
        font-weight: 600;
    }
    </style>
</head>

<body>

    <div class="header">
        <h1>Session CoderDojo – Session ${data[0].session} : ${data[0].session_detail.theme}</h1>
        <p>Établissement : ${data[0].ninja_detail.lycee.nom}</p>
    </div>

    <table>
        <thead>
            <tr>
                <th>#</th>
                <th>Nom & Prénoms</th>
                <th>Classe</th>
                <th>Présence</th>
            </tr>
        </thead>

        <tbody>`;

    for (let ninja of data) {
        if (ninja.session !== id_session) continue;
        template += `
        <tr>
                <td>${ninja.ninja_detail.id}</td>
                <td>${ninja.ninja_detail.nom+" "+ninja.ninja_detail.prenom}</td>
                <td>${ninja.ninja_detail.classe}</td>
                <td class="${ninja.present?"presence-yes":"presence-no"}">${ninja.present?"Présent":"Absent"}</td>
        </tr>
        `
    }
    
    template += `</tbody>
    </table>

    <div class="signature">
        Fait le <span>${data[0].date}</span> par <span>${data[0].fait_par_detail.username}</span>.
    </div>

</body>

</html>`;
    
    const { uri } = await Print.printToFileAsync({ html: template });
    console.log("PDF Généré : " + uri);
    await Sharing.shareAsync(uri);
}