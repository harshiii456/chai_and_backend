import express from 'express';
const app = express();
// app.get('/', (req, res) => {
//   res.send('Server is ready');
// });


// get a list of 5 jokes
app.get('/api/jokes', (req, res) => {
  const jokes = [
    {
      "id": 1,
      title: "Why don't scientists trust atoms?",
      content: "Because they make up everything!"
    }
    ,
    {
      "id": 2,
      title: "Why did the scarecrow win an award?",
      content: "Because he was outstanding in his field!"
    },
    {
      "id": 3,
      title: "Why don't programmers like nature?",
      content: "It has too many bugs!"
    },
    {
      "id": 4,
      title: "Why did the math book look sad?",
      content: "Because it had too many problems!"
    },
    {
      "id": 5,
      title: "What do you call fake spaghetti?",
      content: "An impasta!"
    }
  ];
  res.send(jokes);
  });


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});