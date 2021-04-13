const server = require('./server');
const config = require('./config');

const port = process.env.PORT || config.port;

server.create()
    .then(app => {
        app.listen(port, () => {
            console.log(`Server has started on port ${port}!`);
        });
    }).catch(err => console.log(err));