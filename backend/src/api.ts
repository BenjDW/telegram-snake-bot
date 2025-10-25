//routes api front
// get exe : fetch('http://localhost:3000/api/users/42')
// post fetch('http://localhost:3000/api/scores', {
//   method: 'POST',
//   headers: { 'Content-Type': 'application/json' },
//   body: JSON.stringify({ user: 'Albert', score: 1200 })
// })
// put , maj of the existing value
// delete
// patch modify partial value

//routes api with express
// app.use(express.json()) : read the json from the front
// get exe : app.get('/', (req, res) => {
//   res.send('Bienvenue sur le backend !')
// })
// 
// post app.post('/api/scores', (req, res) => {
//   const { user, score } = req.body
//   console.log('Nouveau score reçu :', user, score)
//   res.json({ message: 'Score enregistré avec succès !' })
// })
// put , maj of the existing value
// delete
// patch modify partial value