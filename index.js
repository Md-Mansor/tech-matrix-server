const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;





// middleware
app.use(cors());
app.use(express());


app.get('/', (req, res) => {
    res.send('tech-project is running')

})


app.listen(port, () => {
    console.log(`tech-server is running on port ${port}`);
})