const cors = require('cors');
const express = require('express');
const admin = require("firebase-admin");

const serviceAccount = {
    type: "service_account",
    project_id: "backend-portgf",
    private_key_id: "5f57b4e5cb15747c8a0b5405cbdff92a43720ce5",
    private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCcbLE8irn1akPJ\nnocNwPaFY4othpZU6BYzc0tEINpBlSW19oDAszX1JCOc8Xa1/kdLGMdh1dzk/TZx\n3jS3y9jvmqhteXgtRpPKqBaFXSG62z9ku+zjEXa7lTcKBX9LhHnQTHDjojwFPIKx\nfsg98k8NbOBrkS56Y+6iq36plY39/KQzhk8P2HZfsIVPop77okbNtSIKmQTD46j7\n5Ma//2IX/ydq8nUk2oxpJ8ao4mlM9aWtTt6XmT03t+rzybg5CAOC2E9oWAUxo0gt\nqSFkuUJr0sEAbptNcFA9FLi9BWM38ngX+VFn7556rZNA2QJ2yruvOLfVFmNhlKch\n3jiBafWfAgMBAAECggEAD1YizG5HjDXGfqqR0Dnmka5wOkVzUNDOeG3p57yW2Y4/\ne8c22W3YsPfBnB4ahv5uzACab8+xkCv5XhGstoaAdwGBWPZrX3kHfXucdafrajAb\n14sLTzoDm6GmG0/tqqBK9y6/dLoPy22i3Lcy98vdj1Ho8PLzjSFmIMHSsdrNaKTo\nroOWE37jA2iwjRogA13w+w3k/GMzr3839GPEx++LDtx6JCY3zHXOjXcIrTaBgG/N\nsgA0GPhCZqJTXlueOb0m7Q/csDk4gex964sKAnDGSdgOOrjX2SJVtTvEpDkUJpFH\nRMaH9w0dPPza4g41RhdZqxQ/BCinxMF47vAlxwQWKQKBgQDZZtPSeG5R+ryFFZOr\npbh9jvSRu9DS6qX8R4DPL4AY1CGRL+vwxbUqlNAKANpmDPaZHVG1RxumK9Us6f4B\ng5HwlYL3lkFz3I7uiPBoDWrzeOj3E3U+dtuasE3cF6MgwzxFoc388W1CHwkoGaIA\nSTwP2F5rZoTC15ItvgLLlOXnaQKBgQC4MmGgERx4pZZlO5C6lQDwoN3EB8cEOPGF\nHjhLUpIr04MHDlRE9QtntxNsZ//G5IxmjT5v90qtlLYj00sfatfq4Mq0lm3zRryW\nCpjonQ5+VdhlJ/THMgJg54lAm6x4DnZCKCsFg6I9/rBbLi73pd96mSl1l3qfJfBR\npuggUpMbxwKBgQCV+AodQXiQ0s+jWrwQh3RaIPhzY8VtCfNQsZ6YzeKmvgcd2Zn/\n8NLFufw9OlNuXHjsLL6Ft7TKD6ixoATZ1IIjHXBIDP2/yCFNSWfVz5O8uuayMlkJ\nqwJYllBPiHq+ig+U1UZ8u6qsFy7A29XWLq7hG1ge7IyewAiVx2K0P1XNKQKBgQCZ\nA3FJ8Sz/pD7dda/y71jKjDftYrCW917bQJFvMPawZZKRR/wFFLMWw2TlRzeZV76y\nal8V0A4/SCxOcnYTcURQn9CEV/qaf4al9cO0aNPjaxjKX3jeCNMlAPJps2iAizL+\nHjQu7nzWlz6VYDYwD6EoTRe90cpRbsjGa6qlPzNpfQKBgHKr3PtON47gLPw1gULO\n5nV39hCgyfdVkcqgvS/3qKAA3+AQg+MM7mihZ0njIq5Yzb82Fs0aVbNCDtV71uIb\nqH/DQF97rS5C7G6niCqrcrN8gigjDRZTD3oYTazEWcueKoymVrDcX950awLmFezN\nqla3O0z3C7PhaExV6/q2fWrO\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-fbsvc@backend-portgf.iam.gserviceaccount.com",
    client_id: "100879937447504191525",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40backend-portgf.iam.gserviceaccount.com",
    universe_domain: "googleapis.com"
}

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

