const cors = require('cors');
const express = require('express');
const admin = require("firebase-admin");

const serviceAccount = {
  type: "service_account",
  project_id: "crepescema",
  private_key_id: "97ba2a854a6e1bef5e9d2fbb22cf131baeae6684",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCU/2VIRuxSdkIz\niJ8Si8tqSAdbs0y3YlRG/25xUVwGRMkI8vbQJhfnG5PzUEGoPCI11q/DZ3jKLH5R\ndpB4V6fkNYgZm6vm/Q8DfZ50YpQa+KT8KtV+I4RaXO7oP6ZXoZYtlqLztd/BUAP2\nC1CGllvJBz6pibPyMMFiPJQkznELSzLLfzWtOcTHAAugM8fBVkSUYuYr33qCD5Es\ny9UNV7NzmnU0wlO/UjeL/+wZD7Fw56CSrqdC4az8U+pLkR0VKWGEGuTAbHF93WXv\nMm7ahCoQQzjS0/5DRp2zSfO66Hvzo6fsaPQlXm3M9mAWHr+mbKKEvFPEkOjac9ri\n+Nibkq+7AgMBAAECggEAA9OHM1L28KsuygoBI8XJRIJzBezV1IPG7EfU+z3+of6U\nNxGeOvwvcvTnWME/3mUk78MCon7+wBpiaA8maKC/pAGn7BhuUrE++HT6Y7zAVuz5\nt6wV7XZWCMgILpir2eZBaAxNRPrvsxQt9dyWhc5IryHrfwkVQOv1m2M43rUafBK5\nQ2uRbLmr6K8XhX4xomF1O89AMGL8vG8ho+tiJ9AHaLGUq+kJbX0Jclaex7Mkulw6\nvIMiQIf+ED9IdkvZy8X4/h04K64Eg2il/2gEOSLLTbgjqmcBlWpGvF9W2CsJJB48\nngB7d/WtOkNJ/lXvys/jRwFLvknubRPghcoQNAmdeQKBgQDIa9cAi0G/Qq9Bkq1C\nzTsnrpLuL/BW3zR6OcVLai8BuO1DriLuALWOWubyS5cir9NdbT9yQQnfde4B/rE1\nag17e8rHz1C7BXHTQqWSadjj4utQZ6xiohZggsc8UTEBF5ctlUi6Dozn3bo5CPNy\nZpKn8D7ez76HEavD4S1XtANgFwKBgQC+UO2XzpkpNV7neRws8msuWX5wNKTkJHke\nsvvg6xQgM+jDx8URs0kCuiNNHB+CNGJuiWPVr4O/fpZ5egDmDWgkFHMODOpmZWHG\nr+T9HtTinpjzvo+AL5WFV75PcfLoWtm2sQHitg4Iwfrb0Hz3CqlxPdpIJbLJXpAs\nqEP5qfuv/QKBgFcMx9Cbq43X9+kCPTDjlQryPy0nMzt4LQHdb70GvK4B1UPtMYyw\nUCspfl/ExzswpRxSJBmK+C/Pt/Wz2uI5UuvMY9IPUKA6iCrbKrECOksYt14v+WbJ\nwfBfPQwMs70msuoAihsN0NOwsX6uTZblyFMa/SOnlbhyy2kDt779F+43AoGABT3b\nXVv+Uek7ZOqsAPzoQM2MMvDwPaxXfaX2U/qFgmGLnqDI57TlZOLViBEnOQHSWDMG\ngeMkoMiOwme+0Jc78Ap0JMXsSseuCrfbebE4sckmc0gjUad92b9R6YQ86XNfHa4A\nXEshVdJp41X5qyArDIhkk6oeI3esRt6XiK/K080CgYEAqOABkDdFGzRqIeUQwVJK\nQbycpP8uhD2HtZ4KMvgPffalka+kVLkdzfgjohwiMoI45HIhAFqAtM32ZsNbtYUm\naHCmcSxvHHQa3Rj13DCCH4c6W4gGa1EnKoNRm64kCpDUmSCD80ptgwNo2ZLxpBHW\nkLabnY6onaWAP+OUKetfVJk=\n-----END PRIVATE KEY-----\n",
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

// Caminhos da tela DOS produtos

app.get('/produtos', async (req, res) => {
    try {
        const response = await bd.collection("produtos")
            .orderBy("imgSrc", "asc").get();
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
    }
    else if (!link) {
        res.status(400).json({ mensagem: 'Link do cartão inválido!' })
        console.log('Novo cartao não cadastrado')
    }else {
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

module.exports = app