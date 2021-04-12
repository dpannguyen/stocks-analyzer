## Build project

* Under */server*, run
    ```
    npm install express body-parser
    ```
* Under */server/services*, run
    ```
    npm install express body-parser crypto express-openid-connect ibm-cos-sdk
    ```
* Under each service folder in */server/services/*, run
    ```
    npm install express body-parser
    ```


## Run project

* Run API Gateway
    ```
    node /server/APIGateway.js
    ```
    * Open *http://localhost:44444/* to verify
* Run each service, e.g.
    ```
    node /server/services/marketIndex/marketIndex.js 8081
    ```
    * Open *http://localhost:8081/* to verify
* Run subscriber
    ```
    node /server/services/subscriber.js
    ```
    * Open *http://localhost:3000/* to verify
* Run UI
	```
    cd frontend/
	npm install
	npm start
    ```
	http://localhost:3000/ should open automatically open in your browser