app.post('/produtos', async (req, res) => {
    const { nome, descricao, imgSrc, } = req.body
    if (!nome) {
        res.status(400).json({ mensagem: 'Nome do cartão inválido!' })
        console.log('Novo cartao não cadastrado')
    }
    else if (!descricao) {
        res.status(400).json({ mensagem: 'descricao do cartão inválido!' })
        console.log('Novo cartao não cadastrado')
    }
    else if (!imgSrc) {
        res.status(400).json({ mensagem: 'imgSrc do cartão inválido!' })
        console.log('Novo cartao não cadastrado')
    } else {
        try {
            const novoCartaoRef = await bd.collection('produtos').add({
                nome: nome,
                descricao: descricao,
                imgSrc: imgSrc,
                criadoEm: admin.firestore.FieldValue.serverTimestamp()
            })
            res.status(201).json({ mensagem: 'Cartao cadastrado com sucesso', id: novoCartaoRef.id })
            console.log('Novo cartão cadastrado com ID:', novoCartaoRef.id)
        } catch (error) {
            console.error('Erro ao cadastrar cartão!', error)
            res.status(500).json({ mensagem: 'Erro ao cadastrar cartão' })
        }
    }
})

module.exports = app

// app.delete('/produtos', async (req, res) => {
//     const { id } = req.body;
//     if (!id) {
//         res.status(400).json({ mensagem: 'Id não fornecido' });
//         console.log('Id não fornecido');
//     } else {
//         try {
//             const cartaoRef = bd.collection('produtos').doc(id);
//             const doc = await cartaoRef.get();
//             if (!doc.exists) {
//                 res.status(404).json({ mensagem: `Cartão com Id ${id} não encontrado` });
//                 console.log('Cartão não encontrado');
//             } else {
//                 await cartaoRef.delete();
//                 res.status(200).json({ mensagem: `Cartão com Id ${id} excluido` });
//                 console.log(`Cartão com Id ${id} excluido`);
//             }
//         } catch (error) {
//             console.error('Erro ao excluir cartão!', error);
//             res.status(500).json({ mensagem: 'Erro ao excluir cartão' });
//         }
//     }
// });

// app.put('/produtos', async (req, res) => {
//     const { nome, descricao, imgSrc, link, img, id } = req.body
//     if (!id) {
//         res.status(400).json({ mensagem: 'Id não fornecido' })
//         console.log('Cartão não atulizado, Id inválido')
//     } else {
//         try {
//             const cartaoRef = bd.collection('produtos').doc(id)
//             const doc = await cartaoRef.get()
//             if (!doc.exists) {
//                 res.status(404).json({ mensagem: 'Cartão com id ' + id + ' não encontrado' })
//                 console.log('Cartão não encontrado')
//             } else {
//                 const dadosAtualizados = {}
//                 if (nome) dadosAtualizados.nome = nome
//                 if (descricao) dadosAtualizados.descricao = descricao
//                 if (imgSrc) dadosAtualizados.imgSrc = imgSrc
//                 if (link) dadosAtualizados.link = link
//                 if (img) dadosAtualizados.img = img
//                 await cartaoRef.update(dadosAtualizados)
//                 res.status(200).json({ mensagem: 'Cartão com id ' + id + ' atulizado' })
//                 console.log('Cartão com id ' + id + ' atulizado')
//             }
//         } catch (e) {
//             console.error('Erro ao atulizar cartão!', error)
//             res.status(500).json({ mensagem: 'Erro ao atulizar cartão' })
//         }
//     }
// })