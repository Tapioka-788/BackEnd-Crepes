const cors = require('cors');
const express = require('express');
const admin = require("firebase-admin");

const serviceAccount = {
    type: "service_account",
    project_id: "crepescema",
    private_key_id: "bc3243c4815b8ad61c4ea5f7306b5fbc400c3814",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC9uckEFIGWkHP0\nw8hDqDRc6aYu4FOxnb+FQgKxbDhKQIs/p/cntblV0+/JUs1e6kK+oudXAnpHfjI2\nPHy6vpcyuWBh+JE2a4mupuYr2krCliG0JQCQtMBOg+iti8yicXtYRZPb0vtTSV+o\nV2yl7vuE8GBSTshWfmIDVqZF0iwGwxcVkhmonm9lnFU2f0ZjZLbavlSxSMFxKotO\nSByhewlCX8qXhzSm4b2zYEw0FNoXSCwnChZuDQf63YKUSw2FBa3gdhg3I/h4FJe1\nDd47+K017O9jgcCK5QNWk+40qpTERpoxeEnFpk2Fz2nDwV7rQfrOvMZOGJo+chsF\n4e2gdvcfAgMBAAECggEADMFOyF1wkOTJRu1aq2HFk3GJ4KDoP4qxc44KjE8QQb2x\nHuh170+CVEjZWBmfAQCS2Covj2P1QJU1XvwWDp/9nkVkO3HwoU39haZm1w/n8skR\nHwFV1mSwgRbRL8m0Sj+C4V5cIG1AxEqsia7G+Sjl8/wNHbt6MIZypHLQ3uTQXOvm\n7MrL1xs3vyne9IaXlUzodgocSkZc1vcLD5p+CRwLqiMvJPbCsKzqrW9dZ78elA37\n/8xHbJ/LbkZnoNObxAlQjyysy6XNkJ+xdgqJTV5YnMEHmkTnpPcNVXdqyf5h5nwO\nrACkACXd7rQSG0CgnWe/Lt5wGvqT/dLqC4PJFjrgUQKBgQD34+Yp8gJJ4VPBxsWl\nl9oayWcDykguUzNbCukCloTlSIEVyTjWdlb1lBi1v55BRPD56veEJJR/WmfJtph9\ngaRCXJU9d9DzSpCIPmHYrZHSI8E00vMV7IJLd3TrrWs8yMURpK/Lj+fXZvlLcUOS\nDIUKtqMHA5SZV0zVpEUZTc3P+wKBgQDD7sDuyhIpVFAfUwx532JM4IBu+iNfGKB/\nej8M0Y0pixO80MCAYv99Q/993v4whHNQk6zSJbma+7DCjkHs4bwGgSJHnOSOCu4I\n2vUJZYSa+l6bHSLVRgd61W62NzrvHXC7j37vWRP71ue8DU6DMbABQblbRbYl1TKG\nqebu7te4LQKBgQCLz4LKF4/I4Yhe22AwNEQ0JXGvhpBNaGmnqLCg4AoWU11Sz0n6\nU4ZaPevt3iRAxcRwAGEXq5YBehjdgNnit5LQRu15XLGB9oUsApsnHUYIUlgvFec6\nb0lRjQ9puUapYscbW1o3InPtXkuujDRDFEKZN0cdtpxCHCXevSanzeUNrwKBgQCJ\ntAdMzCAvg9475bZjASipNy+Mz6iEcV57uYMOk0hO5jwc++oPUYSWmW+7GzozByO0\ngdV4bKMh1brJQgn7XjszpxZcllvbqLra5mhJDlxAP661/ag5lFo1bkO9NNvqqhpM\n9/ESbtyopsV/WSrQ8d7tQy/ugfQeatRz6H0xeBOMkQKBgF4JNELxoqVnUaRogO/9\nu9kvJVhUG71VYMFzdG9tS/Lv1uDJUsbzBsUWU3RU1ldnylB0PUCoZES4E7QR6IoP\nQenTWLRaOsDwNBJN6PTjTQKIIqx3swz7kUO0ufp1uTiG2AgiNfKOkLmkid64TiGN\n072dduh2uZLesuI6kuCU0m0Y\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@crepescema.iam.gserviceaccount.com",
    client_id: "107225784550808873640",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40crepescema.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const bd = admin.firestore();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/produtos', async (req, res) => {
    try {
        const response = await bd.collection("produtos")
            .orderBy("nome", "asc").get();
        const produtos = response.docs.map(doc => ({
            id: doc.id, ...doc.data(),
        }));
        console.log(produtos)
        res.status(200).json({ produtos });
        console.log('Cartões devolvidos com sucesso!')
    } catch (e) {
        console.log(e);
        res.status(500).json({ mensagem: 'Erro' + e })
        console.log('Erro ao buscar dados' + e)
    }
});

app.get('/usuarios', async (req, res) => {
    try {
        const response = await bd.collection("usuarios").get();
        const usuarios = response.docs.map(doc => ({
            id: doc.id, ...doc.data(),
        }));
        console.log(usuarios);
        res.status(200).json({ usuarios });
        console.log('Itens do usuarios devolvidos com sucesso!');
    } catch (e) {
        console.log(e);
        res.status(500).json({ mensagem: 'Erro ao buscar itens do usuarios: ' + e });
        console.log('Erro ao buscar dados: ' + e);
    }
});


app.post('/usuarios', async (req, res) => {
    const { usuario, produtoId } = req.body;

    if (!usuario || !usuario.nomeUx || !usuario.turma || !usuario.nChamada) {
        return res.status(400).json({ mensagem: 'Dados do usuário inválidos!' });
    }

    if (!produtoId) {
        return res.status(400).json({ mensagem: 'ID do produto inválido!' });
    }

    try {
        const novoItemRef = await bd.collection('usuarios').add({
            usuario: usuario, // Armazena apenas nome, turma e chamada do usuário
            produtoId: produtoId, // Armazena apenas o ID do produto
            adicionadoEm: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).json({ mensagem: 'Produto adicionado ao carrinho!', id: novoItemRef.id });
        console.log('Produto adicionado ao carrinho com ID:', novoItemRef.id);
    } catch (error) {
        console.error('Erro ao adicionar ao carrinho!', error);
        res.status(500).json({ mensagem: 'Erro ao adicionar ao carrinho' });
    }
});

app.delete('/usuarios', async (req, res) => {
    const { usuarioNome, produtoId } = req.body;

    if (!usuarioNome || !produtoId) {
        return res.status(400).json({ mensagem: 'Dados inválidos! Necessário nome do usuário e ID do produto.' });
    }

    try {
        const querySnapshot = await bd.collection('usuarios')
            .where("usuario.nomeUx", "==", usuarioNome)
            .where("produtoId", "==", produtoId)
            .get();

        if (querySnapshot.empty) {
            return res.status(404).json({ mensagem: `Produto com ID ${produtoId} não encontrado no carrinho do usuário ${usuarioNome}!` });
        }

        querySnapshot.forEach(async (doc) => {
            await doc.ref.delete();
            console.log(`Produto ${produtoId} removido do carrinho do usuário ${usuarioNome}.`);
        });

        res.status(200).json({ mensagem: `Produto ${produtoId} removido do carrinho do usuário ${usuarioNome}.` });
    } catch (error) {
        console.error("Erro ao remover produto do carrinho!", error);
        res.status(500).json({ mensagem: "Erro ao remover produto do carrinho" });
    }
});

module.exports = app

// MADE BY GUILHERME ZUCHELLI FELIPETTO