## Build project

* Download and extract redis
    ```
    $ wget https://download.redis.io/releases/redis-6.2.1.tar.gz
    $ tar xzf redis-6.2.1.tar.gz
    $ cd redis-6.2.1
    $ make
    ```

* Under `/server`, run
    ```
    npm install express body-parser redis
    ```
* Under `/server/services`, run
    ```
    npm install express body-parser redis crypto express-openid-connect ibm-cos-sdk
    ```
* Under each service folder in `/server/services/`, run
    ```npm install express body-parser
    ```


## Run project

* Run redis
    ```
    $ src/redis-server
    ```
* Run API Gateway
    ```
    node /server/APIGateway.js
    ```
    * Open `http://localhost:44444/` to verify
* Run each service, e.g.
    ```
    node /server/services/marketIndex/marketIndex.js 8081
    ```
    * Open `http://localhost:8081/` to verify
* Run subscriber
    ```
    node /server/services/subscriber.js
    ```
    * Open `http://localhost:3000/` to verify
